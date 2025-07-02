import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
    args: {
        sender: v.string(),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            sender: args.sender,
            text: args.text,
            createdAt: Date.now(),
        });
    },
});
