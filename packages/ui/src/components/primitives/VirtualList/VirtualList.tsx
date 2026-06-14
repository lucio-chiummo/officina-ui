import { cn } from '@lib/utils/cn';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, type ReactNode } from 'react';

export interface VirtualListProps<T> {
  /** Items to virtualize; only the visible window is rendered. */
  items: T[];
  /** Estimated row height in px, used before measurement. Defaults to `44`. */
  estimateSize?: number;
  /** Height of the scroll viewport (px or CSS length). */
  height?: number | string;
  /** Renders a single item for the given index. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Extra classes for the scroll container. */
  className?: string;
}

export function VirtualList<T>({
  items,
  estimateSize = 44,
  height = 360,
  renderItem,
  className,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
  });

  return (
    <div
      ref={parentRef}
      className={cn(
        'overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)]',
        className,
      )}
      style={{ height }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${row.start}px)`,
            }}
          >
            {renderItem(items[row.index]!, row.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
