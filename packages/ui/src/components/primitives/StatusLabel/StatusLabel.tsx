import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

const dotTone: Record<StatusTone, string> = {
  neutral: 'bg-[var(--color-fg-subtle)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  info: 'bg-[var(--color-info)]',
  accent: 'bg-[var(--color-accent)]',
};

const softTone: Record<StatusTone, string> = {
  neutral: 'bg-[var(--color-bg-muted)] text-[var(--color-fg-base)]',
  success: 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
  warning: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)]',
  danger: 'bg-[var(--color-danger-subtle)] text-[var(--color-danger-fg)]',
  info: 'bg-[var(--color-info-subtle)] text-[var(--color-info-fg)]',
  accent: 'bg-[var(--color-accent-muted)] text-[var(--color-accent-fg)]',
};

export type StatusDotProps = ComponentPropsWithoutRef<'span'> & {
  /** Semantic colour of the dot. */
  tone?: StatusTone;
  /** Animate a pulsing ring to signal a live/active state. */
  pulse?: boolean;
};

export function StatusDot({ tone = 'neutral', pulse, className, ...props }: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex size-2 shrink-0', className)} {...props}>
      {pulse ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inline-flex size-full animate-ping rounded-full opacity-60',
            dotTone[tone],
          )}
        />
      ) : null}
      <span className={cn('relative inline-flex size-2 rounded-full', dotTone[tone])} />
    </span>
  );
}

export type StatusLabelProps = ComponentPropsWithoutRef<'span'> & {
  /** Semantic colour of the label and dot. */
  tone?: StatusTone;
  /** Leading icon; replaces the status dot when set. */
  icon?: ReactNode;
  /** Show a leading status dot. Ignored when `icon` is provided. */
  dot?: boolean;
  /** Animate a pulsing ring on the dot. */
  pulse?: boolean;
  /** `plain` is dot + text on the surface; `soft` wraps it in a tinted pill. */
  variant?: 'plain' | 'soft';
};

/**
 * Generic status text with a leading dot or icon. Tone is token-driven and
 * intentionally domain-neutral — callers supply the label text.
 */
export function StatusLabel({
  tone = 'neutral',
  icon,
  dot = true,
  pulse,
  variant = 'plain',
  className,
  children,
  ...props
}: StatusLabelProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap',
        variant === 'soft'
          ? cn('rounded-full px-2 py-0.5', softTone[tone])
          : 'text-[var(--color-fg-base)]',
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="inline-flex size-3.5 shrink-0 items-center [&>svg]:size-3.5"
        >
          {icon}
        </span>
      ) : dot ? (
        <StatusDot tone={tone} {...(pulse ? { pulse } : {})} />
      ) : null}
      {children}
    </span>
  );
}
