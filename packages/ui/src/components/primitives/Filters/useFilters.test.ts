import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { FilterFieldDef } from '@/lib/filters';

import { useFilters } from './useFilters';

type Row = { name: string; age: number; plan: 'free' | 'pro' };

const fields: FilterFieldDef<Row>[] = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  {
    id: 'plan',
    label: 'Plan',
    type: 'enum',
    options: [
      { label: 'Free', value: 'free' },
      { label: 'Pro', value: 'pro' },
    ],
  },
];

const rows: Row[] = [
  { name: 'Alice', age: 30, plan: 'pro' },
  { name: 'Bob', age: 22, plan: 'free' },
];

describe('useFilters', () => {
  it('starts empty and matches all rows', () => {
    const { result } = renderHook(() => useFilters({ fields, mode: 'client' }));
    expect(result.current.activeCount).toBe(0);
    expect(result.current.filter(rows)).toHaveLength(2);
    expect(result.current.chips).toHaveLength(0);
  });

  it('addCondition adds a default-shaped condition for the field type', () => {
    const { result } = renderHook(() => useFilters({ fields, mode: 'client' }));
    act(() => result.current.addCondition('name'));
    expect(result.current.state.root.conditions).toHaveLength(1);
    expect(result.current.activeCount).toBe(0); // empty string value gets stripped by validate
  });

  it('updateCondition mutates value and predicate refilters', () => {
    const { result } = renderHook(() => useFilters({ fields, mode: 'client' }));
    act(() => result.current.addCondition('name'));
    const id = result.current.state.root.conditions[0]!.id;
    act(() => result.current.updateCondition(id, { value: 'ali' }));
    expect(result.current.filter(rows).map((r) => r.name)).toEqual(['Alice']);
    expect(result.current.activeCount).toBe(1);
    expect(result.current.chips[0]?.label).toContain('Name');
  });

  it('chips remove dispatches removeCondition', () => {
    const { result } = renderHook(() => useFilters({ fields, mode: 'client' }));
    act(() => result.current.addCondition('plan'));
    const id = result.current.state.root.conditions[0]!.id;
    act(() => result.current.updateCondition(id, { value: ['pro'] }));
    expect(result.current.chips).toHaveLength(1);
    act(() => result.current.chips[0]!.onRemove());
    expect(result.current.activeCount).toBe(0);
  });

  it('clear empties state', () => {
    const { result } = renderHook(() => useFilters({ fields, mode: 'client' }));
    act(() => result.current.addCondition('name'));
    act(() => result.current.clear());
    expect(result.current.state.root.conditions).toHaveLength(0);
  });

  it('server mode emits queryParams', () => {
    const { result } = renderHook(() => useFilters({ fields, mode: 'server', dialect: 'rest' }));
    act(() => result.current.addCondition('name'));
    const id = result.current.state.root.conditions[0]!.id;
    act(() => result.current.updateCondition(id, { value: 'foo' }));
    expect(result.current.queryParams.get('name__contains')).toBe('foo');
    expect(result.current.queryString).toContain('name__contains=foo');
  });

  it('client mode does not populate queryParams', () => {
    const { result } = renderHook(() => useFilters({ fields, mode: 'client' }));
    act(() => result.current.addCondition('name'));
    expect([...result.current.queryParams.keys()]).toHaveLength(0);
  });
});
