import { TRPCError, initTRPC } from "@trpc/server";
import type { TRPCContext } from "./context";
import { Result } from "../helpers/result";
import { isUserAuthorized } from "../auth/user";

export const t = initTRPC.context<TRPCContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(async (opts) => {
  const cookie = opts.ctx.req.headers.cookie;
  if (!cookie) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Please log in" });
  }

  const { isAuthorized, sessionCookie } = await isUserAuthorized(cookie);
  if (sessionCookie) {
    opts.ctx.res.header("set-cookie", sessionCookie);
  }
  if (!isAuthorized) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Please log in" });
  }

  return opts.next({
    ctx: opts.ctx,
  });
});
