import { isNullaryOp } from './operators';
import {
  isGroup,
  type FilterCondition,
  type FilterFieldDef,
  type FilterGroup,
  type FilterState,
} from './types';

type FieldMap<TRow> = Map<string, FilterFieldDef<TRow>>;

const ALWAYS_TRUE = () => true;

const indexFields = <TRow>(fields: FilterFieldDef<TRow>[]): FieldMap<TRow> => {
  const map = new Map<string, FilterFieldDef<TRow>>();
  for (const f of fields) map.set(f.id, f);
  return map;
};

const readValue = <TRow>(row: TRow, field: FilterFieldDef<TRow>): unknown => {
  if (field.accessor) return field.accessor(row);
  if (row != null && typeof row === 'object') {
    return (row as Record<string, unknown>)[field.id];
  }
  return undefined;
};

const toComparable = (raw: unknown, type: FilterFieldDef['type']): unknown => {
  if (raw == null) return raw;
  if (type === 'date') {
    if (raw instanceof Date) return raw.getTime();
    if (typeof raw === 'string' || typeof raw === 'number') {
      const t = new Date(raw).getTime();
      return Number.isNaN(t) ? undefined : t;
    }
    return undefined;
  }
  if (type === 'number') {
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string' && raw !== '') {
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    }
    return undefined;
  }
  if (type === 'string') {
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw);
    return undefined;
  }
  return raw;
};

const RELATIVE_MS: Record<string, number> = {
  today: 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  '90d': 90 * 24 * 60 * 60 * 1000,
  '1y': 365 * 24 * 60 * 60 * 1000,
};

const evalCondition = <TRow>(row: TRow, cond: FilterCondition, fields: FieldMap<TRow>): boolean => {
  const field = fields.get(cond.field);
  if (!field) return true;
  const raw = readValue(row, field);

  if (isNullaryOp(cond.op)) {
    const empty =
      raw == null ||
      (typeof raw === 'string' && raw.length === 0) ||
      (Array.isArray(raw) && raw.length === 0);
    return cond.op === 'isEmpty' ? empty : !empty;
  }

  const v = toComparable(raw, field.type);
  const target = cond.value;

  switch (cond.op) {
    case 'eq':
      return v === toComparable(target, field.type);
    case 'neq':
      return v !== toComparable(target, field.type);
    case 'contains':
      return typeof v === 'string' && typeof target === 'string'
        ? v.toLowerCase().includes(target.toLowerCase())
        : false;
    case 'notContains':
      return typeof v === 'string' && typeof target === 'string'
        ? !v.toLowerCase().includes(target.toLowerCase())
        : true;
    case 'startsWith':
      return typeof v === 'string' && typeof target === 'string'
        ? v.toLowerCase().startsWith(target.toLowerCase())
        : false;
    case 'endsWith':
      return typeof v === 'string' && typeof target === 'string'
        ? v.toLowerCase().endsWith(target.toLowerCase())
        : false;
    case 'in':
      return Array.isArray(target) && target.some((t) => toComparable(t, field.type) === v);
    case 'notIn':
      return !Array.isArray(target) || !target.some((t) => toComparable(t, field.type) === v);
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte': {
      const t = toComparable(target, field.type);
      if (typeof v !== 'number' || typeof t !== 'number') return false;
      if (cond.op === 'gt') return v > t;
      if (cond.op === 'gte') return v >= t;
      if (cond.op === 'lt') return v < t;
      return v <= t;
    }
    case 'between': {
      if (!Array.isArray(target) || target.length !== 2) return false;
      const lo = toComparable(target[0], field.type);
      const hi = toComparable(target[1], field.type);
      if (typeof v !== 'number' || typeof lo !== 'number' || typeof hi !== 'number') return false;
      return v >= lo && v <= hi;
    }
    case 'before': {
      const t = toComparable(target, field.type);
      return typeof v === 'number' && typeof t === 'number' && v < t;
    }
    case 'after': {
      const t = toComparable(target, field.type);
      return typeof v === 'number' && typeof t === 'number' && v > t;
    }
    case 'relative': {
      if (typeof target !== 'string') return false;
      const window = RELATIVE_MS[target];
      if (!window || typeof v !== 'number') return false;
      const age = Date.now() - v;
      return age >= 0 && age <= window;
    }
    case 'is':
      return Boolean(v) === Boolean(target);
    default:
      return true;
  }
};

const evalGroup = <TRow>(row: TRow, group: FilterGroup, fields: FieldMap<TRow>): boolean => {
  if (group.conditions.length === 0) return true;
  if (group.combinator === 'AND') {
    for (const node of group.conditions) {
      const ok = isGroup(node) ? evalGroup(row, node, fields) : evalCondition(row, node, fields);
      if (!ok) return false;
    }
    return true;
  }
  for (const node of group.conditions) {
    const ok = isGroup(node) ? evalGroup(row, node, fields) : evalCondition(row, node, fields);
    if (ok) return true;
  }
  return false;
};

const isEmptyState = (state: FilterState): boolean =>
  !state || !state.root || state.root.conditions.length === 0;

export function compilePredicate<TRow>(
  state: FilterState,
  fields: FilterFieldDef<TRow>[],
): (row: TRow) => boolean {
  if (isEmptyState(state)) return ALWAYS_TRUE;
  const map = indexFields(fields);
  return (row: TRow) => evalGroup(row, state.root, map);
}

export function filterRows<TRow>(
  rows: TRow[],
  state: FilterState,
  fields: FilterFieldDef<TRow>[],
): TRow[] {
  const pred = compilePredicate(state, fields);
  return pred === ALWAYS_TRUE ? rows : rows.filter(pred);
}
