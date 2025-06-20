// convex/reviews.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ✅ PUBLIC: reviews:list
export const list = query({
    args: { placeId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("reviews")
            .filter((q) => q.eq(q.field("placeId"), args.placeId))
            .collect();
    },
});

// ✅ PUBLIC: reviews:add
export const add = mutation({
    args: {
        name: v.string(),
        comment: v.string(),
        rating: v.number(),
        placeId: v.string(),
        placeName: v.optional(v.string()), // optional extra field
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("reviews", {
            name: args.name,
            comment: args.comment,
            rating: args.rating,
            placeId: args.placeId,
            placeName: args.placeName,
        });
    },
});
