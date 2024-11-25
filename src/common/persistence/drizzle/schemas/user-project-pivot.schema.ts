//--------------------------------------------------------------------------------
// ------   user__project pivot table
//--------------------------------------------------------------------------------
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { commonTimestampColumns } from './common.schema';
import { userTable } from './user.schema';
import { projectsTable } from './project.schema';
import { relations } from 'drizzle-orm';

export const userProjectPivotTable = pgTable('user_project__pivot', {
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  projectId: uuid()
    .notNull()
    .references(() => projectsTable.id, { onDelete: 'cascade' }),
  ...commonTimestampColumns,
});

export const userProjectRelation = relations(
  userProjectPivotTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [userProjectPivotTable.projectId],
      references: [projectsTable.id],
    }),
    user: one(userTable, {
      fields: [userProjectPivotTable.userId],
      references: [userTable.id],
    }),
  }),
);
