import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@lib/utils/cn';

const gridColumns = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  6: 'sm:grid-cols-3 lg:grid-cols-6',
} as const;

export type BentoGridProps = ComponentPropsWithoutRef<'div'> & {
  columns?: keyof typeof gridColumns;
};

/**
 * Asymmetric "bento" grid for premium dashboard and marketing layouts. Cells
 * declare their own span via {@link BentoCard}.
 */
export function BentoGrid({ columns = 3, className, children, ...props }: BentoGridProps) {
  return (
    <div
      {...props}
      className={cn('grid auto-rows-[12rem] grid-cols-1 gap-4', gridColumns[columns], className)}
    >
      {children}
    </div>
  );
}

const colSpan = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
} as const;

const rowSpan = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
} as const;

export type BentoCardProps = ComponentPropsWithoutRef<'div'> & {
  colSpan?: keyof typeof colSpan;
  rowSpan?: keyof typeof rowSpan;
  /** Subtle lift + accent border on hover. */
  interactive?: boolean;
};

export function BentoCard({
  colSpan: col = 1,
  rowSpan: row = 1,
  interactive = true,
  className,
  children,
  ...props
}: BentoCardProps) {
  return (
    <div
      {...props}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-5 shadow-[var(--shadow-xs)]',
        colSpan[col],
        rowSpan[row],
        interactive &&
          'transition-[border-color,box-shadow,transform] duration-[var(--motion-base)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
