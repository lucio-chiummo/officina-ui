import { isMultiValueOp, isNullaryOp, isRangeOp, operatorsFor } from './operators';
import {
  isGroup,
  type FilterCondition,
  type FilterFieldDef,
  type FilterGroup,
  type FilterOperator,
  type FilterState,
} from './types';

export const MAX_NESTING_DEPTH = 2;

type FieldMap<TRow> = Map<string, FilterFieldDef<TRow>>;

const indexFields = <TRow>(fields: FilterFieldDef<TRow>[]): FieldMap<TRow> => {
  const map = new Map<string, FilterFieldDef<TRow>>();
  for (const f of fields) map.set(f.id, f);
  return map;
};

const isValidValueForOp = (op: FilterOperator, value: unknown): boolean => {
  if (isNullaryOp(op)) return true;
  if (isRangeOp(op)) {
    return (
      Array.isArray(value) &&
      value.length === 2 &&
      value.every((v) => v !== undefined && v !== '' && v !== null)
    );
  }
  if (isMultiValueOp(op)) return Array.isArray(value) && value.length > 0;
  return value !== undefined && value !== null && value !== '';
};

const validateCondition = <TRow>(
  cond: FilterCondition,
  fields: FieldMap<TRow>,
): FilterCondition | null => {
  const field = fields.get(cond.field);
  if (!field) return null;
  const allowed = new Set(operatorsFor(field.type, field.operators));
  if (!allowed.has(cond.op)) return null;
  if (!isValidValueForOp(cond.op, cond.value)) return null;
  return cond;
};

const validateGroup = <TRow>(
  group: FilterGroup,
  fields: FieldMap<TRow>,
  depth: number,
): FilterGroup => {
  const next: Array<FilterCondition | FilterGroup> = [];
  for (const node of group.conditions) {
    if (isGroup(node)) {
      if (depth + 1 > MAX_NESTING_DEPTH) {
        for (const inner of node.conditions) {
          if (isGroup(inner)) continue;
          const ok = validateCondition(inner, fields);
          if (ok) next.push(ok);
        }
        continue;
      }
      const cleaned = validateGroup(node, fields, depth + 1);
      if (cleaned.conditions.length > 0) next.push(cleaned);
    } else {
      const ok = validateCondition(node, fields);
      if (ok) next.push(ok);
    }
  }
  return { ...group, conditions: next };
};

export function validateState<TRow>(
  state: FilterState,
  fields: FilterFieldDef<TRow>[],
): FilterState {
  if (!state || !state.root) {
    return { root: { id: 'root', combinator: 'AND', conditions: [] } };
  }
  const map = indexFields(fields);
  return { root: validateGroup(state.root, map, 1) };
}

export const isStateEmpty = (state: FilterState | null | undefined): boolean =>
  !state || !state.root || state.root.conditions.length === 0;

export const countActiveConditions = (state: FilterState): number => {
  let n = 0;
  const walk = (group: FilterGroup) => {
    for (const node of group.conditions) {
      if (isGroup(node)) walk(node);
      else n += 1;
    }
  };
  walk(state.root);
  return n;
};
