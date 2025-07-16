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
| ORM         | **Drizzle ORM** (PostgreSQL)              |
| Auth        | **better-auth** (NextAuth-inspired)       |
| Package Mgr | **pnpm**                                  |
