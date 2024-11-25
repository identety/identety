import { boolean, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { projectsTable } from './project.schema';

export const taskStatusTable = pgTable('task_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  color: varchar({ length: 255 }),
  index: integer().notNull().default(0),
  projectId: uuid()
    .notNull()
    .references(() => projectsTable.id, { onDelete: 'cascade' }),
  isActive: boolean().notNull().default(true),
});
