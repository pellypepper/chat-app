"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres.jfavrcsrtivybitbjxax:23qzBQYLTDRGeytp@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
    ssl: {
        rejectUnauthorized: false,
    },
});
pool.connect()
    .then(function () { return console.log("Connected to the database"); })
    .catch(function (err) { return console.error("Connection error", err.stack); });
exports.db = (0, node_postgres_1.drizzle)(pool);
//# sourceMappingURL=db.js.map