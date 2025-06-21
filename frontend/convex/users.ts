import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Signup: Store user
export const insertUser = mutation({
    args: {
        username: v.string(),
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) throw new Error("User already exists");
        await ctx.db.insert("users", args);
    },
});

// Login: Get user by email
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});
