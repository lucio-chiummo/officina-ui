import { cn } from '@lib/utils/cn';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type SelectProps = ComponentPropsWithoutRef<'select'>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      data-density-control="input"
      {...props}
      className={cn(
        'block h-9 w-full rounded-md border border-[var(--color-border-strong)]',
        'bg-[var(--color-bg-base)] text-sm text-[var(--color-fg-base)]',
        'appearance-none pl-3 pr-8',
        'transition-[border-color,box-shadow] duration-[var(--duration-fast)]',
        'focus:ring-3 focus:ring-[var(--color-accent)]/15 focus:border-[var(--color-accent)] focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'bg-[length:16px] bg-[right_8px_center] bg-no-repeat',
        className,
      )}
    />
  );
});
