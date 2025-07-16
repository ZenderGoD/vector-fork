# Authentication and Permissions

This document outlines the permissions system, from built-in roles to the underlying policy engine.

## How to Add a New Permission

1.  **Define the Constant**: Add your new permission string to the `PERMISSION_LIST` array in `src/auth/permission-constants.ts`.
2.  **Assign to Roles**: Add the new permission to the appropriate role arrays in `src/auth/builtin-role-permissions.ts`. For example, to grant it to all admins, add it to the `admin` array.
3.  **Implement the Check**: Use the `PermissionPolicy` in the backend or the `usePermission` hook in the frontend to enforce the new permission.
4.  **Update this Document**: Add the new permission to the matrix below.

---

## Permission Matrix

The matrix below shows the **base permissions** for each built-in role. The policy engine may apply additional, context-specific rules (e.g., a member can only update issues they are assigned to).

| Permission          | Owner | Admin | Member | Notes                                                      |
| ------------------- | ----- | ----- | ------ | ---------------------------------------------------------- |
| `org:view`          | ✅    | ✅    | ✅     | Required for organization access                           |
| `org:manage`        | ✅    | ✅    | ❌     | Organization settings                                      |
| `org:invite`        | ✅    | ✅    | ❌     | Invite new members                                         |
| `role:create`       | ✅    | ✅    | ❌     | Create custom roles                                        |
| `role:update`       | ✅    | ✅    | ❌     | Modify custom roles                                        |
| `role:delete`       | ✅    | ✅    | ❌     | Delete custom roles                                        |
| `role:assign`       | ✅    | ✅    | ❌     | Assign roles to users                                      |
| `project:view`      | ✅    | ✅    | ✅     | View accessible projects                                   |
| `project:create`    | ✅    | ✅    | ❌     | Create new projects                                        |
| `project:update`    | ✅    | ✅    | ❌     | Update project details                                     |
| `project:delete`    | ✅    | ✅    | ❌     | Delete projects                                            |
| `team:view`         | ✅    | ✅    | ✅     | View accessible teams                                      |
| `team:create`       | ✅    | ✅    | ❌     | Create new teams                                           |
| `team:update`       | ✅    | ✅    | ❌     | Update team details                                        |
| `team:delete`       | ✅    | ✅    | ❌     | Delete teams                                               |
| `issue:view`        | ✅    | ✅    | ✅     | View accessible issues                                     |
| `issue:create`      | ✅    | ✅    | ✅     | Create new issues                                          |
| `issue:update`      | ✅    | ✅    | ✅\*   | Update issues (_limited to own/assigned by policy engine_) |
| `issue:delete`      | ✅    | ✅    | ❌     | Delete issues                                              |
| `assignment:manage` | ✅    | ✅    | ❌     | Manage issue assignments                                   |

---

## Permission Policy Engine

The centralized policy engine (`src/auth/policy-engine.ts`) handles all permission checks with the following fallback logic:

1.  **Platform Admin**: Always allowed.
2.  **Lead Status**: Project/team leads get automatic permissions for their resources.
3.  **Owner Wildcard**: Organization owners have all permissions.
4.  **Built-in Role**: Checks static permission sets (`owner`, `admin`, `member`).
5.  **Custom Roles**: Checks permissions granted by assigned custom roles.

### Frontend Usage

```typescript
import { usePermission } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/auth/permission-constants";

const { hasPermission } = usePermission(orgSlug, PERMISSIONS.PROJECT_CREATE);
```

### Backend Usage

```typescript
import { PermissionPolicy } from "@/auth/policy-engine";
import { PERMISSIONS } from "@/auth/permission-constants";

await PermissionPolicy.require(ctx, PERMISSIONS.PROJECT_UPDATE, {
  type: "project",
  id: projectId,
});
```
