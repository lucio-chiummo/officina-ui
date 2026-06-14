import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
import { Inbox } from 'lucide-react';

export type EmptyStateProps = {
  /** Illustrative leading icon. */
  icon?: ReactNode;
  /** Headline describing the empty condition. */
  title: string;
  /** Supporting text under the title. */
  description?: string;
  /** Primary call-to-action (e.g. a button). */
  action?: ReactNode;
  /** Overall scale of the block. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-base)] text-center',
        size === 'sm' ? 'p-6' : size === 'lg' ? 'p-12' : 'p-8',
        className,
      )}
    >
      <div className="mb-3 flex size-10 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)]">
        {icon ?? <Inbox className="size-5" />}
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-fg-base)]">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-[var(--color-fg-subtle)]">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
