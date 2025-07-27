import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Placeholder schema - will be expanded in Phase 3
  // Based on current Drizzle schema analysis from Phase 0

  users: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    username: v.optional(v.string()),
    displayUsername: v.optional(v.string()),
    role: v.optional(v.string()),
    banned: v.optional(v.boolean()),
    banReason: v.optional(v.string()),
    banExpires: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.optional(v.string()),
    logo: v.optional(v.string()),
    metadata: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  members: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_org_user", ["organizationId", "userId"]),
});
