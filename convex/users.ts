// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByUid = query({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .unique();
  },
});

export const storeUser = mutation({
  args: {
    uid: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    photoURL: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        displayName: args.displayName,
        photoURL: args.photoURL,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      uid: args.uid,
      email: args.email,
      displayName: args.displayName,
      photoURL: args.photoURL,
      createdAt: Date.now(),
    });
  },
});
