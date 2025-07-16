# Environment Variables

The project uses Zod to validate environment variables at startup. The schema is defined in `src/env.ts`.

**Never access `process.env` directly.** Always import the validated `env` object from `@/env`.

## Local Setup (`.env.local`)

For local development, create a `.env.local` file in the root of the project. You can start by copying `sample.env`.

```bash
cp sample.env .env.local
```

### Required Variables

| Variable                | Description                                      | Example                                             |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------- |
| `APP_URL`               | The canonical public URL for the application.    | `http://localhost:3000`                             |
| `DATABASE_URL`          | Connection string for the PostgreSQL database.   | `postgresql://devuser:devpass@localhost:5432/devdb` |
| `BETTER_AUTH_SECRET`    | A secret key used to sign authentication tokens. | `generate_a_long_random_string`                     |
| `AWS_ACCESS_KEY_ID`     | Access key for your S3-compatible storage.       | `minioadmin`                                        |
| `AWS_SECRET_ACCESS_KEY` | Secret key for your S3-compatible storage.       | `minioadmin`                                        |
| `AWS_REGION`            | The AWS region for your S3 bucket.               | `us-east-1`                                         |
| `AWS_S3_BUCKET`         | The name of the S3 bucket for file storage.      | `aikp-local`                                        |

### Optional Variables

| Variable              | Description                                                 | Example                        |
| --------------------- | ----------------------------------------------------------- | ------------------------------ |
| `BETTER_AUTH_URL`     | The URL for the Better-Auth service. Defaults to `APP_URL`. | `http://localhost:3000`        |
| `S3_ENDPOINT`         | The endpoint for an S3-compatible service (like MinIO).     | `http://localhost:9000`        |
| `S3_FORCE_PATH_STYLE` | Set to `"true"` for MinIO. Defaults to `"false"`.           | `true`                         |
| `S3_PUBLIC_BASE_URL`  | Public URL for accessing S3 objects, if not standard.       | `https://files.example.com`    |
| `SMTP_HOST`           | Hostname of your SMTP server for sending emails.            | `smtp.mailgun.org`             |
| `SMTP_PORT`           | Port for the SMTP server.                                   | `587`                          |
| `SMTP_USER`           | Username for the SMTP server.                               | `user@example.com`             |
| `SMTP_PASS`           | Password for the SMTP server.                               | `supersecret`                  |
| `SMTP_FROM`           | The "from" address for outgoing emails.                     | `"AIKP" <noreply@example.com>` |

## Adding New Variables

1.  Add the variable to the Zod schema in `src/env.ts`.
2.  Add it to `sample.env` with a placeholder value.
3.  Update this documentation.
