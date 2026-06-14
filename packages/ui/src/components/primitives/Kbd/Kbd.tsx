import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef } from 'react';

export type KbdProps = ComponentPropsWithoutRef<'kbd'>;

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        'inline-flex h-[18px] items-center justify-center rounded px-1.5',
        'border border-[var(--color-border)] bg-[var(--color-bg-subtle)]',
        'font-mono text-[10px] font-semibold text-[var(--color-fg-muted)]',
        'shadow-[0_1px_0_var(--color-border)]',
        className,
      )}
    />
  );
}
