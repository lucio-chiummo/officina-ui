import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef } from 'react';

export type SeparatorProps = ComponentPropsWithoutRef<'div'> & {
  /** Divider axis. Defaults to horizontal. */
  orientation?: 'horizontal' | 'vertical';
  /** Optional centered label rendered within the divider. */
  label?: string;
};

export function Separator({
  className,
  orientation = 'horizontal',
  label,
  ...props
}: SeparatorProps) {
  if (label) {
    return (
      <div role="separator" className={cn('flex items-center gap-3', className)} {...props}>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs font-medium text-[var(--color-fg-subtle)]">{label}</span>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      {...props}
      className={cn(
        'shrink-0 bg-[var(--color-border)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
