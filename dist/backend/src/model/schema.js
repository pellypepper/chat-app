"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyViews = exports.stories = exports.messageDeletes = exports.friends = exports.userChats = exports.messages = exports.chats = exports.passwordResets = exports.emailVerifications = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Users Table (Already defined)
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    firstname: (0, pg_core_1.varchar)("firstname", { length: 100 }).notNull(),
    lastname: (0, pg_core_1.varchar)("lastname", { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    verified: (0, pg_core_1.boolean)("verified").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    // New columns
    profilePicture: (0, pg_core_1.varchar)("profile_picture", { length: 500 }),
    bio: (0, pg_core_1.text)("bio"), // Optional biography
});
// Email Verifications Table (Already defined)
exports.emailVerifications = (0, pg_core_1.pgTable)("email_verifications", {
    email: (0, pg_core_1.varchar)("email", { length: 255 }).primaryKey(),
    code: (0, pg_core_1.text)("code").notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
});
// Password Resets Table (Already defined)
exports.passwordResets = (0, pg_core_1.pgTable)("password_resets", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id).notNull(),
    token: (0, pg_core_1.varchar)("token", { length: 255 }).notNull(),
    expires: (0, pg_core_1.timestamp)("expires", { withTimezone: true }).notNull(),
});
// ✅ Chat Table
exports.chats = (0, pg_core_1.pgTable)("chat", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }), // optional, for group chats
    isGroup: (0, pg_core_1.boolean)("is_group").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow()
});
// ✅ Message Table
// Add this to your schema/model
const messageTypeEnum = (0, pg_core_1.pgEnum)("message_type", ["text", "image"]);
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    chatId: (0, pg_core_1.integer)("chat_id").notNull().references(() => exports.chats.id),
    senderId: (0, pg_core_1.integer)("sender_id").notNull().references(() => exports.users.id),
    content: (0, pg_core_1.text)("content").notNull(), // URL for images, plain text otherwise
    type: messageTypeEnum("type").notNull().default("text"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow()
});
// ✅ UserChat Table (many-to-many relation: users <-> chats)
exports.userChats = (0, pg_core_1.pgTable)("user_chat", {
    chatId: (0, pg_core_1.integer)("chat_id").references(() => exports.chats.id).notNull(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id).notNull()
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.chatId, table.userId] })
}));
// ✅ Friends Table (many-to-many relation: users <-> friends)
exports.friends = (0, pg_core_1.pgTable)('friends', {
    userId: (0, pg_core_1.integer)('user_id').notNull().references(() => exports.users.id),
    friendId: (0, pg_core_1.integer)('friend_id').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
}, (t) => ({
    pk: (0, pg_core_1.primaryKey)(t.userId, t.friendId), // Composite key
}));
// Optional table to track per-user message deletes
exports.messageDeletes = (0, pg_core_1.pgTable)("message_deletes", {
    messageId: (0, pg_core_1.integer)("message_id").notNull().references(() => exports.messages.id),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.messageId, table.userId] }),
}));
const storyTypeEnum = (0, pg_core_1.pgEnum)("story_type_enum", ["text", "image"]);
exports.stories = (0, pg_core_1.pgTable)("stories", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id),
    content: (0, pg_core_1.text)("content").notNull(), // store text or image URL
    type: storyTypeEnum("type").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at", { withTimezone: true }).notNull(),
});
exports.storyViews = (0, pg_core_1.pgTable)("story_views", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    storyId: (0, pg_core_1.integer)("story_id").notNull().references(() => exports.stories.id),
    viewerId: (0, pg_core_1.integer)("viewer_id").notNull().references(() => exports.users.id),
    viewedAt: (0, pg_core_1.timestamp)("viewed_at", { withTimezone: true }).defaultNow(),
});
//# sourceMappingURL=schema.js.map