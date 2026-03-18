#!/usr/bin/env node

/**
 * Postinstall script for @rehpic/vcli
 *
 * The systray2 package ships pre-built tray binaries compiled with an old Go version.
 * On macOS 15+ ARM64, the binary crashes. This script detects that case and recompiles
 * the binary from source using Go (if available).
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir, platform, arch } from 'os';
import { createRequire } from 'module';

if (platform() !== 'darwin' || arch() !== 'arm64') process.exit(0);

// Find the systray2 tray binary
let trayBinDir;
try {
  const require = createRequire(import.meta.url);
  const systrayPath = require.resolve('systray2');
  trayBinDir = join(dirname(systrayPath), 'traybin');
} catch {
  // systray2 not installed yet (shouldn't happen in postinstall)
  process.exit(0);
}

const trayBin = join(trayBinDir, 'tray_darwin_release');
if (!existsSync(trayBin)) process.exit(0);

// Check if the binary is already ARM64
try {
  const fileInfo = execSync(`file "${trayBin}"`, { encoding: 'utf-8' });
  if (fileInfo.includes('arm64')) {
    // Already ARM64, no need to recompile
    process.exit(0);
  }
} catch {
  // Can't check, skip
  process.exit(0);
}

// Need to recompile — check if Go is available
try {
  execSync('which go', { stdio: 'pipe' });
} catch {
  console.log(
    'vcli: systray2 binary is x86_64 — install Go to enable menu bar on ARM64 Mac',
  );
  process.exit(0);
}

console.log('vcli: Recompiling tray binary for ARM64...');

const tmpDir = join(tmpdir(), 'vcli-systray-build-' + Date.now());
try {
  mkdirSync(tmpDir, { recursive: true });

  // Write a minimal Go module and main file that wraps the systray-portable source
  writeFileSync(
    join(tmpDir, 'go.mod'),
    `module vcli-tray-build

go 1.21

require github.com/getlantern/systray v1.2.2
`,
  );

  // Download systray-portable source
  execSync(
    `cd "${tmpDir}" && git clone --depth 1 https://github.com/felixhao28/systray-portable.git src 2>/dev/null`,
    { stdio: 'pipe', timeout: 30000 },
  );

  // Update go.mod in the cloned source
  writeFileSync(
    join(tmpDir, 'src', 'go.mod'),
    `module github.com/felixhao28/systray-portable

go 1.21

require github.com/getlantern/systray v1.2.2
`,
  );

  // Build
  execSync(
    `cd "${tmpDir}/src" && CGO_ENABLED=1 GOOS=darwin GOARCH=arm64 go build -ldflags "-s -w" -o "${trayBin}" tray.go`,
    { stdio: 'pipe', timeout: 120000 },
  );

  execSync(`chmod +x "${trayBin}"`, { stdio: 'pipe' });
  console.log('vcli: Tray binary recompiled successfully for ARM64.');
} catch (e) {
  console.log('vcli: Could not recompile tray binary:', e.message);
} finally {
  // Clean up
  try {
    execSync(`rm -rf "${tmpDir}"`, { stdio: 'pipe' });
  } catch {
    /* ignore */
  }
}
