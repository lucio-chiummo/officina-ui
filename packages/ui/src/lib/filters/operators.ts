import type { FilterFieldType, FilterOperator } from './types';

export const OPERATORS_BY_TYPE: Record<FilterFieldType, FilterOperator[]> = {
  string: [
    'contains',
    'notContains',
    'eq',
    'neq',
    'startsWith',
    'endsWith',
    'in',
    'isEmpty',
    'isNotEmpty',
  ],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'isEmpty', 'isNotEmpty'],
  date: ['before', 'after', 'between', 'relative', 'isEmpty', 'isNotEmpty'],
  enum: ['in', 'notIn', 'eq', 'neq', 'isEmpty', 'isNotEmpty'],
  boolean: ['is', 'isEmpty', 'isNotEmpty'],
};

export const DEFAULT_OPERATOR: Record<FilterFieldType, FilterOperator> = {
  string: 'contains',
  number: 'eq',
  date: 'after',
  enum: 'in',
  boolean: 'is',
};

const NULLARY: ReadonlySet<FilterOperator> = new Set(['isEmpty', 'isNotEmpty']);
const BINARY_RANGE: ReadonlySet<FilterOperator> = new Set(['between']);
const MULTI: ReadonlySet<FilterOperator> = new Set(['in', 'notIn']);

export const isNullaryOp = (op: FilterOperator) => NULLARY.has(op);
export const isRangeOp = (op: FilterOperator) => BINARY_RANGE.has(op);
export const isMultiValueOp = (op: FilterOperator) => MULTI.has(op);

export const operatorsFor = (
  type: FilterFieldType,
  override?: FilterOperator[],
): FilterOperator[] => {
  if (override && override.length > 0) {
    const valid = new Set(OPERATORS_BY_TYPE[type]);
    return override.filter((op) => valid.has(op));
  }
  return OPERATORS_BY_TYPE[type];
};
