import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef } from 'react';

export type ImageListProps = ComponentPropsWithoutRef<'div'> & {
  cols?: number;
  gap?: number;
};

export function ImageList({ className, cols = 3, gap = 8, style, ...props }: ImageListProps) {
  return (
    <div
      {...props}
      className={cn('grid min-w-0', className)}
      style={{
        gap,
        gridTemplateColumns: `repeat(${String(cols)}, minmax(0, 1fr))`,
        ...style,
      }}
    />
  );
}

export type ImageListItemProps = ComponentPropsWithoutRef<'figure'> & {
  caption?: string;
};

export function ImageListItem({ caption, children, className, ...props }: ImageListItemProps) {
  return (
    <figure
      {...props}
      className={cn(
        'group min-w-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)]',
        className,
      )}
    >
      {children}
      {caption ? (
        <figcaption className="border-t border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-fg-muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
