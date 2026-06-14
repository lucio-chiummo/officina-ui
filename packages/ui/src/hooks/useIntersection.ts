import { type RefObject, useEffect, useMemo, useState } from 'react';

export function useIntersection<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options?: IntersectionObserverInit,
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => {
      if (e) setEntry(e);
    }, observerOptions);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, observerOptions]);

  return entry;
}
