// convex/functions/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to insert a new user after checking for existing email
export const insertUser = mutation({
    args: {
        username: v.string(),
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            console.log("🟢 insertUser args:", args);

            // Check if user already exists by email
            const existingUser = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", args.email))
                .first();

            if (existingUser) {
                console.log("⚠️ User already exists:", existingUser.email);
                throw new Error("User already exists");
            }

            // Insert new user
            const inserted = await ctx.db.insert("users", {
                username: args.username,
                email: args.email,
                password: args.password,
            });

            console.log("✅ User inserted:", inserted);
            return inserted;
        } catch (err) {
            console.error("❌ Convex insertUser failed:", err);
            throw err;
        }
    },
});

// Query to fetch user by email
export const getUserByEmail = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, { email }) => {
        try {
            const user = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", email))
                .first();

            return user || null;
        } catch (err) {
            console.error("❌ Convex getUserByEmail failed:", err);
            throw err;
        }
    },
});

export const getUserById = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, { userId }) => {
        try {
            const user = await ctx.db.get(userId);
            return user || null;
        }
        catch (err) {
            console.error("❌ Convex getUserById failed:", err);
            throw err;
        }
    }
});