import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef } from 'react';

const positions = {
  fixed: 'fixed inset-x-0 top-0 z-40',
  sticky: 'sticky top-0 z-30',
  static: 'relative',
} as const;

const tones = {
  base: 'border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-fg-base)]',
  subtle:
    'border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-base)]',
  accent:
    'border-[var(--color-accent-hover)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]',
} as const;

export type AppBarProps = ComponentPropsWithoutRef<'header'> & {
  /** CSS positioning (e.g. static, sticky, fixed). */
  position?: keyof typeof positions;
  /** Background/foreground colour scheme. */
  tone?: keyof typeof tones;
};

export function AppBar({ className, position = 'static', tone = 'base', ...props }: AppBarProps) {
  return (
    <header
      {...props}
      className={cn(
        'flex min-h-14 min-w-0 items-center gap-3 border-b px-4 shadow-[var(--shadow-xs)]',
        positions[position],
        tones[tone],
        className,
      )}
    />
  );
}

export function AppBarTitle({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('min-w-0 flex-1 truncate text-sm font-semibold tracking-tight', className)}
    />
  );
}

export function AppBarSection({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('flex shrink-0 items-center gap-2', className)} />;
}
