# File Storage and Access Control

Files, such as organization logos, are stored privately in an S3-compatible object storage service (MinIO for local development, AWS S3 or R2 in production).

## Access Control Mechanism

Access to these files is controlled at the organization level to ensure data privacy and security.

1.  **Private Uploads**: All files are uploaded with `ACL: "private"`, meaning they are not publicly accessible by default.
2.  **Key Storage**: The database only stores the object key (e.g., `org-logos/<orgId>/logo.png`), not the full URL.
3.  **Presigned URLs**: File access is provided through a dedicated API endpoint (`/api/files/<key>`). This endpoint:
    1.  Authenticates the user making the request.
    2.  Verifies that the user is a member of the organization that owns the file.
    3.  Generates a temporary, presigned URL with a short expiration time (e.g., 1 hour).
    4.  Redirects the user to the presigned URL.

This approach ensures that only authenticated and authorized users can access organization-specific files, while keeping the storage implementation details abstracted from the frontend.

## Local S3 Storage (MinIO)

A MinIO container is included in `docker-compose.dev.yml` for local development.

- **Endpoint**: `http://localhost:9000`
- **Console**: `http://localhost:9001`
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`
- **Bucket**: `aikp-local` (pre-created and private)

To use the local file storage, you must configure the appropriate [environment variables](./../getting-started/02-environment-variables.md).
