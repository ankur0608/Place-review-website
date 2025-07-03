import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Reviews Table
  reviews: defineTable({
    placeId: v.string(),
    name: v.string(), // User's name from registration
    comment: v.string(),
    rating: v.number(),
    placeName: v.optional(v.string()),
    userId: v.string(), // <-- Add this line!
  }).index("by_user_place", ["userId", "placeId"]),

  // Users Table
  users: defineTable({
    username: v.string(),
    email: v.string(),
    password: v.string(),
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Contact Table
  contact: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(), // Use Date.now() when inserting
  }),

  // Saved Places Table
  saveplace: defineTable({
    userId: v.string(),
    placeId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_place", ["userId", "placeId"]),

  // Chat Messages Table
  messages: defineTable({
    sender: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_time", ["createdAt"]),
});
