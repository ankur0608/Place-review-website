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
    placeName: v.optional(v.string()),
    userId: v.string(), // <-- Add this line!
  },
  handler: async (ctx, args) => {
    // ...check for existing review...
    await ctx.db.insert("reviews", {
      name: args.name,
      comment: args.comment,
      rating: args.rating,
      placeId: args.placeId,
      placeName: args.placeName,
      userId: args.userId, // <-- Save it!
    });
  },
});

// ✅ PUBLIC: reviews:update
export const update = mutation({
  args: {
    reviewId: v.id("reviews"),
    comment: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, {
      comment: args.comment,
      rating: args.rating,
    });
  },
});

// ✅ PUBLIC: reviews:remove
export const remove = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reviewId);
  },
});
