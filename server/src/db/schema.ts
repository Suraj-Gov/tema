import type { InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgSchema,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const projectSchema = pgSchema("tema");

export const usersTable = projectSchema.table("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  hashedPassword: text("p_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export type User = InferSelectModel<typeof usersTable>;

export const sessionsTable = projectSchema.table("sessions", {
  id: text("id").primaryKey(),
  userId: integer("uid")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
