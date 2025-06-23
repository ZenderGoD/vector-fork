import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

import { db } from "@/db";

/**
 * Global Better Auth instance.
 *
 * – Enables **email + password** authentication.
 * – Adds **username** sign-in / sign-up via the official `username()` plugin.
 * – Uses our shared Drizzle client (PostgreSQL) as the backing store.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),

  // Built-in email/password provider — required for the username plugin.
  emailAndPassword: {
    enabled: true,
  },

  // Plugin that adds username fields + endpoints
  plugins: [username()],

  // Cache session JSON in an encrypted cookie for quick reads
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 min
    },
  },
});
