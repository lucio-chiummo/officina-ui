import { useCallback, useState } from 'react';

export function useSessionStorage<T>(key: string, defaultValue: T) {
  const [value, setValueState] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          sessionStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          return resolved;
        }
        return resolved;
      });
    },
    [key],
  );

  const remove = useCallback(() => {
    sessionStorage.removeItem(key);
    setValueState(defaultValue);
  }, [key, defaultValue]);

  return [value, setValue, remove] as const;
}
