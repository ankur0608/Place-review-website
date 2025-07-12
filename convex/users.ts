import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertUser = mutation({
    args: {
        username: v.string(),
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            console.log("🟢 insertUser args:", args);

            const existingUser = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", args.email))
                .first();

            if (existingUser) {
                console.log("⚠️ User already exists:", existingUser.email);
                throw new Error("User already exists");
            }

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
