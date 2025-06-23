import { createAuthClient } from "better-auth/client";
import { usernameClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";

import type { auth } from "@/auth/auth";

/**
 * Singleton Better Auth client for the browser.
 *
 * – Adds `usernameClient()` for username flows.
 * – `inferAdditionalFields<typeof auth>()` keeps client-side types in sync with
 *   extra fields the server (plugins / config) add to User & Session objects.
 */
export const authClient = createAuthClient({
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
});
