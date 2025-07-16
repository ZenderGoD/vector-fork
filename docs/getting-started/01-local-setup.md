# Local Setup

This guide will walk you through setting up the AIKP project for local development.

## Prerequisites

- Node.js (v20.x or later)
- pnpm
- Docker

## Installation

1.  **Install dependencies**

    ```bash
    pnpm install
    ```

2.  **Set up environment variables**

    Copy the sample environment file to a new `.env.local` file:

    ```bash
    cp sample.env .env.local
    ```

    You will need to update the values in `.env.local` as needed. See [Environment Variables](./02-environment-variables.md) for more details.

3.  **Start the database**

    The project uses a PostgreSQL database running in a Docker container.

    ```bash
    pnpm dlx --yes docker compose -f docker-compose.dev.yml up -d
    ```

    This will start a Postgres container in the background.

4.  **Run database migrations**

    After setting up the database, you need to apply the database schema.

    ```bash
    pnpm run db:generate
    pnpm run db:push
    ```

5.  **Start the development server**

    ```bash
    pnpm dev
    ```

    The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Deployment

The app is optimised for **Vercel**:

1.  Create a new project, set root to repo root (monolithic).
2.  Install Postgres add-on or point `DATABASE_URL` to external DB.
3.  Set env vars.
4.  Build & deploy.

_Docker_ deployments are also possible – set `output: "standalone"` in `next.config.ts` and build a container.
