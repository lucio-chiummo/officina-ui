import { describe, expect, it } from 'vitest';

import type { FilterState } from './types';

import { fromUrl, toUrl } from './serialize';

const sample: FilterState = {
  root: {
    id: 'root',
    combinator: 'AND',
    conditions: [
      { id: 'c1', field: 'name', op: 'contains', value: 'al' },
      { id: 'c2', field: 'age', op: 'between', value: [20, 40] },
      {
        id: 'g1',
        combinator: 'OR',
        conditions: [
          { id: 'c3', field: 'plan', op: 'in', value: ['pro', 'enterprise'] },
          { id: 'c4', field: 'active', op: 'is', value: true },
        ],
      },
    ],
  },
};

describe('serialize', () => {
  it('empty state encodes to empty string', () => {
    expect(toUrl({ root: { id: 'r', combinator: 'AND', conditions: [] } })).toBe('');
  });

  it('round-trips a complex state', () => {
    const encoded = toUrl(sample);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');
    const decoded = fromUrl(encoded);
    expect(decoded).toEqual(sample);
  });

  it('rejects malformed payloads', () => {
    expect(fromUrl('not-base64-#$@')).toBeNull();
    expect(fromUrl('')).toBeNull();
  });

  it('rejects wrong version', () => {
    const bad = Buffer.from(JSON.stringify({ _v: 'v0', r: { c: 'AND', x: [] } }))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
    expect(fromUrl(bad)).toBeNull();
  });

  it('round-trips 20 generated states', () => {
    const ops = ['eq', 'contains', 'gt', 'in'] as const;
    for (let i = 0; i < 20; i++) {
      const state: FilterState = {
        root: {
          id: `r${i}`,
          combinator: i % 2 === 0 ? 'AND' : 'OR',
          conditions: Array.from({ length: (i % 4) + 1 }, (_, j) => ({
            id: `c${i}-${j}`,
            field: `field${j}`,
            op: ops[j % ops.length]!,
            value: j % 2 === 0 ? `v${i}-${j}` : [j, j + 1],
          })),
        },
      };
      expect(fromUrl(toUrl(state))).toEqual(state);
    }
  });
});
