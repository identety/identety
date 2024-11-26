export * from './schemas/schemas';

export enum DatabaseTableName {
  tenants = 'tenants',
  clients = 'clients',
  users = 'users',
}

export const drizzleSchemaTableMap = {
  // [DatabaseTableName.users]: userTable,
  // [DatabaseTableName.projects]: projectsTable,
  // [DatabaseTableName.tasks]: tasksTable,
  // [DatabaseTableName.task_statuses]: taskStatusTable,
  // [DatabaseTableName.comments]: commentsTable,
};
