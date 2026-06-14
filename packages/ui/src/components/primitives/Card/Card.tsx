import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef } from 'react';

export type CardProps = ComponentPropsWithoutRef<'div'> & {
  /** Inner padding scale. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ className, padding = 'md', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow-[var(--shadow-sm)]',
        'transition-[border-color,box-shadow,background-color] duration-[var(--motion-base)] ease-[var(--ease-standard)]',
        paddingMap[padding],
        className,
      )}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props} className={cn('flex items-center justify-between gap-3 pb-4', className)} />
  );
}

export function CardTitle({ children, className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      {...props}
      className={cn('text-sm font-semibold tracking-tight text-[var(--color-fg-base)]', className)}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p {...props} className={cn('text-xs text-[var(--color-fg-subtle)]', className)} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('', className)} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4',
        className,
      )}
    />
  );
}
