import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

export type CircularProgressProps = ComponentPropsWithoutRef<'div'> & {
  /** Current progress value, 0 to `max`. */
  value: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Diameter in pixels. */
  size?: number;
  /** Ring stroke width in pixels. */
  thickness?: number;
  /** Accessible label / centre caption. */
  label?: string;
};

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  function CircularProgress(
    { value, max = 100, size = 88, thickness = 8, label, className, ...props },
    ref,
  ) {
    const normalized = Math.max(0, Math.min(value, max));
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (normalized / max) * circumference;

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'relative inline-grid place-items-center text-[var(--color-fg-base)]',
          className,
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={normalized}
        aria-label={label}
      >
        <svg width={size} height={size} aria-hidden="true" className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-bg-muted)"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute text-sm font-semibold">
          {Math.round((normalized / max) * 100)}%
        </span>
      </div>
    );
  },
);
