import { afterEach, describe, expect, it, vi } from 'vitest';

import type { FilterFieldDef, FilterState } from './types';

import { compilePredicate, filterRows } from './predicate';

type Row = {
  name: string;
  age: number;
  plan: 'free' | 'pro' | 'enterprise';
  joined: string;
  active: boolean;
  tags?: string[];
};

const fields: FilterFieldDef<Row>[] = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'plan', label: 'Plan', type: 'enum' },
  { id: 'joined', label: 'Joined', type: 'date' },
  { id: 'active', label: 'Active', type: 'boolean' },
  { id: 'tags', label: 'Tags', type: 'string', accessor: (r) => r.tags },
];

const rows: Row[] = [
  { name: 'Alice', age: 30, plan: 'pro', joined: '2025-01-01', active: true, tags: ['a'] },
  { name: 'Bob', age: 22, plan: 'free', joined: '2024-06-15', active: false, tags: [] },
  { name: 'Carol', age: 45, plan: 'enterprise', joined: '2023-03-20', active: true },
  { name: 'Dave', age: 28, plan: 'pro', joined: '2025-05-10', active: true, tags: ['b'] },
];

afterEach(() => {
  vi.useRealTimers();
});

const state = (...conds: Array<{ field: string; op: string; value?: unknown }>): FilterState => ({
  root: {
    id: 'root',
    combinator: 'AND',
    conditions: conds.map((c, i) => ({
      id: `c${i}`,
      field: c.field,
      op: c.op as never,
      value: c.value,
    })),
  },
});

describe('compilePredicate — empty', () => {
  it('returns ALWAYS_TRUE for empty state', () => {
    const pred = compilePredicate({ root: { id: 'r', combinator: 'AND', conditions: [] } }, fields);
    expect(rows.every(pred)).toBe(true);
  });
});

describe('string operators', () => {
  it('contains case-insensitive', () => {
    expect(
      filterRows(rows, state({ field: 'name', op: 'contains', value: 'ali' }), fields),
    ).toHaveLength(1);
  });
  it('startsWith', () => {
    expect(
      filterRows(rows, state({ field: 'name', op: 'startsWith', value: 'C' }), fields).map(
        (r) => r.name,
      ),
    ).toEqual(['Carol']);
  });
  it('endsWith', () => {
    expect(
      filterRows(rows, state({ field: 'name', op: 'endsWith', value: 'ave' }), fields).map(
        (r) => r.name,
      ),
    ).toEqual(['Dave']);
  });
  it('eq', () => {
    expect(filterRows(rows, state({ field: 'name', op: 'eq', value: 'Bob' }), fields)).toHaveLength(
      1,
    );
  });
  it('neq', () => {
    expect(
      filterRows(rows, state({ field: 'name', op: 'neq', value: 'Bob' }), fields),
    ).toHaveLength(3);
  });
  it('notContains', () => {
    expect(
      filterRows(rows, state({ field: 'name', op: 'notContains', value: 'a' }), fields).map(
        (r) => r.name,
      ),
    ).toEqual(['Bob']);
  });
});

describe('number operators', () => {
  it('gt/lt', () => {
    expect(
      filterRows(rows, state({ field: 'age', op: 'gt', value: 30 }), fields).map((r) => r.name),
    ).toEqual(['Carol']);
    expect(
      filterRows(rows, state({ field: 'age', op: 'lt', value: 30 }), fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Bob', 'Dave']);
  });
  it('gte/lte', () => {
    expect(
      filterRows(rows, state({ field: 'age', op: 'gte', value: 30 }), fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Alice', 'Carol']);
    expect(
      filterRows(rows, state({ field: 'age', op: 'lte', value: 22 }), fields).map((r) => r.name),
    ).toEqual(['Bob']);
  });
  it('between', () => {
    expect(
      filterRows(rows, state({ field: 'age', op: 'between', value: [25, 35] }), fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Alice', 'Dave']);
  });
});

describe('enum operators', () => {
  it('in', () => {
    expect(
      filterRows(rows, state({ field: 'plan', op: 'in', value: ['pro', 'enterprise'] }), fields),
    ).toHaveLength(3);
  });
  it('notIn', () => {
    expect(
      filterRows(rows, state({ field: 'plan', op: 'notIn', value: ['free'] }), fields),
    ).toHaveLength(3);
  });
});

describe('date operators', () => {
  it('before/after with ISO strings', () => {
    expect(
      filterRows(rows, state({ field: 'joined', op: 'before', value: '2024-01-01' }), fields).map(
        (r) => r.name,
      ),
    ).toEqual(['Carol']);
    expect(
      filterRows(rows, state({ field: 'joined', op: 'after', value: '2025-01-01' }), fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Dave']);
  });

  it('relative windows do not include future dates', () => {
    vi.setSystemTime(new Date('2025-05-20T00:00:00Z'));
    const datedRows: Row[] = [
      { name: 'Past', age: 30, plan: 'pro', joined: '2025-05-19', active: true },
      { name: 'Future', age: 30, plan: 'pro', joined: '2025-05-21', active: true },
    ];

    expect(
      filterRows(datedRows, state({ field: 'joined', op: 'relative', value: '7d' }), fields).map(
        (r) => r.name,
      ),
    ).toEqual(['Past']);
  });
});

describe('boolean operators', () => {
  it('is', () => {
    expect(
      filterRows(rows, state({ field: 'active', op: 'is', value: true }), fields),
    ).toHaveLength(3);
    expect(
      filterRows(rows, state({ field: 'active', op: 'is', value: false }), fields),
    ).toHaveLength(1);
  });
});

describe('nullary operators', () => {
  it('isEmpty / isNotEmpty on array accessor', () => {
    expect(
      filterRows(rows, state({ field: 'tags', op: 'isEmpty' }), fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Bob', 'Carol']);
    expect(
      filterRows(rows, state({ field: 'tags', op: 'isNotEmpty' }), fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Alice', 'Dave']);
  });
});

describe('group combinators', () => {
  it('AND across multiple conditions', () => {
    const s: FilterState = {
      root: {
        id: 'r',
        combinator: 'AND',
        conditions: [
          { id: '1', field: 'plan', op: 'eq', value: 'pro' },
          { id: '2', field: 'active', op: 'is', value: true },
        ],
      },
    };
    expect(
      filterRows(rows, s, fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Alice', 'Dave']);
  });

  it('OR across multiple conditions', () => {
    const s: FilterState = {
      root: {
        id: 'r',
        combinator: 'OR',
        conditions: [
          { id: '1', field: 'plan', op: 'eq', value: 'free' },
          { id: '2', field: 'age', op: 'gt', value: 40 },
        ],
      },
    };
    expect(
      filterRows(rows, s, fields)
        .map((r) => r.name)
        .sort(),
    ).toEqual(['Bob', 'Carol']);
  });

  it('nested group: (plan=pro) AND (age<30 OR active=false)', () => {
    const s: FilterState = {
      root: {
        id: 'r',
        combinator: 'AND',
        conditions: [
          { id: '1', field: 'plan', op: 'eq', value: 'pro' },
          {
            id: 'g',
            combinator: 'OR',
            conditions: [
              { id: '2', field: 'age', op: 'lt', value: 30 },
              { id: '3', field: 'active', op: 'is', value: false },
            ],
          },
        ],
      },
    };
    expect(filterRows(rows, s, fields).map((r) => r.name)).toEqual(['Dave']);
  });
});

describe('unknown field tolerance', () => {
  it('ignores conditions targeting unknown fields', () => {
    expect(
      filterRows(rows, state({ field: 'unknown', op: 'eq', value: 'x' }), fields),
    ).toHaveLength(rows.length);
  });
});
