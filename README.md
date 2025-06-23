# AIKP — AI Assistant 📚

AIKP is an AI assistant you can talk to through the web (Next.js) and external platforms (Discord first, more to come).  
This repository contains the **monolithic web service** that powers AIKP's dashboard, authentication, database, and public API.

---

## Table of Contents

1.  Project Vision
2.  Tech Stack
3.  Requirements Snapshot
4.  Local Setup
5.  Useful Scripts
6.  Environment Variables
7.  Database (Docker)
8.  Deployment
9.  Contributing

---

## 1 Project Vision

_Provide users with a seamless, secure way to chat with AIKP and manage their data._

High-level goals (see `requirements.md` for full list):

1.  Multi-channel access (web chat & Discord).
2.  Secure auth with user-controlled data.
3.  Personal + global AI memory layers.
4.  Extensible third-party integrations.

---

## 2 Tech Stack

(Condensed from `llms.md`)

| Layer       | Tech                                                           |
| ----------- | -------------------------------------------------------------- |
| Runtime     | **Next.js 15** (App Router, React 19)                          |
| Language    | **TypeScript strict**                                          |
| Styling     | **Tailwind CSS 4** + class-variance-authority + tailwind-merge |
| ORM         | **Drizzle ORM** (PostgreSQL)                                   |
| Auth        | **better-auth** (NextAuth-inspired)                            |
| DB Dev      | `drizzle-kit` migrations, Postgres 17 (Docker)                 |
| Tooling     | ESLint 9 + Prettier 3 (Tailwind plugin) + Turbopack            |
| Package Mgr | **pnpm**                                                       |

_All project conventions & rules are detailed in [`llms.md`](./llms.md)._

> Never access `process.env` directly – import `env` from `@/env` instead.

---

## 3 Requirements Snapshot

From `requirements.md` (non-technical):

- **Authentication** — secure login.
- **Account Linking** — start with Discord.
- **Data Dashboard** — web UI to view/manage personal data.
- **Conversational Access** — web chat + Discord bot.
- **AI Memory** — personal & global context layers.
- **Integrations** — plug in external tools with user-linked accounts.

---

## 4 Local Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Spin up Postgres
pnpm dlx --yes docker compose -f docker-compose.dev-postgres.yml up -d

# 3. Create a .env.local (see below)
cp .env.local.example .env.local

# 4. Generate & push initial schema
pnpm run db:generate
pnpm run db:push

# 5. Start dev server (Turbopack)
pnpm dev
```

Then open <http://localhost:3000>.

---

## 5 Useful Scripts

| Script                      | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `pnpm dev`                  | Next.js dev server (Turbopack)                                        |
| `pnpm build` / `pnpm start` | Production build & serve                                              |
| `pnpm lint`                 | ESLint + Prettier check (Prettier runs on **every commit** via Husky) |
| `pnpm run db:generate`      | Generate SQL from Drizzle schema                                      |
| `pnpm run db:push`          | Apply SQL migrations to the dev DB                                    |
| `pnpm run db:auth`          | Generate auth tables via better-auth CLI                              |

---

## 6 Environment Variables

Managed & validated in `src/env.ts` (Zod).  
Create a `.env.local` at the repo root:

```bash
BETTER_AUTH_SECRET=replace_me
DATABASE_URL=postgresql://devuser:devpass@localhost:5432/devdb
BETTER_AUTH_URL=http://localhost:3000
```

Add new vars by editing `src/env.ts` **and** this README.

---

## 7 Database (Docker)

The dev Postgres container lives in `docker-compose.dev-postgres.yml`.

```bash
# Launch detached
pnpm dlx --yes docker compose -f docker-compose.dev-postgres.yml up -d
```

Default credentials (see `.env.local.example`):

| user    | password | db    | port |
| ------- | -------- | ----- | ---- |
| devuser | devpass  | devdb | 5432 |

---

## 8 Deployment

The app is optimised for **Vercel**:

1.  Create a new project, set root to repo root (monolithic).
2.  Install Postgres add-on or point `DATABASE_URL` to external DB.
3.  Set env vars.
4.  Build & deploy.

_Docker_ deployments are also possible – set `output: "standalone"` in `next.config.ts` and build a container.

---

## 9 Contributing

We follow the **AI Contributor Guide** in `llms.md`:

1.  Use **pnpm**.
2.  Keep commits small & logical.
3.  Ensure `pnpm lint` passes.
4.  Prettier runs automatically via Husky on commit.
5.  Stick to the conventions documented in `llms.md`.

Feel free to open issues or PRs – feedback is welcome!
