import { cn } from '@lib/utils/cn';
import { useId, type ReactNode } from 'react';

import type { StatusTone } from '../StatusLabel';

const fillTone: Record<StatusTone, string> = {
  neutral: 'bg-[var(--color-fg-subtle)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  info: 'bg-[var(--color-info)]',
  accent: 'bg-[var(--color-accent)]',
};

export type MeterSegment = {
  value: number;
  tone?: StatusTone;
  label?: string;
};

export type MeterProps = {
  /** Single-value fill. Ignored when `segments` is provided. */
  value?: number;
  /** Upper bound of the scale. Defaults to 100. */
  max?: number;
  /** Multiple stacked segments (e.g. storage by type). */
  segments?: MeterSegment[];
  /** Visible label above the track. */
  label?: ReactNode;
  /** Right-aligned value caption (e.g. "12 of 25 GB"). */
  valueLabel?: ReactNode;
  /** Semantic colour for the single-value fill. */
  tone?: StatusTone;
  /** Track thickness. */
  size?: 'sm' | 'md';
  /** Render a legend of segment labels below the track. */
  showLegend?: boolean;
  className?: string;
  /** Accessible name when no visible `label` is provided. */
  'aria-label'?: string;
};

/**
 * Usage/quota meter for dashboards — single fill or stacked segments. Uses the
 * native `meter` ARIA role so assistive tech reads progress correctly.
 */
export function Meter({
  value = 0,
  max = 100,
  segments,
  label,
  valueLabel,
  tone = 'accent',
  size = 'md',
  showLegend = false,
  className,
  'aria-label': ariaLabel,
}: MeterProps) {
  const total = segments ? segments.reduce((sum, segment) => sum + segment.value, 0) : value;
  const safeMax = max > 0 ? max : 1;
  const trackHeight = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const labelId = useId();
  const hasVisibleLabel = Boolean(label);
  const fallbackLabel = ariaLabel ?? (typeof valueLabel === 'string' ? valueLabel : undefined);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label || valueLabel ? (
        <div className="flex items-baseline justify-between gap-2 text-sm">
          {label ? (
            <span id={labelId} className="font-medium text-[var(--color-fg-base)]">
              {label}
            </span>
          ) : null}
          {valueLabel ? (
            <span className="text-xs text-[var(--color-fg-muted)]">{valueLabel}</span>
          ) : null}
        </div>
      ) : null}

      <div
        role="meter"
        aria-valuenow={Math.round(total)}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        {...(hasVisibleLabel
          ? { 'aria-labelledby': labelId }
          : fallbackLabel
            ? { 'aria-label': fallbackLabel }
            : {})}
        className={cn(
          'flex w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]',
          trackHeight,
        )}
      >
        {segments ? (
          segments.map((segment, index) => (
            <span
              // eslint-disable-next-line react/no-array-index-key -- segment order is caller-controlled and stable
              key={index}
              className={cn(
                'h-full transition-[width] duration-[var(--motion-base)]',
                fillTone[segment.tone ?? 'accent'],
              )}
              style={{ width: `${Math.min((segment.value / safeMax) * 100, 100)}%` }}
            />
          ))
        ) : (
          <span
            className={cn(
              'h-full rounded-full transition-[width] duration-[var(--motion-base)]',
              fillTone[tone],
            )}
            style={{ width: `${Math.min((value / safeMax) * 100, 100)}%` }}
          />
        )}
      </div>

      {showLegend && segments ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
          {segments.map((segment, index) => (
            <span
              // eslint-disable-next-line react/no-array-index-key -- legend mirrors stable segment order
              key={index}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]"
            >
              <span className={cn('size-2 rounded-full', fillTone[segment.tone ?? 'accent'])} />
              {segment.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
