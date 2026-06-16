import { clamp } from '@lib/utils/clamp';
import { useCallback, useState } from 'react';

interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

export function useCounter(initial = 0, options: UseCounterOptions = {}) {
  const { min, max, step = 1 } = options;
  const [count, setCount] = useState(initial);

  const bound = useCallback((v: number) => clamp(v, min, max), [max, min]);

  const increment = useCallback(() => setCount((c) => bound(c + step)), [bound, step]);
  const decrement = useCallback(() => setCount((c) => bound(c - step)), [bound, step]);
  const set = useCallback((v: number) => setCount(bound(v)), [bound]);
  const reset = useCallback(() => setCount(initial), [initial]);

  return { count, increment, decrement, set, reset };
}
