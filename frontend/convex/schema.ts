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
    users: defineTable({
        username: v.string(),
        email: v.string(),
        password: v.string(),
    }).index("by_email", ["email"]), // add index for login

    contact: defineTable({
        name: v.string(),
        email: v.string(),
        message: v.string(),
        createdAt: v.number(), // Use Date.now() when inserting
    }),

});
