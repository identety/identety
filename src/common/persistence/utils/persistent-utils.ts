import {
  IPersistentFilter,
  IPersistentOrderBy,
} from '@/shared/persistence/persistence.contract';

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
    const safeKey = `"${key.toString()}"`; // Escape column name to prevent SQL injection
    const safeDirection = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Ensure valid direction
    return `${safeKey} ${safeDirection}`;
  });

  return `ORDER BY ${orderByConditions.join(', ')}`;
};
