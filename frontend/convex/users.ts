import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Signup: Store user
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

// ✅ Login: Get user by email
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

// ✅ Get user by ID (for profile, etc.)
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");
        return user;
    },
});

// ✅ Update user by ID
export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        username: v.string(),
        email: v.string(),
        password: v.string(),
        // imageUrl: v.optional(v.string()) // optionally add this
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

// ✅ Forgot Password: Set reset token
export const setResetToken = mutation({
    args: {
        email: v.string(),
        token: v.string(),
        expiry: v.number(), // e.g., Date.now() + 15 * 60 * 1000
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            resetToken: args.token,
            resetTokenExpiry: args.expiry,
        });
    },
});

// ✅ Forgot Password: Get user by reset token
export const getUserByToken = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("resetToken"), args.token))
            .first();
    },
});

// ✅ Forgot Password: Update password and clear reset token
export const updatePassword = mutation({
    args: {
        userId: v.id("users"),
        newPassword: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            password: args.newPassword,
            resetToken: undefined,         // ✅ use undefined
            resetTokenExpiry: undefined,   // ✅ use undefined
        });
    },
});
