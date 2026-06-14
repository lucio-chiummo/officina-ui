import { cn } from '@lib/utils/cn';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { type ReactNode } from 'react';

export type StatCardProps = {
  /** Metric name shown above the value. */
  label: string;
  /** Primary metric value. */
  value: string | number;
  /** Percentage change; sign drives the up/down colour and arrow. */
  delta?: number;
  /** Caption beside the delta (e.g. "vs last month"). */
  deltaLabel?: string;
  /** Muted helper text under the value. */
  hint?: string;
  /** Leading icon. */
  icon?: ReactNode;
  /** Series rendered as an inline trend sparkline. */
  sparkline?: number[];
  className?: string;
};

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="mt-2 flex h-8 items-end gap-0.5" aria-hidden="true">
      {data.map((v, i) => (
        <div
          key={`${v}-${i > 0 ? data[i - 1] : 'start'}-${i < data.length - 1 ? data[i + 1] : 'end'}`}
          className={cn(
            'w-1.5 rounded-sm transition-[height]',
            v === max ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-accent)]/35',
          )}
          style={{ height: `${Math.round((v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  hint,
  icon,
  sparkline,
  className,
}: StatCardProps) {
  const isUp = delta != null && delta > 0;
  const isDown = delta != null && delta < 0;

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4',
        'shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold tracking-wider text-[var(--color-fg-subtle)] uppercase">
          {label}
        </p>
        {icon && <span className="shrink-0 text-[var(--color-fg-subtle)]">{icon}</span>}
      </div>

      <p className="mt-1 text-[26px] leading-none font-bold tracking-tight text-[var(--color-fg-base)]">
        {value}
      </p>

      {delta != null && (
        <div className="mt-1.5 flex items-center gap-1">
          {isUp && <TrendingUp className="size-3 text-[var(--color-success)]" />}
          {isDown && <TrendingDown className="size-3 text-[var(--color-danger)]" />}
          {!isUp && !isDown && <Minus className="size-3 text-[var(--color-fg-subtle)]" />}
          <span
            className={cn(
              'text-[11px] font-semibold',
              isUp && 'text-[var(--color-success)]',
              isDown && 'text-[var(--color-danger)]',
              !isUp && !isDown && 'text-[var(--color-fg-subtle)]',
            )}
          >
            {isUp ? '+' : ''}
            {delta}%
          </span>
          {deltaLabel && (
            <span className="text-[11px] text-[var(--color-fg-subtle)]">{deltaLabel}</span>
          )}
        </div>
      )}

      {hint && !delta && <p className="mt-1 text-[11px] text-[var(--color-fg-subtle)]">{hint}</p>}

      {sparkline && <Sparkline data={sparkline} />}
    </div>
  );
}
