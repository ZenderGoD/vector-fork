# AIKP — AI Assistant 📚

AIKP is an AI assistant you can talk to through the web (Next.js) and external platforms (Discord first, more to come).
This repository contains the **monolithic web service** that powers AIKP's dashboard, authentication, database, and public API.

---

## Documentation

All documentation for this project, including setup guides, architectural overviews, and development conventions, can be found in the **[`/docs`](./docs/index.md)** directory.

- **[Getting Started](./docs/getting-started/01-local-setup.md)**: How to set up your local development environment.
- **[Full Documentation](./docs/index.md)**: The main entry point for all documentation.

## Tech Stack Summary

| Layer       | Tech                                      |
| ----------- | ----------------------------------------- |
| Runtime     | **Next.js 15** (App Router, React 19)     |
| Language    | **TypeScript strict**                     |
| Styling     | **Tailwind CSS 4** + cva + tailwind-merge |
| Database    | **Convex** (local development)            |
| Legacy ORM  | **Drizzle ORM** (PostgreSQL) - migrating  |
| Auth        | **better-auth** (NextAuth-inspired)       |
| Package Mgr | **pnpm**                                  |

## Local Development

### Convex Backend

```bash
# Start the local Convex development server
pnpm run convex:dev

# View the Convex dashboard
# http://localhost:6790/?d=anonymous-aikp
```

### Next.js Frontend

```bash
# Start the Next.js development server
pnpm run dev

# Visit the application
# http://localhost:3000
```

**Note:** Both Convex and Next.js need to be running simultaneously during development.
