import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Lucia } from "lucia";
import { sessionsTable, usersTable } from "../db/schema";

export let lucia: Lucia<
  Record<never, never>,
  {
    email: string;
  }
>;

export const initializeLucia = (
  db: PostgresJsDatabase<Record<string, never>>
) => {
  const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);
  lucia = new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attribs) => {
      return {
        email: attribs.email,
      };
    },
  });
};

export const isValidEmail = (email: string): boolean => {
  return /.+@.+/.test(email);
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: {
      email: string;
    };
  }
}
