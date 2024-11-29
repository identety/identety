import {
  DatabaseTableName,
  drizzleSchemaTableMap,
} from '@/shared/infrastructure/persistence/drizzle/schemas';
import {
  AppPaginationResponseDto,
  IPagination,
  IPersistentDriver,
  IPersistentFilterPayload,
  IPersistentPaginationFilterPayload,
} from '@/shared/infrastructure/persistence/persistence.contract';
import {
  buildOrderByClause,
  buildSetClause,
  buildWhereClause,
  makeColumnsSnakeCase,
} from '@/shared/infrastructure/persistence/utils/persistent-utils';

/**
 * BaseDatabaseService
 *
 * This class is used to perform basic CRUD operations on the database.
 * It provides methods to create, update, and delete records in the database.
 *
 * @template DOMAIN_MODEL_TYPE - The type of the domain model that this service is responsible for.
 */
export abstract class PersistentRepository<DOMAIN_MODEL_TYPE> {
  protected constructor(
    public readonly tableName: DatabaseTableName,
    public readonly persistentDriver: IPersistentDriver<DOMAIN_MODEL_TYPE>,
  ) {}

  async findAllWithPagination(
    payload: IPagination<DOMAIN_MODEL_TYPE>,
  ): Promise<AppPaginationResponseDto<DOMAIN_MODEL_TYPE>> {
    const _limit = payload.limit || 10;
    const _page = payload.page || 1;
    const _offset = (_page - 1) * _limit;

    // Raw SQL for the total count
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM ${this.tableName};
    `;

    // Execute the main query
    const nodes = await this.findRows({
      limit: _limit,
      offset: _offset,
      columns: payload?.columns || [],
      filters: payload?.filters || [],
      orderBy: payload?.orderBy || [],
    });

    // Execute the count query
    const totalCountResult = await this.persistentDriver.executeSQL(
      countQuery,
      [],
    );
    const totalCount = 0;

    return {
      nodes: nodes as DOMAIN_MODEL_TYPE[],
      meta: {
        totalCount,
        currentPage: _page,
        hasNextPage: _page * _limit < totalCount,
        totalPages: Math.ceil(totalCount / _limit),
      },
    };
  }

  /**
   * Finds rows in the database based on the provided filter criteria.
   * @param payload
   */
  async findRows(
    payload: IPersistentPaginationFilterPayload<DOMAIN_MODEL_TYPE>,
  ) {
    // Default columns to '*' if none are provided
    const columns = makeColumnsSnakeCase(payload.columns as any);
    const { whereClause, values } = buildWhereClause(payload.filters);
    const orderByClause = buildOrderByClause(payload.orderBy);

    // Build the SQL query with LIMIT, OFFSET, and ORDER BY
    const limit = payload.limit ?? 10; // Default limit to 10 if not provided
    const offset = payload.offset ?? 0; // Default offset to 0 if not provided

    // Build the final SQL query
    const sqlQuery = `
      SELECT ${columns}
      FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ${orderByClause ? orderByClause : ''}
      ${limit ? `LIMIT ${limit}` : ''} ${offset ? `OFFSET ${offset}` : ''};
    `;

    // Execute the SQL query
    const result = await this.persistentDriver.executeSQL(sqlQuery, values);
    return result.rows as DOMAIN_MODEL_TYPE[];
  }

  /**
   * Finds the count of rows in the database based on the provided filter criteria.
   * @param payload
   */
  async findRowCount(
    payload: IPersistentPaginationFilterPayload<DOMAIN_MODEL_TYPE>,
  ): Promise<number> {
    // // if (payload.filters.length === 0) {
    // //   throw new Error('At least one filter must be provided.');
    // // }
    //
    // // Build the WHERE clause with the specified logical operator
    // const whereClauses = payload.filters.map(
    //   (filter, index) => `"${filter.key}" ${filter.operator} '${filter.value}'`,
    // );
    // const whereClause = whereClauses.join(
    //   ` ${payload.logicalOperator || 'and'} `,
    // );
    //
    // // Construct the SQL query
    // const query = `
    //   SELECT COUNT(*)
    //   FROM ${this.tableName}
    //   WHERE ${whereClause};
    // `;
    //
    // const result = await this.drizzleService.drizzle.execute(query);
    // return result.rows[0].count as number;

    return 0;
  }

  /**
   * Creates a new record in the database.
   *
   * @param data - The data to be inserted.
   * @returns The newly created record.
   */
  async createOne(
    data: Partial<DOMAIN_MODEL_TYPE>,
  ): Promise<DOMAIN_MODEL_TYPE> {
    // Prepare columns and placeholders for the insert statement
    function toSnakeCase(str: string): string {
      return str
        .replace(/([A-Z])/g, '_$1')
        .replace(/^_/, '')
        .toLowerCase();
    }

    const columns = Object.keys(data).map(toSnakeCase).join(', ');

    const placeholders = Object.keys(data)
      .map((_, index) => `$${index + 1}`)
      .join(', ');
    const values = Object.values(data) as any[];

    // Build the SQL query
    const sql = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `;

    // Execute the SQL query
    const result = await this.executeSQL(sql, values);
    return result.rows[0] as DOMAIN_MODEL_TYPE;
  }

  /**
   * Creates multiple records in the database.
   *
   * @param payload
   */
  async createMany(
    payload: Partial<DOMAIN_MODEL_TYPE>[],
  ): Promise<DOMAIN_MODEL_TYPE[]> {
    const results = [];

    for (const data of payload) {
      results.push(await this.createOne(data));
    }
    return results as DOMAIN_MODEL_TYPE[];
  }

  async updateOne(
    payload: IPersistentFilterPayload<DOMAIN_MODEL_TYPE>,
    data: Partial<DOMAIN_MODEL_TYPE>,
  ): Promise<DOMAIN_MODEL_TYPE> {
    const { whereClause, values } = buildWhereClause(payload.filters);
    const setClause = buildSetClause(data);
    const columns = makeColumnsSnakeCase(payload.columns as any);

    const sql = `
       UPDATE ${this.tableName}
       ${setClause ? `SET ${setClause}` : ''}
       ${whereClause ? `WHERE ${whereClause}` : ''}
       RETURNING ${columns};
     `;

    const result = await this.executeSQL(sql, values);
    return result.rows[0] as DOMAIN_MODEL_TYPE;
  }

  /**
   * Deletes rows in the database based on the provided filter criteria.
   * @param payload
   */
  deleteRows(payload: IPersistentFilterPayload<DOMAIN_MODEL_TYPE>) {
    const { whereClause, values } = buildWhereClause(payload.filters);
    const columns = makeColumnsSnakeCase(payload.columns as any);

    const sql = `
       DELETE FROM ${this.tableName}
       ${whereClause ? `WHERE ${whereClause}` : ''}
       RETURNING ${columns};
     `;

    return this.executeSQL(sql, values);
  }

  //------------------------------------
  // Utils
  //------------------------------------
  buildSelectFields(fields: string[]) {
    return fields.reduce((acc, field) => {
      acc[field] = drizzleSchemaTableMap[this.tableName][field];
      return acc;
    }, {} as any);
  }

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  executeSQL(sql: string, values: DOMAIN_MODEL_TYPE[]) {
    return this.persistentDriver.executeSQL(sql, values);
  }
}