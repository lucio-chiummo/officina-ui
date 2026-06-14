import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  compilePredicate,
  countActiveConditions,
  DEFAULT_OPERATOR,
  filterRows,
  fromUrl,
  isGroup,
  isNullaryOp,
  isStateEmpty,
  toQueryParams,
  toUrl,
  validateState,
  type FilterCondition,
  type FilterDialect,
  type FilterFieldDef,
  type FilterGroup,
  type FilterMode,
  type FilterState,
} from '@/lib/filters';

export type UseFiltersOptions<TRow> = {
  fields: FilterFieldDef<TRow>[];
  mode: FilterMode;
  defaultState?: FilterState;
  urlKey?: string;
  dialect?: FilterDialect;
  onChange?: (state: FilterState) => void;
};

export type FilterChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

export type UseFiltersReturn<TRow> = {
  state: FilterState;
  setState: (next: FilterState | ((prev: FilterState) => FilterState)) => void;
  addCondition: (field: string) => void;
  updateCondition: (id: string, patch: Partial<Omit<FilterCondition, 'id'>>) => void;
  removeCondition: (id: string) => void;
  clear: () => void;
  predicate: (row: TRow) => boolean;
  filter: (rows: TRow[]) => TRow[];
  queryParams: URLSearchParams;
  queryString: string;
  chips: FilterChip[];
  activeCount: number;
  encodedUrl: string;
  fields: FilterFieldDef<TRow>[];
  mode: FilterMode;
};

const emptyState = (): FilterState => ({
  root: { id: nanoid(), combinator: 'AND', conditions: [] },
});

const cloneState = (s: FilterState): FilterState => JSON.parse(JSON.stringify(s)) as FilterState;

const removeById = (group: FilterGroup, id: string): FilterGroup => ({
  ...group,
  conditions: group.conditions
    .filter((n) => n.id !== id)
    .map((n) => (isGroup(n) ? removeById(n, id) : n)),
});

const updateById = (
  group: FilterGroup,
  id: string,
  patch: Partial<Omit<FilterCondition, 'id'>>,
): FilterGroup => ({
  ...group,
  conditions: group.conditions.map((n) => {
    if (isGroup(n)) return updateById(n, id, patch);
    if (n.id !== id) return n;
    return { ...n, ...patch };
  }),
});

const readUrlState = (urlKey: string): FilterState | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(urlKey);
  if (!encoded) return null;
  return fromUrl(encoded, () => nanoid());
};

const writeUrlState = (urlKey: string, state: FilterState): void => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const encoded = toUrl(state);
  if (encoded) params.set(urlKey, encoded);
  else params.delete(urlKey);
  const qs = params.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', next);
};

const formatValue = <TRow>(field: FilterFieldDef<TRow>, value: unknown): string => {
  if (field.format) return field.format(value);
  if (value == null) return '';
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        const opt = field.options?.find((o) => o.value === v);
        return opt?.label ?? String(v);
      })
      .join(', ');
  }
  const opt = field.options?.find((o) => o.value === value);
  if (opt) return opt.label;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return JSON.stringify(value);
};

const OPERATOR_LABEL: Record<string, string> = {
  eq: 'is',
  neq: 'is not',
  contains: 'contains',
  notContains: 'does not contain',
  startsWith: 'starts with',
  endsWith: 'ends with',
  in: 'is any of',
  notIn: 'is none of',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  between: 'between',
  before: 'before',
  after: 'after',
  relative: 'within',
  is: 'is',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
};

export function useFilters<TRow>(opts: UseFiltersOptions<TRow>): UseFiltersReturn<TRow> {
  const { fields, mode, defaultState, urlKey, dialect = 'rest', onChange } = opts;

  const [rawState, setRawState] = useState<FilterState>(() => {
    if (urlKey) {
      const fromUrlState = readUrlState(urlKey);
      if (fromUrlState) return fromUrlState;
    }
    return defaultState ?? emptyState();
  });

  const state = rawState;
  const validated = useMemo(() => validateState(rawState, fields), [rawState, fields]);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.(validated);
  }, [validated]);

  useEffect(() => {
    if (!urlKey) return;
    const t = setTimeout(() => writeUrlState(urlKey, validated), 200);
    return () => clearTimeout(t);
  }, [validated, urlKey]);

  useEffect(() => {
    if (!urlKey || typeof window === 'undefined') return;
    const handler = () => {
      const next = readUrlState(urlKey);
      if (next) setRawState(next);
      else setRawState(emptyState());
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [urlKey]);

  const setState = useCallback((next: FilterState | ((prev: FilterState) => FilterState)) => {
    setRawState((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  const addCondition = useCallback(
    (fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) return;
      const op = field.operators?.[0] ?? DEFAULT_OPERATOR[field.type];
      const cond: FilterCondition = {
        id: nanoid(),
        field: fieldId,
        op,
        value: isNullaryOp(op)
          ? undefined
          : op === 'in' || op === 'notIn' || op === 'between'
            ? []
            : '',
      };
      setRawState((prev) => {
        const next = cloneState(prev);
        next.root.conditions.push(cond);
        return next;
      });
    },
    [fields],
  );

  const updateCondition = useCallback((id: string, patch: Partial<Omit<FilterCondition, 'id'>>) => {
    setRawState((prev) => ({ root: updateById(prev.root, id, patch) }));
  }, []);

  const removeCondition = useCallback((id: string) => {
    setRawState((prev) => ({ root: removeById(prev.root, id) }));
  }, []);

  const clear = useCallback(() => {
    setRawState(emptyState());
  }, []);

  const predicate = useMemo(() => compilePredicate(validated, fields), [validated, fields]);
  const filter = useCallback(
    (rows: TRow[]) => filterRows(rows, validated, fields),
    [validated, fields],
  );

  const queryParams = useMemo(
    () => (mode === 'server' ? toQueryParams(validated, fields, dialect) : new URLSearchParams()),
    [mode, validated, fields, dialect],
  );

  const chips = useMemo<FilterChip[]>(() => {
    const out: FilterChip[] = [];
    const walk = (group: FilterGroup) => {
      for (const node of group.conditions) {
        if (isGroup(node)) {
          walk(node);
          continue;
        }
        const field = fields.find((f) => f.id === node.field);
        if (!field) continue;
        const opLabel = OPERATOR_LABEL[node.op] ?? node.op;
        const label = isNullaryOp(node.op)
          ? `${field.label} ${opLabel}`
          : `${field.label} ${opLabel} ${formatValue(field, node.value)}`;
        out.push({ id: node.id, label, onRemove: () => removeCondition(node.id) });
      }
    };
    walk(validated.root);
    return out;
  }, [validated, fields, removeCondition]);

  const activeCount = useMemo(() => countActiveConditions(validated), [validated]);
  const encodedUrl = useMemo(() => toUrl(validated), [validated]);

  return {
    state,
    setState,
    addCondition,
    updateCondition,
    removeCondition,
    clear,
    predicate: isStateEmpty(validated) ? () => true : predicate,
    filter,
    queryParams,
    queryString: queryParams.toString(),
    chips,
    activeCount,
    encodedUrl,
    fields,
    mode,
  };
}
