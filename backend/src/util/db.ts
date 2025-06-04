import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";



const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
  ssl: {
    rejectUnauthorized: false, 
  },
});
pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Connection error", err.stack));

export const db = drizzle(pool);

