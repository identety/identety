import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  primaryKey,
  date,
} from 'drizzle-orm/pg-core';

// Table Names Enum
export enum DatabaseTableName {
  tenants = 'tenants',
  cloudUsers = 'cloud_users',
  users = 'users',
  clients = 'clients',
  roles = 'roles',
  permissions = 'permissions',
  rolePermissions = 'role_permissions',
  userRoles = 'user_roles',
  tokens = 'tokens',
  authorizationCodes = 'authorization_codes',
}

const timestamps = {
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
};

// Cloud-specific tables
export const tenantsTable = pgTable(DatabaseTableName.tenants, {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 255 }).unique(),
  settings: jsonb('settings').default({}).notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  ...timestamps,
});

export const cloudUsersTable = pgTable(DatabaseTableName.cloudUsers, {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  is_active: boolean('is_active').default(true).notNull(),
  ...timestamps,
});

export const usersTable = pgTable(DatabaseTableName.users, {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenantsTable.id),

  // OIDC Standard Claims
  name: varchar('name', { length: 255 }),
  given_name: varchar('given_name', { length: 255 }),
  family_name: varchar('family_name', { length: 255 }),
  middle_name: varchar('middle_name', { length: 255 }),
  nickname: varchar('nickname', { length: 255 }),
  preferred_username: varchar('preferred_username', { length: 255 }),
  profile: varchar('profile', { length: 255 }),
  picture: varchar('picture', { length: 255 }),
  website: varchar('website', { length: 255 }),
  gender: varchar('gender', { length: 50 }),
  birthdate: date('birthdate'),
  zoneinfo: varchar('zoneinfo', { length: 100 }),
  locale: varchar('locale', { length: 50 }),
  updated_at: timestamp('updated_at'),

  email: varchar('email', { length: 255 }).notNull(),
  email_verified: boolean('email_verified').default(false).notNull(),
  phone_number: varchar('phone_number', { length: 50 }),
  phone_number_verified: boolean('phone_number_verified')
    .default(false)
    .notNull(),
  address: jsonb('address'),

  password_hash: varchar('password_hash', { length: 255 }),
  is_active: boolean('is_active').default(true).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const clientsTable = pgTable(DatabaseTableName.clients, {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenantsTable.id),
  client_id: varchar('client_id', { length: 255 }).notNull(),
  client_secret: varchar('client_secret', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 })
    .$type<'public' | 'private' | 'm2m'>()
    .notNull(),
  redirect_uris: text('redirect_uris').array(),
  allowed_scopes: text('allowed_scopes').array(),
  allowed_grants: text('allowed_grants').array(),
  is_active: boolean('is_active').default(true).notNull(),
  require_pkce: boolean('require_pkce').default(false).notNull(),
  settings: jsonb('settings').default({}).notNull(),
  ...timestamps,
});

export const rolesTable = pgTable(DatabaseTableName.roles, {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenantsTable.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  is_system: boolean('is_system').default(false).notNull(),
  ...timestamps,
});

export const permissionsTable = pgTable(DatabaseTableName.permissions, {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenantsTable.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const rolePermissionsTable = pgTable(
  DatabaseTableName.rolePermissions,
  {
    role_id: uuid('role_id')
      .references(() => rolesTable.id, { onDelete: 'cascade' })
      .notNull(),
    permission_id: uuid('permission_id')
      .references(() => permissionsTable.id, { onDelete: 'cascade' })
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey(table.role_id, table.permission_id),
  }),
);

export const userRolesTable = pgTable(
  DatabaseTableName.userRoles,
  {
    user_id: uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    role_id: uuid('role_id')
      .references(() => rolesTable.id, { onDelete: 'cascade' })
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey(table.user_id, table.role_id),
  }),
);

export const tokensTable = pgTable(DatabaseTableName.tokens, {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenantsTable.id),
  token: varchar('token', { length: 2048 }).notNull(),
  type: varchar('type', { length: 50 })
    .$type<'access_token' | 'refresh_token'>()
    .notNull(),
  expires_at: timestamp('expires_at').notNull(),
  client_id: uuid('client_id')
    .references(() => clientsTable.id)
    .notNull(),
  user_id: uuid('user_id').references(() => usersTable.id),
  scopes: text('scopes').array().notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  ...timestamps,
});

export const authorizationCodesTable = pgTable(
  DatabaseTableName.authorizationCodes,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenant_id: uuid('tenant_id').references(() => tenantsTable.id),
    code: varchar('code', { length: 255 }).notNull(),
    client_id: uuid('client_id')
      .references(() => clientsTable.id)
      .notNull(),
    user_id: uuid('user_id')
      .references(() => usersTable.id)
      .notNull(),
    scopes: text('scopes').array().notNull(),
    code_challenge: varchar('code_challenge', { length: 255 }),
    code_challenge_method: varchar('code_challenge_method', { length: 10 }),
    redirect_uri: text('redirect_uri').notNull(),
    expires_at: timestamp('expires_at').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
);

// Types
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Client = typeof clientsTable.$inferSelect;
export type NewClient = typeof clientsTable.$inferInsert;

export type Role = typeof rolesTable.$inferSelect;
export type NewRole = typeof rolesTable.$inferInsert;

export type Token = typeof tokensTable.$inferSelect;
export type NewToken = typeof tokensTable.$inferInsert;

export type Tenant = typeof tenantsTable.$inferSelect;
export type NewTenant = typeof tenantsTable.$inferInsert;
