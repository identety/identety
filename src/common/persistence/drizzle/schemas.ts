export * from './schemas/common.schema';
export * from './schemas/tenant.schema';

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
