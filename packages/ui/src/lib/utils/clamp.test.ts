import { describe, expect, it } from 'vitest';

import { clamp } from './clamp';

describe('clamp', () => {
  it('returns the value when within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to the lower bound', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to the upper bound', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('defaults to no bound when min/max are omitted', () => {
    expect(clamp(5)).toBe(5);
    expect(clamp(-1000)).toBe(-1000);
    expect(clamp(1000)).toBe(1000);
  });
});
