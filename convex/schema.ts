import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    uid: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    photoURL: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_uid", ["uid"]),

  assets: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    type: v.string(), // 'video', 'image', 'audio'
    status: v.string(), // 'ready', 'processing', 'error'
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  generations: defineTable({
    userId: v.string(),
    prompt: v.string(),
    type: v.string(), // 'video', 'image', 'song'
    status: v.string(), // 'pending', 'processing', 'completed', 'failed'
    resultUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  beatPacks: defineTable({
    userId: v.string(),
    title: v.string(),
    audioUrl: v.string(),
    bpm: v.number(),
    rhythmPatterns: v.array(v.number()),
    beatMarkers: v.array(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
