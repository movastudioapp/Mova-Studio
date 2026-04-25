// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAssets = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const listAllAssets = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assets")
      .order("desc")
      .take(args.limit || 10);
  },
});

export const addAsset = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("assets", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      url: args.url,
      thumbnailUrl: args.thumbnailUrl,
      type: args.type,
      status: 'ready',
      createdAt: Date.now(),
    });
  },
});

export const deleteAsset = mutation({
  args: { id: v.id("assets"), userId: v.string() },
  handler: async (ctx, args) => {
    const asset = await ctx.db.get(args.id);
    if (!asset || asset.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
  },
});
