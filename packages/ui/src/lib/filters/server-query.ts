import { isNullaryOp } from './operators';
import {
  isGroup,
  type FilterCondition,
  type FilterDialect,
  type FilterFieldDef,
  type FilterGroup,
  type FilterState,
} from './types';

const REST_OP_SUFFIX: Record<string, string> = {
  eq: 'eq',
  neq: 'neq',
  contains: 'contains',
  notContains: 'notContains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
  in: 'in',
  notIn: 'notIn',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  between: 'between',
  before: 'lt',
  after: 'gt',
  relative: 'relative',
  is: 'eq',
  isEmpty: 'isEmpty',
  isNotEmpty: 'isNotEmpty',
};

const RSQL_OP: Record<string, string> = {
  eq: '==',
  neq: '!=',
  contains: '=like=',
  notContains: '=notlike=',
  startsWith: '=prefix=',
  endsWith: '=suffix=',
  in: '=in=',
  notIn: '=out=',
  gt: '=gt=',
  gte: '=ge=',
  lt: '=lt=',
  lte: '=le=',
  between: '=between=',
  before: '=lt=',
  after: '=gt=',
  relative: '=relative=',
  is: '==',
  isEmpty: '=isnull=',
  isNotEmpty: '=isnotnull=',
};

const flattenConditions = (group: FilterGroup): FilterCondition[] => {
  const out: FilterCondition[] = [];
  for (const node of group.conditions) {
    if (isGroup(node)) out.push(...flattenConditions(node));
    else out.push(node);
  }
  return out;
};

const primitiveToString = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
  if (v instanceof Date) return v.toISOString();
  return '';
};

const formatValueForRest = (value: unknown): string => {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(primitiveToString).join(',');
  return primitiveToString(value);
};

const formatValueForRsql = (value: unknown): string => {
  if (value == null) return '';
  if (Array.isArray(value)) return `(${value.map((v) => JSON.stringify(v)).join(',')})`;
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  return JSON.stringify(value);
};

const buildRest = (group: FilterGroup): URLSearchParams => {
  const params = new URLSearchParams();
  for (const cond of flattenConditions(group)) {
    const suffix = REST_OP_SUFFIX[cond.op];
    if (!suffix) continue;
    const key = `${cond.field}__${suffix}`;
    if (isNullaryOp(cond.op)) {
      params.append(key, 'true');
    } else {
      params.append(key, formatValueForRest(cond.value));
    }
  }
  if (group.combinator === 'OR') params.set('_combinator', 'or');
  return params;
};

const conditionToRsql = (cond: FilterCondition): string | null => {
  const op = RSQL_OP[cond.op];
  if (!op) return null;
  if (isNullaryOp(cond.op)) return `${cond.field}${op}`;
  return `${cond.field}${op}${formatValueForRsql(cond.value)}`;
};

const groupToRsql = (group: FilterGroup, nested = false): string => {
  const sep = group.combinator === 'AND' ? ';' : ',';
  const parts = group.conditions.flatMap((node) => {
    const part = isGroup(node) ? groupToRsql(node, true) : conditionToRsql(node);
    return part ? [part] : [];
  });
  if (parts.length === 0) return '';
  const expression = parts.join(sep);
  return nested && parts.length > 1 ? `(${expression})` : expression;
};

const buildRsql = (group: FilterGroup): URLSearchParams => {
  const params = new URLSearchParams();
  const expression = groupToRsql(group);
  if (expression) params.set('filter', expression);
  return params;
};

const groupToGraphqlWhere = (group: FilterGroup): Record<string, unknown> => {
  const branches: Array<Record<string, unknown>> = [];
  for (const node of group.conditions) {
    if (isGroup(node)) {
      branches.push(groupToGraphqlWhere(node));
    } else {
      branches.push({ [node.field]: { [node.op]: node.value } });
    }
  }
  const key = group.combinator === 'AND' ? '_and' : '_or';
  return { [key]: branches };
};

const buildGraphql = (group: FilterGroup): URLSearchParams => {
  const params = new URLSearchParams();
  if (group.conditions.length > 0) {
    params.set('where', JSON.stringify(groupToGraphqlWhere(group)));
  }
  return params;
};

export function toQueryParams<TRow>(
  state: FilterState,
  _fields: FilterFieldDef<TRow>[],
  dialect: FilterDialect = 'rest',
): URLSearchParams {
  if (!state || !state.root || state.root.conditions.length === 0) {
    return new URLSearchParams();
  }
  switch (dialect) {
    case 'rsql':
      return buildRsql(state.root);
    case 'graphql-where':
      return buildGraphql(state.root);
    case 'rest':
    default:
      return buildRest(state.root);
  }
}
