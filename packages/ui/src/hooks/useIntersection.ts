import { type RefObject, useEffect, useRef, useState } from 'react';

export function useIntersection<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options?: IntersectionObserverInit,
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  // Same trap as useEventListener: an inline options object made the memo a
  // no-op, so the observer was disconnected and rebuilt every render — and each
  // rebuild re-reports the target, firing consumers repeatedly.
  const { root, rootMargin } = options ?? {};
  const thresholdKey = JSON.stringify(options?.threshold ?? null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => {
      if (e) setEntry(e);
    }, optionsRef.current);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, root, rootMargin, thresholdKey]);

  return entry;
}
