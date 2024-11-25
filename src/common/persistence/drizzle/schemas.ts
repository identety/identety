import { userTable } from '@/shared/persistence/drizzle/schemas/user.schema';
import { projectsTable } from '@/shared/persistence/drizzle/schemas/project.schema';
import { tasksTable } from '@/shared/persistence/drizzle/schemas/task.schema';
import { taskStatusTable } from '@/shared/persistence/drizzle/schemas/task-status.schema';
import { commentsTable } from '@/shared/persistence/drizzle/schemas/comment.schema';

export * from './schemas/common.schema';
export * from './schemas/user.schema';
export * from './schemas/user-project-pivot.schema';
export * from './schemas/project.schema';
export * from './schemas/task.schema';
export * from './schemas/task-status.schema';
export * from './schemas/comment.schema';

export enum DatabaseTableName {
  users = 'users',
  projects = 'projects',
  tasks = 'tasks',
  task_statuses = 'task_statuses',
  comments = 'comments',
}

export const drizzleSchemaTableMap = {
  [DatabaseTableName.users]: userTable,
  [DatabaseTableName.projects]: projectsTable,
  [DatabaseTableName.tasks]: tasksTable,
  [DatabaseTableName.task_statuses]: taskStatusTable,
  [DatabaseTableName.comments]: commentsTable,
};
