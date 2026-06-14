import type { ReactNode } from 'react';

import { Bell } from 'lucide-react';

export type NotificationCardProps = {
  /** Notification headline. */
  title: string;
  /** Body text. */
  description?: string;
  /** Leading icon or avatar. */
  icon?: ReactNode;
  /** Trailing metadata such as a timestamp. */
  meta?: ReactNode;
  /** Mark as unread (adds an emphasis indicator). */
  unread?: boolean;
  /** Action controls rendered in the card. */
  actions?: ReactNode;
};

export function NotificationCard({
  title,
  description,
  icon,
  meta,
  unread,
  actions,
}: NotificationCardProps) {
  return (
    <article className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3 transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-xs)]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)]">
        {icon ?? <Bell className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {unread ? <span className="size-2 rounded-full bg-[var(--color-accent)]" /> : null}
          <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--color-fg-base)]">
            {title}
          </h3>
        </div>
        {description ? (
          <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{description}</p>
        ) : null}
        {meta ? <div className="mt-2 text-xs text-[var(--color-fg-subtle)]">{meta}</div> : null}
      </div>
      {actions}
    </article>
  );
}
