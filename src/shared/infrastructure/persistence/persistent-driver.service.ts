import { DrizzleService } from '@/shared/infrastructure/persistence/drizzle/drizzle.service';
import { IPersistentDriver } from '@/shared/infrastructure/persistence/persistence.contract';
import { Injectable } from '@nestjs/common';
import { buildSafeQuery } from '@/shared/infrastructure/persistence/utils/persistent-utils';

@Injectable()
export class PersistentDriverService<T> implements IPersistentDriver<T> {
  constructor(public readonly drizzleService: DrizzleService) {}

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  async executeSQL(sql: string, values: Array<any>): Promise<{ rows: T[] }> {
    // Escapes a single value safely

    const safeSql = buildSafeQuery(sql, values);
    const res = await this.drizzleService.drizzle.execute(safeSql);

    return {
      rows: res.rows as T[],
    };
  }
}
