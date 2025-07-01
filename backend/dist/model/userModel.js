"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = findUserById;
const db_1 = require("../util/db"); // your Drizzle client instance
const schema_1 = require("../model/schema"); // your Drizzle users table schema
const drizzle_orm_1 = require("drizzle-orm");
async function findUserById(id) {
    const user = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).limit(1);
    return user[0] || null;
}
//# sourceMappingURL=userModel.js.map