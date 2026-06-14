import { cn } from '@lib/utils/cn';
import { Avatar } from '@primitives/Avatar';
import { type ReactNode } from 'react';

export interface ActivityFeedItem {
  id: string;
  actor: string;
  action: ReactNode;
  timestamp: ReactNode;
  target?: ReactNode;
  avatarUrl?: string;
}

export interface ActivityFeedProps {
  /** Feed entries in chronological order. */
  items: ActivityFeedItem[];
  /** Content shown when there are no items. */
  empty?: ReactNode;
  className?: string;
}

export function ActivityFeed({ items, empty = null, className }: ActivityFeedProps) {
  if (items.length === 0)
    return (
      <div className="rounded-lg border border-[var(--color-border)] p-4 text-sm text-[var(--color-fg-muted)]">
        {empty}
      </div>
    );
  return (
    <ol
      className={cn(
        'divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)]',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 p-4">
          <Avatar
            size="sm"
            src={item.avatarUrl}
            initials={item.actor.slice(0, 2).toUpperCase()}
            alt={item.actor}
          />
          <div className="min-w-0 flex-1 text-sm">
            <p className="text-[var(--color-fg-base)]">
              <span className="font-medium">{item.actor}</span> {item.action}
              {item.target ? (
                <span className="text-[var(--color-fg-muted)]"> · {item.target}</span>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">{item.timestamp}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
