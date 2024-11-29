import { DrizzleService } from '@/shared/infrastructure/persistence/drizzle/drizzle.service';
import { IPersistentDriver } from '@/shared/infrastructure/persistence/persistence.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PersistentDriverService<T> implements IPersistentDriver<T> {
  constructor(public readonly drizzleService: DrizzleService) {}

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  async executeSQL(sql: string, values: Array<any>): Promise<{ rows: T[] }> {
    function buildSafeQuery(sql: string, values: any[]): string {
      return sql.replace(/\$(\d+)/g, (_, index) => {
        const value = values[parseInt(index, 10) - 1];
        return escapeValue(value);
      });
    }

    // Escapes a single value safely
    function escapeValue(value: any): string {
      console.log({
        value,
        typeofValue: typeof value,
      });

      if (value === null) return 'NULL';
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
      if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`; // Escape single quotes
      if (typeof value === 'object') {
        const isArray =
          Object.prototype.toString.call(value) == '[object Array]';

        if (isArray) {
          return `ARRAY[${value.map((v) => escapeValue(v)).join(',')}]`;
        } else {
          return `JSONB '${JSON.stringify(value)}'`;
        }
      } // throw new Error(`Unsupported value type: ${typeof value}`);
      return value;
    }

    const safeSql = buildSafeQuery(sql, values);
    const res = await this.drizzleService.drizzle.execute(safeSql);

    return {
      rows: res.rows as T[],
    };
  }
}
