//--------------------------------------------------------------------------------
// ------   Comments
//--------------------------------------------------------------------------------
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { tasksTable } from './task.schema';
import { commonTimestampColumns } from './common.schema';
import { relations } from 'drizzle-orm';

export const commentsTable = pgTable('comments', {
  id: uuid().primaryKey().defaultRandom(),
  body: text().notNull(),
  taskId: uuid()
    .notNull()
    .references(() => tasksTable.id, { onDelete: 'cascade' }),
  ...commonTimestampColumns,
});
export type Comment = typeof commentsTable.$inferSelect;
export const commentRelations = relations(commentsTable, ({ one }) => ({
  task: one(tasksTable, {
    fields: [commentsTable.taskId],
    references: [tasksTable.id],
  }),
}));
