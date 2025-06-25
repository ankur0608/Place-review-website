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
// Get user by ID (for edit profile or profile page)
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");
        return user;
    },
});

// Update user by ID
export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        username: v.string(),
        email: v.string(),
        password: v.string(),
        // imageUrl: v.optional(v.string()) // Add this if you're uploading profile images
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            username: args.username,
            email: args.email,
            password: args.password,
            // imageUrl: args.imageUrl
        });
    },
});
