import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  threshold?: number;
}

export function useInfiniteScroll<T extends HTMLElement = HTMLElement>({
  onLoadMore,
  hasMore,
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const observer = useRef<IntersectionObserver | null>(null);
  const node = useRef<T | null>(null);

  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  const attach = useCallback(() => {
    observer.current?.disconnect();
    const el = node.current;
    if (!el || !hasMoreRef.current) return;
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasMoreRef.current) onLoadMoreRef.current();
      },
      { threshold },
    );
    observer.current.observe(el);
  }, [threshold]);

  // The ref callback identity must stay stable: React detaches and reattaches a
  // changing ref callback on every render, and each reattach re-observes the
  // sentinel — which fires onLoadMore again while it is still on screen.
  const sentinelRef = useCallback(
    (el: T | null) => {
      node.current = el;
      attach();
    },
    [attach],
  );

  // Reacting to hasMore here rather than inside the ref callback keeps the
  // callback stable while still resuming or stopping observation.
  useEffect(() => {
    attach();
    return () => observer.current?.disconnect();
  }, [attach, hasMore]);

  return sentinelRef;
}
