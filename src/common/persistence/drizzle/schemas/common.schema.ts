import { timestamp } from 'drizzle-orm/pg-core';

export const commonTimestampColumns = {
  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
};
