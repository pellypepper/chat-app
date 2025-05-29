import { InferModel } from 'drizzle-orm';
import { users } from '../model/schema';

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
