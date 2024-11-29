import {
  clientsTable,
  tenantsTable,
  usersTable,
} from '@/shared/infrastructure/persistence/drizzle/schemas/schemas';

export * from './schemas/schemas';

export enum DatabaseTableName {
  tenants = 'tenants',
  clients = 'clients',
  users = 'users',
}

export const drizzleSchemaTableMap = {
  [DatabaseTableName.tenants]: tenantsTable,
  [DatabaseTableName.clients]: clientsTable,
  [DatabaseTableName.users]: usersTable,
};
