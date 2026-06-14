import { useCallback, useRef } from 'react';

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

  const sentinelRef = useCallback(
    (node: T | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node || !hasMore) return;
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (entry.isIntersecting) onLoadMore();
        },
        { threshold },
      );
      observer.current.observe(node);
    },
    [hasMore, onLoadMore, threshold],
  );

  return sentinelRef;
}
