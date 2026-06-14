import { useCallback, useEffect, useRef } from 'react';

const IDLE_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;

interface UseIdleTimeoutOptions {
  timeout: number;
  onIdle: () => void;
  onActive?: () => void;
}

export function useIdleTimeout({ timeout, onIdle, onActive }: UseIdleTimeoutOptions) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);
  const onActiveRef = useRef(onActive);
  onIdleRef.current = onIdle;
  onActiveRef.current = onActive;

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    onActiveRef.current?.();
    timer.current = setTimeout(() => onIdleRef.current(), timeout);
  }, [timeout]);

  useEffect(() => {
    reset();
    IDLE_EVENTS.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      IDLE_EVENTS.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [reset]);
}
