import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy entries', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b');
  });

  it('respects conditional objects from clsx', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b');
  });

  it('merges conflicting Tailwind utilities (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm text-red-500', 'text-lg')).toBe('text-red-500 text-lg');
  });
});
