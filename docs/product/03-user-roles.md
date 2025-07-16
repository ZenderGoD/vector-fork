# User Roles

The application uses a two-layer role system to manage user permissions: organization-level roles and project-level roles. This allows for flexible access control within and across different organizations.

## Organisation-level Roles

These roles are managed by `better-auth` and are stored in the `member.role` field.

| Role     | Permissions                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| `owner`  | Full control over the organization. Can delete the org. Only one owner per org (creator is auto-promoted). |
| `admin`  | Manage settings, members, billing, etc. Cannot delete the organization.                                    |
| `member` | Standard user, no administrative rights.                                                                   |

## Project-level Roles

These roles are specific to a project and are stored in the `project_member.role` field.

| Role     | Scope   | Capabilities                                   |
| -------- | ------- | ---------------------------------------------- |
| `lead`   | Project | CRUD on project, manage members, triage issues |
| `member` | Project | Create / update own issues & comments          |

## Lead-based Permissions

In addition to the formal roles, the system also recognizes "lead" status on certain resources, which grants additional permissions dynamically:

- **Project Leads**: Can perform most project operations on projects they lead.
- **Team Leads**: Can perform most team operations on teams they lead.
- **Issue Authors**: Can update issues they created.
- **Issue Assignees**: Can update issues they are assigned to.

This is handled by the permission policy engine. For a detailed breakdown of permissions, see the [Authentication and Permissions](../architecture/03-authentication-and-permissions.md) document.
