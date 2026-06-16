import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  timestamp?: string | undefined;
  tone?: string;
  icon?: ReactNode;
};

type TimelineProps = {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
};

const TONE_DOT: Record<string, string> = {
  neutral: 'bg-[var(--color-fg-subtle)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  error: 'bg-[var(--color-danger)]',
  info: 'bg-[var(--color-accent)]',
};

export function Timeline({ items, orientation = 'vertical', className }: TimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <ol className={cn('flex list-none items-center gap-2 overflow-x-auto', className)}>
        {items.map((item, i) => (
          <li key={item.id} className="flex shrink-0 items-center gap-2">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'size-3 rounded-full',
                  TONE_DOT[item.tone ?? 'neutral'] ?? TONE_DOT.neutral,
                )}
              />
              <span className="mt-1 max-w-[120px] text-center text-xs text-[var(--color-fg-muted)]">
                {item.title}
              </span>
            </div>
            {i < items.length - 1 ? (
              <span aria-hidden="true" className="h-px w-10 bg-[var(--color-bg-muted)]" />
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={cn('relative flex list-none flex-col gap-4 ps-7', className)}>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 start-[11px] w-px bg-[var(--color-bg-muted)]"
      />
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className={cn(
              'absolute -start-[22px] top-1 size-3 rounded-full ring-2 ring-[var(--color-bg-base)]',
              TONE_DOT[item.tone ?? 'neutral'] ?? TONE_DOT.neutral,
            )}
          />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-[var(--color-fg-base)]">{item.title}</span>
              {item.timestamp ? (
                <span className="text-xs text-[var(--color-fg-muted)]">{item.timestamp}</span>
              ) : null}
            </div>
            {item.description ? (
              <p className="mt-0.5 text-sm text-[var(--color-fg-muted)]">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
