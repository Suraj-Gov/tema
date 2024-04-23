import { eq } from "drizzle-orm";
import { Scrypt, type Session } from "lucia";
import { db } from "../db";
import type { User } from "../db/schema";
import { usersTable } from "../db/schema";
import { Result } from "../helpers/result";
import { lucia } from "./lucia";

export const getSessionCookie = (session: Session) => {
  return lucia.createSessionCookie(session.id);
};

// https://lucia-auth.com/guides/email-and-password/basics
export const createUser = async (
  user: Pick<User, "email" | "name"> & { password: string }
): Promise<Result<User & { session: Session }>> => {
  const { email, name, password } = user;

  const hash = await new Scrypt().hash(password);
  let newUser: User;
  try {
    const addUser = await db
      .insert(usersTable)
      .values({
        email,
        name,
        hashedPassword: hash,
      })
      .returning();
    newUser = addUser[0]!;
  } catch (err) {
    console.error(err);
    return Result.error("Could not create user");
  }

  const session = await lucia.createSession(newUser.id, { email });
  return new Result({ ...newUser, session });
};

export const loginUser = async (
  params: Pick<User, "email"> & { password: string }
): Promise<Result<User & { session: Session }>> => {
  const { email, password } = params;

  const userRow = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!userRow[0]) {
    return Result.error("Invalid email/password", "UNAUTHORIZED");
  }

  const { id: uid, hashedPassword: hash } = userRow[0];
  const isValidPassword = await new Scrypt().verify(hash, password);
  if (!isValidPassword) {
    return Result.error("Invalid email/password", "UNAUTHORIZED");
  }

  const session = await lucia.createSession(uid, {});
  return new Result({ ...userRow[0], session });
};

export const logoutUser = async (cookie: string) => {
  const sessionId = lucia.readSessionCookie(cookie) || "";
  await lucia.invalidateSession(sessionId);
  const blankCookie = lucia.createBlankSessionCookie();
  return blankCookie.serialize();
};
