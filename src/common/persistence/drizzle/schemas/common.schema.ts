import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
};
