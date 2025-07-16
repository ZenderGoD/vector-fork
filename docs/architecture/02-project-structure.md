# Project Structure

This document provides a high-level overview of the project's directory structure.

```
/aikp
├─ docker-compose.dev.yml      (Local Postgres & MinIO)
├─ drizzle.config.ts           (Drizzle ORM configuration)
├─ next.config.ts              (Next.js configuration)
├─ package.json                (Project dependencies and scripts)
├─ src/
│  ├─ app/                     (Next.js App Router: pages and layouts)
│  │  ├─ [orgId]/              (Organization-scoped routes)
│  │  ├─ api/                  (API routes, e.g., auth, file handling)
│  │  └─ ...
│  ├─ auth/                    (Authentication logic, permissions)
│  ├─ components/              (Reusable React components)
│  ├─ db/
│  │  └─ schema/
│  │     └─ index.ts           (Drizzle ORM table definitions)
│  ├─ entities/                (Business logic and service layer)
│  ├─ env.ts                   (Zod environment variable validation)
│  ├─ lib/                     (Shared libraries and utilities)
│  ├─ trpc/                    (tRPC routers and procedures)
│  └─ ...
├─ tsconfig.json               (TypeScript configuration with path aliases)
└─ .env.local                  (Local environment variables, not committed)
```
