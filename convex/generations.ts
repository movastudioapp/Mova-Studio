// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listUserGenerations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const startGeneration = mutation({
  args: {
    userId: v.string(),
    prompt: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("generations", {
      userId: args.userId,
      prompt: args.prompt,
      type: args.type,
      status: 'pending',
      createdAt: Date.now(),
    });
  },
});

export const updateGenerationStatus = mutation({
  args: {
    id: v.id("generations"),
    status: v.string(),
    resultUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      resultUrl: args.resultUrl,
    });
  },
});
