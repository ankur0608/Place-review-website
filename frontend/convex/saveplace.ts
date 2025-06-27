import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// toggle save / unsave
export const toggle = mutation({
    args: {
        userId: v.string(),
        placeId: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("saveplace")
            .withIndex("by_user_place", q =>
                q.eq("userId", args.userId).eq("placeId", args.placeId)
            )
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id); // Unsave
        } else {
            await ctx.db.insert("saveplace", {
                userId: args.userId,
                placeId: args.placeId,
            });
        }
    },
});

// fetch saved places for a user
export const getSaved = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("saveplace")
            .withIndex("by_user", q => q.eq("userId", args.userId))
            .collect();
    },
});
