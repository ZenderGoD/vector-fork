# Database Setup

The development environment uses a PostgreSQL database running in a Docker container. The configuration is defined in the `docker-compose.dev.yml` file.

## Starting the Database

To start the database container, run the following command from the root of the project:

```bash
pnpm dlx --yes docker compose -f docker-compose.dev.yml up -d
```

This command will download the `postgres:17` image if you don't have it locally, and start a container in detached mode (`-d`).

## Database Credentials

The default credentials for the local database are:

| User      | Password  | Database | Port |
| --------- | --------- | -------- | ---- |
| `devuser` | `devpass` | `devdb`  | 5432 |

These values are configured in the `docker-compose.dev.yml` file and are referenced in the `sample.env` file for the `DATABASE_URL` environment variable.

## Migrations

Database schema changes are managed by Drizzle ORM. See the [Database Changes](../development/02-database-changes.md) guide for more information on how to create and apply migrations.
