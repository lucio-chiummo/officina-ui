import { describe, expect, it } from 'vitest';

import type { FilterFieldDef, FilterState } from './types';

import { toQueryParams } from './server-query';

const fields: FilterFieldDef[] = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'plan', label: 'Plan', type: 'enum' },
];

const state: FilterState = {
  root: {
    id: 'root',
    combinator: 'AND',
    conditions: [
      { id: '1', field: 'name', op: 'contains', value: 'al' },
      { id: '2', field: 'age', op: 'between', value: [20, 40] },
      { id: '3', field: 'plan', op: 'in', value: ['pro', 'enterprise'] },
    ],
  },
};

describe('toQueryParams', () => {
  it('rest dialect emits field__op pairs', () => {
    const params = toQueryParams(state, fields, 'rest');
    expect(params.get('name__contains')).toBe('al');
    expect(params.get('age__between')).toBe('20,40');
    expect(params.get('plan__in')).toBe('pro,enterprise');
  });

  it('rsql dialect emits single filter param', () => {
    const params = toQueryParams(state, fields, 'rsql');
    const filter = params.get('filter');
    expect(filter).toContain('name=like="al"');
    expect(filter).toContain('age=between=(20,40)');
    expect(filter).toContain('plan=in=("pro","enterprise")');
    expect(filter).toContain(';');
  });

  it('rsql dialect preserves nested group precedence', () => {
    const nestedState: FilterState = {
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
              { id: '3', field: 'name', op: 'contains', value: 'al' },
            ],
          },
        ],
      },
    };
    const params = toQueryParams(nestedState, fields, 'rsql');
    expect(params.get('filter')).toBe('plan=="pro";(age=lt=30,name=like="al")');
  });

  it('graphql-where dialect emits nested JSON', () => {
    const params = toQueryParams(state, fields, 'graphql-where');
    const where = JSON.parse(params.get('where') ?? '{}') as { _and: unknown[] };
    expect(where._and).toHaveLength(3);
  });

  it('empty state returns empty params', () => {
    const params = toQueryParams(
      { root: { id: 'r', combinator: 'AND', conditions: [] } },
      fields,
      'rest',
    );
    expect([...params.keys()]).toHaveLength(0);
  });

  it('OR combinator marks rest with _combinator=or', () => {
    const orState: FilterState = {
      root: {
        id: 'r',
        combinator: 'OR',
        conditions: [{ id: '1', field: 'name', op: 'eq', value: 'a' }],
      },
    };
    const params = toQueryParams(orState, fields, 'rest');
    expect(params.get('_combinator')).toBe('or');
  });
});
