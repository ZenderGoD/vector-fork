/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as _shared_auth from "../_shared/auth.js";
import type * as _shared_pagination from "../_shared/pagination.js";
import type * as _shared_permissions from "../_shared/permissions.js";
import type * as _shared_validation from "../_shared/validation.js";
import type * as access from "../access.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as issues_mutations from "../issues/mutations.js";
import type * as issues_queries from "../issues/queries.js";
import type * as migrations_index from "../migrations/index.js";
import type * as organizations_mutations from "../organizations/mutations.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as permissions_queries from "../permissions/queries.js";
import type * as permissions_utils from "../permissions/utils.js";
import type * as projects_mutations from "../projects/mutations.js";
import type * as projects_queries from "../projects/queries.js";
import type * as roles_index from "../roles/index.js";
import type * as teams_mutations from "../teams/mutations.js";
import type * as teams_queries from "../teams/queries.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "_shared/auth": typeof _shared_auth;
  "_shared/pagination": typeof _shared_pagination;
  "_shared/permissions": typeof _shared_permissions;
  "_shared/validation": typeof _shared_validation;
  access: typeof access;
  auth: typeof auth;
  http: typeof http;
  "issues/mutations": typeof issues_mutations;
  "issues/queries": typeof issues_queries;
  "migrations/index": typeof migrations_index;
  "organizations/mutations": typeof organizations_mutations;
  "organizations/queries": typeof organizations_queries;
  "permissions/queries": typeof permissions_queries;
  "permissions/utils": typeof permissions_utils;
  "projects/mutations": typeof projects_mutations;
  "projects/queries": typeof projects_queries;
  "roles/index": typeof roles_index;
  "teams/mutations": typeof teams_mutations;
  "teams/queries": typeof teams_queries;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
