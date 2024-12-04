import { IPersistentDriver } from '@/shared/infrastructure/persistence/persistence.contract';
import { buildSafeQuery } from '@/shared/infrastructure/persistence/utils/persistent-utils';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PersistentDriverService<T>
  implements IPersistentDriver<T>, OnModuleDestroy
{
  private pgClient: Pool;

  constructor() {
    this.pgClient = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  async onModuleDestroy() {
    await this.pgClient?.end();
  }

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  async executeSQL(sql: string, values: Array<any>): Promise<{ rows: T[] }> {
    // Escapes a single value safely
    const safeSql = buildSafeQuery(sql, values);
    const result = await this.pgClient.query(safeSql);

    return {
      rows: result.rows as T[],
    };
  }
}
