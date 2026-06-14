import { useCallback, useState } from 'react';

interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

export function useCounter(initial = 0, options: UseCounterOptions = {}) {
  const { min = -Infinity, max = Infinity, step = 1 } = options;
  const [count, setCount] = useState(initial);

  const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [max, min]);

  const increment = useCallback(() => setCount((c) => clamp(c + step)), [clamp, step]);
  const decrement = useCallback(() => setCount((c) => clamp(c - step)), [clamp, step]);
  const set = useCallback((v: number) => setCount(clamp(v)), [clamp]);
  const reset = useCallback(() => setCount(initial), [initial]);

  return { count, increment, decrement, set, reset };
}
