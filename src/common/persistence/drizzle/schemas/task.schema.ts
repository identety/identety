import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { commonTimestampColumns } from './common.schema';
import { taskStatusTable } from '../schemas';
import { projectsTable } from './project.schema';
import { relations } from 'drizzle-orm';

export const tasksTable = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  body: text(),
  projectId: uuid()
    .notNull()
    .references(() => projectsTable.id, { onDelete: 'cascade' }),
  statusId: uuid()
    .notNull()
    .references(() => taskStatusTable.id, { onDelete: 'set null' }),
  createdBy: uuid()
    .notNull()
    .references(() => projectsTable.id, { onDelete: 'set null' }),
  ...commonTimestampColumns,
});

export const taskRelations = relations(tasksTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [tasksTable.projectId],
    references: [projectsTable.id],
  }),
}));
