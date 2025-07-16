# Common Commands

This project uses `pnpm` as its package manager and `husky` for git hooks. Here are some of the most common scripts you will use during development.

| Script                      | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `pnpm dev`                  | Starts the Next.js dev server with Turbopack.   |
| `pnpm build`                | Creates a production build of the application.  |
| `pnpm start`                | Starts a production server.                     |
| `pnpm lint`                 | Runs ESLint to check for code quality issues.   |
| `pnpm run db:generate`      | Generates SQL migration files for PostgreSQL.   |
| `pnpm run db:push`          | Applies migrations to the PostgreSQL database.  |
| `pnpm run db:auth:generate` | Generates auth-related schema tables.           |
| `pnpm prepare`              | Installs Husky git hooks for pre-commit checks. |

## Package Management

- To add a runtime dependency: `pnpm add <package-name>`
- To add a development dependency: `pnpm add -D <package-name>`
