import { cn } from '@lib/utils/cn';
import { Star } from 'lucide-react';

export type RatingProps = {
  /** Current rating value. */
  value: number;
  /** Called with the chosen value; omit for a read-only display. */
  onChange?: (value: number) => void;
  /** Number of stars. Defaults to 5. */
  max?: number;
  /** Selectable granularity: whole or half stars. */
  precision?: 1 | 0.5;
  /** Accessible label for the rating group. */
  label?: string;
  /** Render as a non-interactive display. */
  readOnly?: boolean;
  /** Star size. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const starSize = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
} as const;

export function Rating({
  value,
  onChange,
  max = 5,
  precision = 1,
  label = 'Rating',
  readOnly,
  size = 'md',
  className,
}: RatingProps) {
  const interactive = !readOnly && Boolean(onChange);

  return (
    <div
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-readonly={readOnly || undefined}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(event) => {
        if (!interactive || !onChange) return;
        if (event.key === 'ArrowRight') onChange(Math.min(max, value + precision));
        if (event.key === 'ArrowLeft') onChange(Math.max(0, value - precision));
        if (event.key === 'Home' || event.key === 'Backspace' || event.key === 'Delete')
          onChange(0);
        if (event.key === 'End') onChange(max);
      }}
      className={cn(
        'inline-flex gap-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        className,
      )}
    >
      {Array.from({ length: max }, (_, index) => index + 1).map((star) => {
        const active = value >= star;
        return (
          <button
            key={`star-${String(star)}`}
            type="button"
            disabled={!interactive}
            onClick={() => {
              if (!interactive) return;
              onChange?.(value === star ? 0 : star);
            }}
            className={cn(
              'text-[var(--color-warning)]',
              interactive ? 'cursor-pointer' : 'cursor-default',
            )}
            tabIndex={interactive ? 0 : -1}
          >
            <Star className={starSize[size]} fill={active ? 'currentColor' : 'none'} />
          </button>
        );
      })}
    </div>
  );
}
