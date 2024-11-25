//--------------------------------------------------------------------------------
// ------   Projects
//--------------------------------------------------------------------------------
import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { commonTimestampColumns } from './common.schema';
import { relations } from 'drizzle-orm';
import { userProjectPivotTable } from './user-project-pivot.schema';

export const projectsTable = pgTable('projects', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  shortDescription: varchar({ length: 255 }),
  isActive: boolean().default(true),
  ...commonTimestampColumns,
});
export type Project = typeof projectsTable.$inferSelect;
export const projectTableRelations = relations(projectsTable, ({ many }) => ({
  users: many(userProjectPivotTable),
}));
