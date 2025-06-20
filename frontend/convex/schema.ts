// convex/schema.ts
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
});
