// 1. Tenants
import { boolean, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './common.schema';

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 255 }).unique(),
  settings: jsonb('settings').default({}).notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  ...timestamps,
});
