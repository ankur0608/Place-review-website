import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// blogLikes.ts
export const getLikes = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        const existing = await ctx.db
            .query("blogLikes")
            .withIndex("by_slug", (q) => q.eq("slug", slug))  // <-- FIXED
            .unique();

        return existing?.likes ?? 0;
    },
});

export const likeBlog = mutation({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        const existing = await ctx.db
            .query("blogLikes")
            .withIndex("by_slug", (q) => q.eq("slug", slug))  // <-- FIXED
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { likes: existing.likes + 1 });
            return existing.likes + 1;
        } else {
            await ctx.db.insert("blogLikes", { slug, likes: 1 });
            return 1;
        }
    },
});
