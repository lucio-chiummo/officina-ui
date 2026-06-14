export type FilterFieldType = 'string' | 'number' | 'date' | 'enum' | 'boolean';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'notIn'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'before'
  | 'after'
  | 'relative'
  | 'is'
  | 'isEmpty'
  | 'isNotEmpty';

export type FilterFieldOption = { label: string; value: string | number };

export type FilterFieldDef<TRow = unknown> = {
  id: string;
  label: string;
  type: FilterFieldType;
  accessor?: (row: TRow) => unknown;
  options?: FilterFieldOption[];
  operators?: FilterOperator[];
  format?: (v: unknown) => string;
};

export type FilterCondition = {
  id: string;
  field: string;
  op: FilterOperator;
  value: unknown;
};

export type FilterCombinator = 'AND' | 'OR';

export type FilterGroup = {
  id: string;
  combinator: FilterCombinator;
  conditions: Array<FilterCondition | FilterGroup>;
};

export type FilterState = { root: FilterGroup };

export type FilterMode = 'client' | 'server';

export type FilterDialect = 'rest' | 'rsql' | 'graphql-where';

export type SavedView = {
  id: string;
  name: string;
  state: FilterState;
  pinned?: boolean;
  createdAt: string;
};

export const isGroup = (node: FilterCondition | FilterGroup): node is FilterGroup =>
  typeof (node as FilterGroup).combinator === 'string' &&
  Array.isArray((node as FilterGroup).conditions);
