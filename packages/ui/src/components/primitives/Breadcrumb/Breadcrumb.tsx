import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = { label: string; href?: string };

export type BreadcrumbProps = {
  /** Trail entries from root to current page. */
  items: BreadcrumbItem[];
  /** Custom separator between items. Defaults to a chevron. */
  separator?: ReactNode;
  className?: string;
};

export function Breadcrumb({
  items,
  separator = <ChevronRight className="size-3" />,
  className,
}: BreadcrumbProps) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-[var(--color-fg-subtle)]">
        {items.map((item, index) => (
          <li key={`${item.label}-${String(index)}`} className="flex items-center gap-1">
            {index > 0 ? <span aria-hidden="true">{separator}</span> : null}
            {item.href ? (
              <a
                href={item.href}
                className={cn(
                  'hover:text-[var(--color-fg-base)]',
                  index === items.length - 1 && 'font-medium text-[var(--color-fg-base)]',
                )}
              >
                {item.label}
              </a>
            ) : (
              <span
                aria-current={index === items.length - 1 ? 'page' : undefined}
                className={
                  index === items.length - 1 ? 'font-medium text-[var(--color-fg-base)]' : undefined
                }
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
