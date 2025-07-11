import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
    args: {
        sender: v.string(),
        text: v.string(),
        chatId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            sender: args.sender,
            text: args.text,
            chatId: args.chatId,
            createdAt: Date.now(),
        });
    },
});

export const getMessagesByChatId = query({
    args: { chatId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_time")
            .filter((q) => q.eq(q.field("chatId"), args.chatId))
            .order("asc")
            .collect();
    },
});

export const deleteMessagesByChatId = mutation({
    args: { chatId: v.string() },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_time")
            .filter((q) => q.eq(q.field("chatId"), args.chatId))
            .collect();

        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
    },
});