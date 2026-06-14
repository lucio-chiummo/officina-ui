import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

export type DescriptionItem = {
  term: string;
  detail?: ReactNode;
  description?: ReactNode;
};

export type DescriptionListProps = ComponentPropsWithoutRef<'dl'> & {
  /** Term/description pairs to render. */
  items: DescriptionItem[];
  /** `stacked` puts the term above the value; `inline` puts them side by side. */
  layout?: 'stacked' | 'inline';
};

export function DescriptionList({
  items,
  layout = 'inline',
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl {...props} className={cn('border-t border-[var(--color-border)]', className)}>
      {items.map((item) => (
        <div
          key={item.term}
          className={cn(
            'border-b border-[var(--color-border)] py-2.5',
            layout === 'inline' ? 'flex gap-4' : 'flex flex-col gap-1',
          )}
        >
          <dt
            className={cn(
              'text-xs font-medium text-[var(--color-fg-muted)]',
              layout === 'inline' && 'w-36 shrink-0',
            )}
          >
            {item.term}
          </dt>
          <dd className="min-w-0 text-sm font-medium text-[var(--color-fg-base)]">
            {item.detail ?? item.description}
          </dd>
        </div>
      ))}
    </dl>
  );
}
