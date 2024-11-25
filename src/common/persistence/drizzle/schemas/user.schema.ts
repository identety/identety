//--------------------------------------------------------------------------------
// ------   Users
//--------------------------------------------------------------------------------
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { commonTimestampColumns } from './common.schema';
import { userProjectPivotTable } from './user-project-pivot.schema';
import { relations } from 'drizzle-orm';

export const userTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull(),
  avatar: varchar({ length: 255 }),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  emailVerifiedAt: timestamp(),
  ...commonTimestampColumns,
});
export type User = typeof userTable.$inferSelect;

export const userRelations = relations(userTable, ({ many }) => ({
  projects: many(userProjectPivotTable),
}));
