import { type RefObject, useEffect } from 'react';

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: (entry: ResizeObserverEntry) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) callback(entry);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, callback]);
}
