import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    reviews: defineTable({
        placeId: v.string(),
        name: v.string(),
        comment: v.string(),
        rating: v.number(),
        placeName: v.optional(v.string()),
    }),
    // In schema.ts
    users: defineTable({
        username: v.string(),
        email: v.string(),
        password: v.string(),
        resetToken: v.optional(v.string()),
        resetTokenExpiry: v.optional(v.number()),
    }).index("by_email", ["email"]),


    contact: defineTable({
        name: v.string(),
        email: v.string(),
        message: v.string(),
        createdAt: v.number(), // Use Date.now() when inserting
    }),
    saveplace: defineTable({
        userId: v.string(),
        placeId: v.string(),
    })
        .index("by_user", ["userId"])
        .index("by_user_place", ["userId", "placeId"]),

    messages: defineTable({
        sender: v.string(),
        text: v.string(),
        createdAt: v.number(),
    }).index("by_time", ["createdAt"]),
});
