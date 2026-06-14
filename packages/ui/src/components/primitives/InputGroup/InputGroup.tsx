import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from 'react';

export type InputGroupProps = ComponentPropsWithoutRef<'div'> & {
  /** Leading addon rendered before the input (icon, label, unit). */
  prefix?: ReactNode;
  /** Trailing addon rendered after the input. */
  suffix?: ReactNode;
};

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { prefix, suffix, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        'flex min-h-9 items-stretch overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] text-sm focus-within:ring-2 focus-within:ring-[var(--color-accent)]',
        className,
      )}
    >
      {prefix ? (
        <span className="flex items-center border-r border-[var(--color-border)] bg-[var(--color-bg-muted)] px-3 text-[var(--color-fg-muted)]">
          {prefix}
        </span>
      ) : null}
      <div className="min-w-0 flex-1 [&_input]:h-full [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-3 [&_input]:outline-none">
        {children}
      </div>
      {suffix ? (
        <span className="flex items-center border-l border-[var(--color-border)] bg-[var(--color-bg-muted)] px-3 text-[var(--color-fg-muted)]">
          {suffix}
        </span>
      ) : null}
    </div>
  );
});
