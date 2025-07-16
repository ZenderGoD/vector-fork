# Tech Stack

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

## Non-Functional Requirements

- **Security:** Org-scoped authentication; Discord tokens encrypted at rest.
- **Scalability:** Stateless Next.js deployment; horizontal scaling for API and bot.
- **Reliability:** Notification retry logic; monitoring and alerting on failures.
