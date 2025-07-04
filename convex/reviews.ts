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
    userId: v.string(),
    photo: v.optional(v.string()), // <-- Accept photo (URL or base64)
  },
  handler: async (ctx, args) => {
    // Optionally, check for existing review by this user for this place
    // const existing = await ctx.db
    //   .query("reviews")
    //   .filter(q => q.and(
    //     q.eq(q.field("userId"), args.userId),
    //     q.eq(q.field("placeId"), args.placeId)
    //   ))
    //   .first();
    // if (existing) throw new Error("You have already reviewed this place.");

    await ctx.db.insert("reviews", {
      name: args.name,
      comment: args.comment,
      rating: args.rating,
      placeId: args.placeId,
      placeName: args.placeName,
      userId: args.userId,
      photo: args.photo, // <-- Save photo if provided
      createdAt: Date.now(), // <-- Save timestamp
    });
  },
});

// ✅ PUBLIC: reviews:update
export const update = mutation({
  args: {
    reviewId: v.id("reviews"),
    comment: v.string(),
    rating: v.number(),
    photo: v.optional(v.string()), // Optionally allow updating photo
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, {
      comment: args.comment,
      rating: args.rating,
      ...(args.photo !== undefined && { photo: args.photo }),
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
