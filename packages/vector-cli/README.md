# Vector CLI

CLI for interacting with a Vector workspace from the terminal.

This package wraps the same auth and Convex-backed workflows used by the app, so you can manage orgs, roles, teams, projects, issues, documents, notifications, and admin settings without opening the UI.

## Install

```bash
npm install -g @xrehpicx/vector-cli
```

Then verify the install:

```bash
vector --help
```

## Requirements

- Node.js `>=20.19.0`
- A running Vector app
- Access to the app's Convex deployment

The CLI talks to:

- the Next.js app for auth routes
- the Convex deployment for queries, mutations, and actions

By default it uses:

- `http://localhost:3000` as the app URL
- `NEXT_PUBLIC_CONVEX_URL` or `CONVEX_URL` for Convex

You can override either with flags:

```bash
vector --app-url http://localhost:3000 --convex-url https://<deployment>.convex.cloud --help
```

## First Run

Sign up or log in:

```bash
vector auth signup --email you@example.com --username you --password 'secret'
vector auth login you@example.com --password 'secret'
vector auth whoami
```

Create and select an org:

```bash
vector org create --name "Acme" --slug acme
vector org use acme
```

From there, most commands can rely on the active org. You can always override it with `--org <slug>`.

## Profiles

Sessions are stored per profile in:

```text
~/.vector/cli-<profile>.json
```

Examples:

```bash
vector --profile work auth login you@example.com --password 'secret'
vector --profile staging --app-url http://localhost:3001 auth whoami
```

Use profiles when you work across multiple environments or accounts.

## Common Commands

Inspect the current session:

```bash
vector auth whoami
vector org current
vector org members acme
```

Discover workspace metadata before mutating:

```bash
vector refdata acme
vector search --org acme "billing"
vector permission check issue:create --org acme
```

Create core entities:

```bash
vector team create --org acme --key eng --name "Engineering"
vector project create --org acme --key api --name "API" --team eng
vector issue create --org acme --title "Ship CLI" --project api --team eng
vector document create --org acme --title "CLI Notes"
vector folder create --org acme --name "Runbooks"
```

Issue workflows:

```bash
vector issue list --org acme
vector issue assignments API-1
vector issue set-priority API-1 High
vector issue replace-assignees API-1 "alice,bob"
vector issue comment API-1 --body "Investigating now."
```

Invites and notifications:

```bash
vector org invite acme --email teammate@example.com
vector invite list
vector invite accept <inviteId>
vector notification inbox --filter unread
vector notification unread-count
```

Settings metadata:

```bash
vector priority list acme
vector state list acme
vector status list acme
vector role list acme
```

Platform admin:

```bash
vector admin branding
vector admin signup-policy
```

## JSON Output

Use `--json` for automation and scripts:

```bash
vector --json issue list --org acme
vector --json notification inbox --filter unread
```

For scripts, prefer:

- `--json`
- `--profile`
- `--org`

## Troubleshooting

`Not logged in`

- Run `vector auth login` or `vector auth signup`.

`Organization slug is required`

- Pass `--org <slug>` or run `vector org use <slug>`.

Auth errors against the wrong app

- Make sure `--app-url` points at the running Vector app origin.

Convex connection errors

- Set `--convex-url`, `NEXT_PUBLIC_CONVEX_URL`, or `CONVEX_URL`.

Validation errors when creating teams or projects

- Use short slug-like keys such as `eng`, `api`, or `mobile-platform`.

## Help

Inspect command groups directly:

```bash
vector auth --help
vector org --help
vector issue --help
vector notification --help
vector admin --help
```
