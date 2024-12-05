import {
  IPersistentFilter,
  IPersistentOrderBy,
} from '@/shared/infrastructure/persistence/persistence.contract';

export const buildWhereClause = <T>(
  filters: Array<
    | IPersistentFilter<T>
    | { or?: IPersistentFilter<T>[]; and?: IPersistentFilter<T>[] }
  >,
  values: any[] = [],
  logicalOperator: 'AND' | 'OR' = 'AND', // Add logical operator for this level
): { whereClause: string; values: any[] } => {
  const conditions: string[] = [];

  filters.forEach((filter) => {
    if ('or' in filter || 'and' in filter) {
      const operator = 'or' in filter ? 'OR' : 'AND'; // Determine operator for nested filters
      const subFilters = filter.or || filter.and;
      const { whereClause: subClause, values: subValues } = buildWhereClause(
        subFilters!,
        values,
        operator, // Pass the operator for the next level
      );
      conditions.push(`(${subClause})`); // Wrap nested conditions in parentheses
      values.push(...subValues);
    } else {
      const { key, operator, value } = filter as IPersistentFilter<T>;
      const placeholder = `$${values.length + 1}`;
      conditions.push(`"${key.toString()}" ${operator} ${placeholder}`);
      values.push(value);
    }
  });

  return {
    whereClause: conditions.join(` ${logicalOperator} `), // Use the operator passed for this level
    values,
  };
};

export const buildOrderByClause = <T>(
  orderBy?: Array<IPersistentOrderBy<T>>,
): string => {
  if (!orderBy || orderBy.length === 0) {
    return ''; // No order by clause
  }

  const orderByConditions = orderBy.map(({ key, direction }) => {
    const safeKey = `"${key?.toString()}"`; // Escape column name to prevent SQL injection
    const safeDirection = direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Ensure valid direction
    return `${safeKey} ${safeDirection}`;
  });

  return `ORDER BY ${orderByConditions.join(', ')}`;
};

export const buildSetClause = <T>(data: Partial<T>): string => {
  return Object.keys(data)
    .map((key) => `${toSnakeCase(key)} = ${formatSqlValue(data[key])}`)
    .join(', ');
};

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/^_/, '')
    .toLowerCase();
}

export const makeColumnsSnakeCase = (columns: string[]): string => {
  console.log({ columns });

  return columns?.length
    ? columns
        .map((c) => `"${c.toString()}"`)
        .map(toSnakeCase)
        .join(', ')
    : '*';
};

export function formatSqlValue(value: any): string {
  if (value === null) return 'NULL';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`; // Escape single quotes
  if (typeof value === 'object') {
    const isArray = Object.prototype.toString.call(value) == '[object Array]';

    if (isArray) {
      if (value.length === 0) return `'{}'`;
      return `ARRAY[${value.map((v) => formatSqlValue(v)).join(',')}]`;
    } else {
      return `JSONB '${JSON.stringify(value)}'`;
    }
  } // throw new Error(`Unsupported value type: ${typeof value}`);
  return value;
}

export function buildSafeQuery(sql: string, values: any[]): string {
  return sql.replace(/\$(\d+)/g, (_, index) => {
    const value = values[parseInt(index, 10) - 1];
    return formatSqlValue(value);
  });
}
