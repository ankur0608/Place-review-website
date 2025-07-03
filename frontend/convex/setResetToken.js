import { httpAction } from "./_generated/server";
import { v } from "convex/values";

export default httpAction({
  args: {
    email: v.string(),
    token: v.string(),
    expiry: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      resetToken: args.token,
      resetTokenExpiry: args.expiry,
    });

    return { success: true };
  },
});
