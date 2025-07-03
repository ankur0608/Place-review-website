// convex/http/setResetToken.ts
import { httpAction } from "../_generated/server";
import { api } from "../_generated/api";

export default httpAction(async (ctx, request) => {
    const body = await request.json();
    const { email, token, expiry } = body;

    await ctx.runMutation(api.users.setResetToken, { email, token, expiry });

    return new Response(JSON.stringify({ message: "Reset token set" }), {
        status: 200,
    });
});
