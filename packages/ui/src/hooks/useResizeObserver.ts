import { type RefObject, useEffect, useRef } from 'react';

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: (entry: ResizeObserverEntry) => void,
) {
  // Call sites almost always pass an inline closure. Reading it through a ref
  // keeps the observer alive across renders instead of tearing it down and
  // rebuilding it — a rebuild re-fires the initial observation, which turns a
  // state-setting callback into a render loop.
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) callbackRef.current(entry);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
