import { useCallback, useEffect, useRef } from 'react';

export function useTimeout(callback: () => void, delay: number | null) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const idRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (idRef.current !== null) clearTimeout(idRef.current);
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay !== null) {
      idRef.current = setTimeout(() => callbackRef.current(), delay);
    }
  }, [delay, clear]);

  useEffect(() => {
    reset();
    return clear;
  }, [delay, reset, clear]);

  return { clear, reset };
}
