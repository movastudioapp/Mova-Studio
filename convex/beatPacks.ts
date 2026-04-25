import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getBeatPacksByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("beatPacks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const saveBeatPack = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    audioUrl: v.string(),
    bpm: v.number(),
    rhythmPatterns: v.array(v.number()),
    beatMarkers: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("beatPacks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
