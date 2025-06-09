import { db } from '../util/db'; // your Drizzle client instance
import { users } from '../model/schema'; // your Drizzle users table schema
import { eq } from 'drizzle-orm';

export async function findUserById(id: number) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user[0] || null;
}