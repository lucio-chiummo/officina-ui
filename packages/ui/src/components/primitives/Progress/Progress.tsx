import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const trackVariants = cva('w-full rounded-full bg-[var(--color-bg-muted)] overflow-hidden', {
  variants: {
    size: {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: { size: 'md' },
});

const fillVariants = cva('h-full rounded-full transition-[width] duration-[var(--duration-slow)]', {
  variants: {
    variant: {
      accent: 'bg-[var(--color-accent)]',
      success: 'bg-[var(--color-success)]',
      warning: 'bg-[var(--color-warning)]',
      danger: 'bg-[var(--color-danger)]',
    },
  },
  defaultVariants: { variant: 'accent' },
});

export type ProgressProps = VariantProps<typeof trackVariants> &
  VariantProps<typeof fillVariants> & {
    /** Current progress value, from 0 to `max`. */
    value: number;
    /** Maximum value. Defaults to 100. */
    max?: number;
    /** Visible label rendered above the track. */
    label?: string;
    /** Accessible name when no visible `label` is provided. */
    ariaLabel?: string;
    /** Show the numeric percentage beside the label. */
    showValue?: boolean;
    className?: string;
  };

export function Progress({
  value,
  max = 100,
  size,
  variant,
  label,
  ariaLabel,
  showValue,
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-xs font-medium text-[var(--color-fg-muted)]">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-semibold text-[var(--color-fg-base)]">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel ?? label ?? 'Progress'}
        className={trackVariants({ size })}
      >
        <div className={fillVariants({ variant })} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
