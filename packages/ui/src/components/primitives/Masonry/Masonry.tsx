import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef } from 'react';

export type MasonryProps = ComponentPropsWithoutRef<'div'> & {
  columns?: number;
  gap?: number;
};

export function Masonry({
  children,
  className,
  columns = 3,
  gap = 12,
  style,
  ...props
}: MasonryProps) {
  return (
    <div
      {...props}
      className={cn('min-w-0', className)}
      style={{ columnCount: columns, columnGap: gap, ...style }}
    >
      {children}
    </div>
  );
}

export function MasonryItem({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('mb-3 break-inside-avoid', className)} />;
}
