import { cn } from '@lib/utils/cn';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type ScrollSpyItem = {
  id: string;
  label: ReactNode;
};

export type ScrollSpyProps = {
  items: ScrollSpyItem[];
  /** Root margin handed to IntersectionObserver — tune when a section counts as active. */
  rootMargin?: string;
  /** Scroll container element id — defaults to the viewport. */
  containerId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
};

export function useScrollSpy(
  ids: string[],
  options?: { rootMargin?: string; containerId?: string },
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join(',');

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter((el) => el !== null);
    if (targets.length === 0) return undefined;

    const root = options?.containerId ? document.getElementById(options.containerId) : null;
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        let best: string | null = null;
        for (const id of ids) {
          if (visible.has(id)) {
            best = id;
            break;
          }
        }
        if (best) setActiveId(best);
      },
      {
        root,
        rootMargin: options?.rootMargin ?? '0px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const target of targets) observer.observe(target);
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- idsKey is the stable identity of ids
  }, [idsKey, options?.rootMargin, options?.containerId]);

  return activeId;
}

export function ScrollSpy({
  items,
  rootMargin,
  containerId,
  onActiveChange,
  className,
}: ScrollSpyProps) {
  const activeId = useScrollSpy(
    items.map((i) => i.id),
    {
      ...(rootMargin !== undefined ? { rootMargin } : {}),
      ...(containerId !== undefined ? { containerId } : {}),
    },
  );
  const lastNotified = useRef<string | null>(null);

  useEffect(() => {
    if (activeId && activeId !== lastNotified.current) {
      lastNotified.current = activeId;
      onActiveChange?.(activeId);
    }
  }, [activeId, onActiveChange]);

  return (
    <nav aria-label="Page sections" className={cn('text-sm', className)}>
      <ul className="space-y-0.5 border-l border-[var(--color-border)]">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  '-ml-px block border-l-2 py-1 pl-3 transition-colors duration-[var(--motion-fast)]',
                  isActive
                    ? 'border-[var(--color-accent)] font-medium text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg-base)]',
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
