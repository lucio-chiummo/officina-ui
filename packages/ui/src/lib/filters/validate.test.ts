import { describe, expect, it } from 'vitest';

import type { FilterFieldDef, FilterState } from './types';

import { countActiveConditions, isStateEmpty, MAX_NESTING_DEPTH, validateState } from './validate';

const fields: FilterFieldDef[] = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
];

describe('validateState', () => {
  it('strips conditions targeting unknown fields', () => {
    const state: FilterState = {
      root: {
        id: 'r',
        combinator: 'AND',
        conditions: [
          { id: '1', field: 'name', op: 'eq', value: 'a' },
          { id: '2', field: 'unknown', op: 'eq', value: 'x' },
        ],
      },
    };
    const v = validateState(state, fields);
    expect(v.root.conditions).toHaveLength(1);
  });

  it('strips operators not allowed by field type', () => {
    const state: FilterState = {
      root: {
        id: 'r',
        combinator: 'AND',
        conditions: [
          { id: '1', field: 'age', op: 'contains', value: 'x' },
          { id: '2', field: 'age', op: 'gt', value: 5 },
        ],
      },
    };
    const v = validateState(state, fields);
    expect(v.root.conditions).toHaveLength(1);
    expect((v.root.conditions[0] as { op: string }).op).toBe('gt');
  });

  it('rejects between without 2-element array', () => {
    const state: FilterState = {
      root: {
        id: 'r',
        combinator: 'AND',
        conditions: [{ id: '1', field: 'age', op: 'between', value: 5 }],
      },
    };
    expect(validateState(state, fields).root.conditions).toHaveLength(0);
  });

  it(`flattens groups deeper than depth ${MAX_NESTING_DEPTH}`, () => {
    const state: FilterState = {
      root: {
        id: 'r',
        combinator: 'AND',
        conditions: [
          {
            id: 'g1',
            combinator: 'OR',
            conditions: [
              {
                id: 'g2',
                combinator: 'AND',
                conditions: [{ id: 'c', field: 'name', op: 'eq', value: 'a' }],
              },
            ],
          },
        ],
      },
    };
    const v = validateState(state, fields);
    const inner = v.root.conditions[0] as { conditions: unknown[] };
    expect(inner.conditions).toHaveLength(1);
    expect((inner.conditions[0] as { field?: string }).field).toBe('name');
  });

  it('returns empty root for null state', () => {
    const v = validateState(null as unknown as FilterState, fields);
    expect(v.root.conditions).toHaveLength(0);
  });
});

describe('helpers', () => {
  it('isStateEmpty', () => {
    expect(isStateEmpty(null)).toBe(true);
    expect(isStateEmpty({ root: { id: 'r', combinator: 'AND', conditions: [] } })).toBe(true);
    expect(
      isStateEmpty({
        root: {
          id: 'r',
          combinator: 'AND',
          conditions: [{ id: '1', field: 'name', op: 'eq', value: 'a' }],
        },
      }),
    ).toBe(false);
  });

  it('countActiveConditions walks nested groups', () => {
    const s: FilterState = {
      root: {
        id: 'r',
        combinator: 'AND',
        conditions: [
          { id: '1', field: 'name', op: 'eq', value: 'a' },
          {
            id: 'g',
            combinator: 'OR',
            conditions: [
              { id: '2', field: 'name', op: 'eq', value: 'b' },
              { id: '3', field: 'age', op: 'gt', value: 1 },
            ],
          },
        ],
      },
    };
    expect(countActiveConditions(s)).toBe(3);
  });
});
