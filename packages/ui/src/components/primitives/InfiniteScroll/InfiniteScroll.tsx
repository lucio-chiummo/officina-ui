import { cn } from '@lib/utils/cn';
import { useEffect, useRef, type ReactNode } from 'react';

export interface InfiniteScrollProps {
  /** Whether more items remain to load. */
  hasMore: boolean;
  /** True while a load is in flight — suppresses duplicate `onLoadMore` calls. */
  isLoading?: boolean;
  /** Called when the sentinel scrolls into view and more items are available. */
  onLoadMore: () => void;
  /** The already-loaded content. */
  children: ReactNode;
  /** Node shown while loading the next page. */
  loader?: ReactNode;
  /** Node shown once all items are loaded. */
  end?: ReactNode;
  /** Extra classes for the scroll container. */
  className?: string;
}

export function InfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  children,
  loader = 'Loading...',
  end,
  className,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasMore && !isLoading) onLoadMore();
      },
      { rootMargin: '240px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className={cn('space-y-3', className)}>
      {children}
      <div ref={sentinelRef} />
      {isLoading ? (
        <div className="py-3 text-center text-sm text-[var(--color-fg-muted)]">{loader}</div>
      ) : null}
      {!hasMore && end ? (
        <div className="py-3 text-center text-sm text-[var(--color-fg-subtle)]">{end}</div>
      ) : null}
    </div>
  );
}
