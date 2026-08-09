import { cn } from '@lib/utils/cn';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      data-density-control="textarea"
      {...props}
      className={cn(
        'block min-h-[80px] w-full rounded-md border border-[var(--color-border-strong)]',
        'bg-[var(--color-bg-base)] text-sm text-[var(--color-fg-base)]',
        'resize-vertical px-3 py-2',
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
