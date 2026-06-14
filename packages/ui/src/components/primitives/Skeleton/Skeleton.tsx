import { cn } from '@lib/utils/cn';
import { forwardRef, type HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Shape of the placeholder. */
  variant?: 'rect' | 'circle' | 'text';
  /** Explicit width (px number or CSS length). */
  width?: number | string;
  /** Explicit height (px number or CSS length). */
  height?: number | string;
  /** Number of text lines to render for the `text` variant. */
  lines?: number;
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'rect', width, height, lines = 1, className, style, ...props },
  ref,
) {
  if (variant === 'text' && lines > 1) {
    return (
      <div ref={ref} className={cn('space-y-2', className)} style={style} {...props}>
        {Array.from({ length: lines }, (_, index) => index + 1).map((lineNumber) => (
          <span
            key={`line-${String(lineNumber)}`}
            className="block h-3 animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-bg-muted)] motion-reduce:animate-none"
            style={{ width: lineNumber === lines ? '70%' : width }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-[var(--color-bg-muted)] motion-reduce:animate-none',
        variant === 'circle' ? 'rounded-[var(--radius-full)]' : 'rounded-[var(--radius-md)]',
        variant === 'text' && 'h-3',
        className,
      )}
      style={{ width, height: height ?? (variant === 'circle' ? width : undefined), ...style }}
      {...props}
    />
  );
});
