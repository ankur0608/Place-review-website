import { httpAction } from "../_generated/server";
import { v } from "convex/values";

export default httpAction({
  args: {
    userId: v.id("users"),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      password: args.newPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return { success: true };
  },
});
