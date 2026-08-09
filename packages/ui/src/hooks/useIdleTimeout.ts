import { useCallback, useEffect, useRef } from 'react';

const IDLE_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;

interface UseIdleTimeoutOptions {
  timeout: number;
  onIdle: () => void;
  onActive?: () => void;
}

export function useIdleTimeout({ timeout, onIdle, onActive }: UseIdleTimeoutOptions) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idle = useRef(false);
  const onIdleRef = useRef(onIdle);
  const onActiveRef = useRef(onActive);
  onIdleRef.current = onIdle;
  onActiveRef.current = onActive;

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    // onActive marks the idle -> active transition. Firing it on every mousemove
    // (and once on mount, before any idle period) makes it useless for the
    // "welcome back" work call sites use it for.
    if (idle.current) {
      idle.current = false;
      onActiveRef.current?.();
    }
    timer.current = setTimeout(() => {
      idle.current = true;
      onIdleRef.current();
    }, timeout);
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
