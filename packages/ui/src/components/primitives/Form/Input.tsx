import { cn } from '@lib/utils/cn';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type InputProps = ComponentPropsWithoutRef<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      data-density-control="input"
      {...props}
      className={cn(
        'block h-9 w-full rounded-md border border-[var(--color-border-strong)]',
        'bg-[var(--color-bg-base)] px-3 text-sm text-[var(--color-fg-base)]',
        'placeholder:text-[var(--color-fg-subtle)]',
        'transition-[border-color,box-shadow] duration-[var(--duration-fast)]',
        'focus:ring-3 focus:ring-[var(--color-accent)]/15 focus:border-[var(--color-accent)] focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:focus:ring-[var(--color-danger)]/15 aria-[invalid=true]:border-[var(--color-danger)]',
        className,
      )}
    />
  );
});
