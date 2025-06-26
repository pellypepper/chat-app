import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";



const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres.jfavrcsrtivybitbjxax:23qzBQYLTDRGeytp@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
    ssl: {
    rejectUnauthorized: false, 
  },
});
pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Connection error", err.stack));

export const db = drizzle(pool);

