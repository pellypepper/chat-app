import { pgTable, serial, varchar, text, boolean, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstname: varchar("firstname", { length: 100 }).notNull(),
  lastname: varchar("lastname", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const emailVerifications = pgTable("email_verifications", {
  email: varchar("email", { length: 255 }).primaryKey(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});
