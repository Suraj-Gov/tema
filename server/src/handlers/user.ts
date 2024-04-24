import { eq } from "drizzle-orm";
import { z } from "zod";
import { isValidEmail } from "../auth/lucia";
import {
  createUser,
  getSessionCookie,
  loginUser,
  logoutUser,
} from "../auth/user";
import { db } from "../db";
import { usersTable, type User } from "../db/schema";
import { Result } from "../helpers/result";
import { authedProcedure, publicProcedure, router } from "../trpc";

const signupFields = z.object({
  email: z.string(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const handleSignup = async (input: z.infer<typeof signupFields>) => {
  const { email, name, password } = input;

  // validate email
  if (!isValidEmail(email)) {
    return Result.error("Invalid email");
  }

  // check if already exists
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (existingUser.length) {
    return Result.error("User exists, please log-in");
  }

  const newUser = await createUser({ email, name, password });
  return newUser;
};

const loginFields = z.object({
  email: z.string(),
  password: z.string(),
});
const handleLogin = (input: z.infer<typeof loginFields>) => {
  const { email, password } = input;
  return loginUser({ email, password });
};

const handleLogout = async (cookie: string): Promise<string> => {
  const blankCookie = await logoutUser(cookie);
  return blankCookie;
};

const handleGetUser = async (
  uid: number
): Promise<Result<Omit<User, "hashedPassword">>> => {
  const userRows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, uid));
  const user = userRows[0];
  if (!user) {
    return Result.error("User not found", "NOT_FOUND");
  }

  const { hashedPassword: _, ...userData } = user;
  return new Result(userData);
};

export const userAuthRouter = router({
  signup: publicProcedure.input(signupFields).mutation(async (opts) => {
    const res = await handleSignup(opts.input);
    if (res.error) return res.httpErrResponse("BAD_REQUEST");

    const { session, ...user } = res.val;
    opts.ctx.res.header("set-cookie", getSessionCookie(session).serialize());
    return user;
  }),
  login: publicProcedure.input(loginFields).mutation(async (opts) => {
    const res = await handleLogin(opts.input);
    if (res.error) return res.httpErrResponse();

    const { session, ...user } = res.val;
    opts.ctx.res.header("set-cookie", getSessionCookie(session).serialize());
    return user;
  }),
  getUser: authedProcedure.query(async (opts) => {
    const res = await handleGetUser(opts.ctx.uid || -1);
    if (res.error) return res.httpErrResponse();
    return res.val;
  }),
  logout: publicProcedure.mutation(async (opts) => {
    const cookie = opts.ctx.req.headers.cookie;
    const blankCookie = await handleLogout(cookie || "");
    opts.ctx.res.header("set-cookie", blankCookie);
    return;
  }),
});
