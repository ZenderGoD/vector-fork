/**
 * Interactive terminal relay for the bridge.
 *
 * For each active work session with a viewer:
 * 1. Spawns a PTY running `tmux attach-session` (node-pty)
 * 2. Starts a local WebSocket server (ws) that pipes PTY I/O
 * 3. Opens a public tunnel (tunnelmole) so any device can connect
 * 4. Writes the tunnel URL to Convex so the frontend knows where to connect
 *
 * Pure JS — no binary distribution needed.
 */

import { createServer, type Server } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { ConvexClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import * as pty from 'node-pty';
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';
import localtunnel from 'localtunnel';

function findTmuxPath(): string {
  for (const p of [
    '/opt/homebrew/bin/tmux',
    '/usr/local/bin/tmux',
    '/usr/bin/tmux',
  ]) {
    if (existsSync(p)) return p;
  }
  return 'tmux';
}

interface TerminalPeerConfig {
  deviceId: string;
  deviceSecret: string;
  convexUrl: string;
}

interface ActiveTerminal {
  ptyProcess: pty.IPty;
  httpServer: Server;
  wss: WebSocketServer;
  tunnel: { close: () => void };
  tunnelUrl: string;
  token: string;
  workSessionId: string;
  tmuxSessionName: string;
  port: number;
}

function ts() {
  return new Date().toISOString().slice(11, 19);
}

// Find an available port
function findPort(start = 9100): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      const port = typeof addr === 'object' && addr ? addr.port : start;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

export class TerminalPeerManager {
  private config: TerminalPeerConfig;
  private client: ConvexClient;
  private terminals = new Map<string, ActiveTerminal>();
  private failedSessions = new Set<string>();
  private pendingStops = new Map<string, ReturnType<typeof setTimeout>>();
  private unsubscribers = new Map<string, () => void>();

  constructor(config: TerminalPeerConfig) {
    this.config = config;
    this.client = new ConvexClient(config.convexUrl);
  }

  watchSession(
    workSessionId: Id<'workSessions'>,
    tmuxSessionName: string,
  ): void {
    if (this.unsubscribers.has(workSessionId)) return;

    const unsub = this.client.onUpdate(
      api.agentBridge.bridgePublic.getWorkSessionTerminalState,
      {
        deviceId: this.config.deviceId as Id<'agentDevices'>,
        deviceSecret: this.config.deviceSecret,
        workSessionId,
      },
      state => {
        if (!state) return;

        const terminal = this.terminals.get(workSessionId);

        if (
          state.terminalViewerActive &&
          !terminal &&
          !this.failedSessions.has(workSessionId)
        ) {
          // Cancel any pending stop
          const pendingStop = this.pendingStops.get(workSessionId);
          if (pendingStop) {
            clearTimeout(pendingStop);
            this.pendingStops.delete(workSessionId);
          }

          console.log(`[${ts()}] Viewer active for ${tmuxSessionName}`);
          void this.startTerminal(
            workSessionId,
            tmuxSessionName,
            state.terminalCols,
            state.terminalRows,
          );
        } else if (!state.terminalViewerActive && terminal) {
          // Debounce stop to handle React strict mode double-renders
          if (!this.pendingStops.has(workSessionId)) {
            this.pendingStops.set(
              workSessionId,
              setTimeout(() => {
                this.pendingStops.delete(workSessionId);
                console.log(`[${ts()}] Viewer inactive for ${tmuxSessionName}`);
                this.stopTerminal(workSessionId);
                this.failedSessions.delete(workSessionId);
              }, 2000),
            );
          }
        }
      },
    );
    this.unsubscribers.set(workSessionId, unsub);
  }

  unwatchSession(workSessionId: string): void {
    const unsub = this.unsubscribers.get(workSessionId);
    if (unsub) {
      unsub();
      this.unsubscribers.delete(workSessionId);
    }
    this.stopTerminal(workSessionId);
  }

  private async startTerminal(
    workSessionId: string,
    tmuxSessionName: string,
    cols: number,
    rows: number,
  ): Promise<void> {
    if (this.terminals.has(workSessionId)) return;

    const tmuxBin = findTmuxPath();

    try {
      // 1. Find a free port
      const port = await findPort();

      // 2. Spawn PTY
      console.log(
        `[${ts()}] Spawning PTY: ${tmuxBin} attach-session -t ${tmuxSessionName}`,
      );
      const ptyProcess = pty.spawn(
        tmuxBin,
        ['attach-session', '-t', tmuxSessionName],
        {
          name: 'xterm-256color',
          cols: Math.max(cols, 10),
          rows: Math.max(rows, 4),
          cwd: process.env.HOME ?? '/',
          env: { ...process.env, TERM: 'xterm-256color' },
        },
      );
      console.log(`[${ts()}] PTY started for ${tmuxSessionName}`);

      // 3. Generate auth token
      const token = randomUUID();

      // 4. Start WebSocket server with auth
      const httpServer = createServer();
      const wss = new WebSocketServer({ server: httpServer });

      wss.on('connection', (ws, req) => {
        // Validate token from query string
        const url = new URL(req.url ?? '/', `http://localhost`);
        const clientToken = url.searchParams.get('token');
        if (clientToken !== token) {
          console.log(`[${ts()}] Rejected unauthorized WebSocket connection`);
          ws.close(4401, 'Unauthorized');
          return;
        }

        console.log(
          `[${ts()}] WebSocket client connected (${tmuxSessionName})`,
        );

        // PTY output → WebSocket
        const dataHandler = ptyProcess.onData(data => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
        });

        // WebSocket input → PTY
        ws.on('message', msg => {
          const str = msg.toString();

          // Check for resize control messages
          if (str.startsWith('\x00{')) {
            try {
              const parsed = JSON.parse(str.slice(1));
              if (parsed.type === 'resize' && parsed.cols && parsed.rows) {
                ptyProcess.resize(
                  Math.max(parsed.cols, 10),
                  Math.max(parsed.rows, 4),
                );
                return;
              }
            } catch {
              // not a control message
            }
          }

          ptyProcess.write(str);
        });

        ws.on('close', () => {
          console.log(
            `[${ts()}] WebSocket client disconnected (${tmuxSessionName})`,
          );
          dataHandler.dispose();
        });
      });

      await new Promise<void>(resolve => {
        httpServer.listen(port, '127.0.0.1', resolve);
      });
      console.log(`[${ts()}] WS server on port ${port}`);

      // 5. Open tunnel
      console.log(`[${ts()}] Opening tunnel...`);
      const tunnel = await localtunnel({ port });
      const tunnelUrl = tunnel.url;
      console.log(`[${ts()}] Tunnel: ${tunnelUrl}`);

      // Convert https:// to wss:// for WebSocket
      const wsUrl = tunnelUrl.replace(/^https?:\/\//, 'wss://');

      const terminal: ActiveTerminal = {
        ptyProcess,
        httpServer,
        wss,
        tunnel,
        tunnelUrl: wsUrl,
        token,
        workSessionId,
        tmuxSessionName,
        port,
      };
      this.terminals.set(workSessionId, terminal);

      // 6. Write tunnel URL + token to Convex
      await this.client.mutation(
        api.agentBridge.bridgePublic.updateWorkSessionTerminalUrl,
        {
          deviceId: this.config.deviceId as Id<'agentDevices'>,
          deviceSecret: this.config.deviceSecret,
          workSessionId: workSessionId as Id<'workSessions'>,
          terminalUrl: wsUrl,
          terminalToken: token,
        },
      );

      ptyProcess.onExit(() => {
        console.log(`[${ts()}] PTY exited for ${tmuxSessionName}`);
        this.stopTerminal(workSessionId);
      });
    } catch (err) {
      console.error(`[${ts()}] Failed to start terminal:`, err);
      this.failedSessions.add(workSessionId);
    }
  }

  private stopTerminal(workSessionId: string): void {
    const terminal = this.terminals.get(workSessionId);
    if (!terminal) return;

    try {
      terminal.ptyProcess.kill();
    } catch {
      /* */
    }
    try {
      terminal.tunnel.close();
    } catch {
      /* */
    }
    try {
      terminal.wss.close();
    } catch {
      /* */
    }
    try {
      terminal.httpServer.close();
    } catch {
      /* */
    }
    this.terminals.delete(workSessionId);
    console.log(`[${ts()}] Terminal stopped for ${terminal.tmuxSessionName}`);
  }

  stop(): void {
    for (const unsub of this.unsubscribers.values()) {
      try {
        unsub();
      } catch {
        /* */
      }
    }
    this.unsubscribers.clear();

    for (const id of this.terminals.keys()) {
      this.stopTerminal(id);
    }

    void this.client.close();
  }
}
