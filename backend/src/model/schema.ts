import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  uuid,
  integer,

  primaryKey,
    pgEnum 
} from "drizzle-orm/pg-core";

// Users Table (Already defined)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstname: varchar("firstname", { length: 100 }).notNull(),
  lastname: varchar("lastname", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Email Verifications Table (Already defined)
export const emailVerifications = pgTable("email_verifications", {
  email: varchar("email", { length: 255 }).primaryKey(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Password Resets Table (Already defined)
export const passwordResets = pgTable("password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});


// ✅ Chat Table
export const chats = pgTable("chat", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }), // optional, for group chats
  isGroup: boolean("is_group").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// ✅ Message Table
export const messages = pgTable("message", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chats.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// ✅ UserChat Table (many-to-many relation: users <-> chats)
export const userChats = pgTable("user_chat", {
  chatId: integer("chat_id").references(() => chats.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull()
}, (table) => ({
  pk: primaryKey({ columns: [table.chatId, table.userId] })
}));


// ✅ Friends Table (many-to-many relation: users <-> friends)
export const friends = pgTable(
  'friends',
  {
    userId: integer('user_id').notNull().references(() => users.id),
    friendId: integer('friend_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.friendId), // Composite key
  })
);


// Optional table to track per-user message deletes
export const messageDeletes = pgTable("message_deletes", {
  messageId: integer("message_id").notNull().references(() => messages.id),
  userId: integer("user_id").notNull().references(() => users.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.messageId, table.userId] }),
}));

const storyTypeEnum = pgEnum("story_type_enum", ["text", "image"]);

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),  // store text or image URL
  type: storyTypeEnum("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const storyViews = pgTable("story_views", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull().references(() => stories.id),
  viewerId: integer("viewer_id").notNull().references(() => users.id),
  viewedAt: timestamp("viewed_at", { withTimezone: true }).defaultNow(),
});