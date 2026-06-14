import { cn } from '@lib/utils/cn';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

export type ListProps = ComponentPropsWithoutRef<'ul'> & {
  dense?: boolean;
  variant?: 'plain' | 'outlined' | 'soft';
};

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { className, dense, variant = 'plain', ...props },
  ref,
) {
  return (
    <ul
      ref={ref}
      {...props}
      className={cn(
        'min-w-0 list-none space-y-1 p-0',
        dense && 'space-y-0.5',
        variant === 'outlined' &&
          'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-1',
        variant === 'soft' && 'rounded-lg bg-[var(--color-bg-muted)] p-1',
        className,
      )}
    />
  );
});

export function ListItem({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return <li {...props} className={cn('min-w-0 rounded-md', className)} />;
}

export type ListItemButtonProps = ComponentPropsWithoutRef<'button'> & {
  selected?: boolean;
};

export const ListItemButton = forwardRef<HTMLButtonElement, ListItemButtonProps>(
  function ListItemButton({ className, selected, type = 'button', ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        {...props}
        className={cn(
          'flex w-full min-w-0 items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none',
          selected
            ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent-fg)]'
            : 'text-[var(--color-fg-base)] hover:bg-[var(--color-bg-muted)]',
          className,
        )}
      />
    );
  },
);

export function ListItemDecorator({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)]',
        className,
      )}
    />
  );
}

export function ListItemContent({
  children,
  className,
  description,
  title,
  ...props
}: ComponentPropsWithoutRef<'div'> & {
  description?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <div {...props} className={cn('min-w-0 flex-1', className)}>
      {title ? (
        <div className="truncate text-sm font-medium text-[var(--color-fg-base)]">{title}</div>
      ) : null}
      {description ? (
        <div className="truncate text-xs text-[var(--color-fg-muted)]">{description}</div>
      ) : null}
      {children}
    </div>
  );
}

export function ListDivider({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      role="separator"
      {...props}
      className={cn('my-1 h-px bg-[var(--color-border)]', className)}
    />
  );
}

export function ListSubheader({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      {...props}
      className={cn(
        'px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[var(--color-fg-subtle)] uppercase',
        className,
      )}
    />
  );
}
