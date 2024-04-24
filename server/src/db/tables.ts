import type { InferSelectModel } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgSchema,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const namespace = pgSchema("tema");

export const usersTable = namespace.table("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  hashedPassword: text("p_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export type User = InferSelectModel<typeof usersTable>;

export const sessionsTable = namespace.table("sessions", {
  id: text("id").primaryKey(),
  userId: integer("uid")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const userProjectsTable = namespace.table("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Untitled"),
  userId: integer("uid")
    .notNull()
    .references(() => usersTable.id),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export type UserProject = InferSelectModel<typeof userProjectsTable>;
