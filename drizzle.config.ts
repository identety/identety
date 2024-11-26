import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import * as process from 'node:process';

export default defineConfig({
  out: './drizzle-migrations',
  schema: './src/common/persistence/drizzle/schemas.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
