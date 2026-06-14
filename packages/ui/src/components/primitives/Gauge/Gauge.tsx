import { cn } from '@lib/utils/cn';
import { useId } from 'react';

export type GaugeProps = {
  /** Current value to display. */
  value: number;
  /** Lower bound of the scale. Defaults to 0. */
  min?: number;
  /** Upper bound of the scale. Defaults to 100. */
  max?: number;
  /** Caption shown with the value. */
  label?: string;
  /** Visual style: arc (270° dial), semi (180° half circle), linear (horizontal bar). */
  variant?: 'arc' | 'semi' | 'linear';
  /** Diameter (arc/semi) or width (linear) in pixels. */
  size?: number;
  /** Fill colour of the value arc/bar. */
  color?: string;
  /** Colour of the unfilled track. */
  trackColor?: string;
  /** Format the displayed value (e.g. add a unit). */
  formatValue?: (value: number) => string;
  /** Threshold stops — color switches when value crosses. Sorted ascending. */
  thresholds?: { value: number; color: string }[];
  className?: string;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  variant = 'arc',
  size = 160,
  color,
  trackColor = 'var(--color-bg-muted)',
  formatValue,
  thresholds,
  className,
}: GaugeProps) {
  const titleId = useId();
  const clamped = Math.min(Math.max(value, min), max);
  const ratio = (clamped - min) / (max - min || 1);
  const fmt = formatValue ?? ((v: number) => String(Math.round(v)));

  let activeColor = color ?? 'var(--color-accent)';
  if (thresholds) {
    for (const t of thresholds) {
      if (clamped >= t.value) activeColor = t.color;
    }
  }

  if (variant === 'linear') {
    return (
      <div
        className={cn('flex flex-col gap-1.5', className)}
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-labelledby={label ? titleId : undefined}
        aria-label={label ? undefined : 'Gauge'}
      >
        <div className="flex items-baseline justify-between">
          {label ? (
            <span id={titleId} className="text-sm font-medium text-[var(--color-fg-base)]">
              {label}
            </span>
          ) : null}
          <span className="text-sm font-semibold text-[var(--color-fg-base)]">{fmt(clamped)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: trackColor }}>
          <div
            className="h-full rounded-full transition-[width] duration-[var(--motion-slow)] ease-[var(--ease-standard)]"
            style={{ width: `${ratio * 100}%`, background: activeColor }}
          />
        </div>
      </div>
    );
  }

  const isSemi = variant === 'semi';
  const startAngle = isSemi ? -90 : -135;
  const sweep = isSemi ? 180 : 270;
  const endAngle = startAngle + sweep * ratio;
  const strokeWidth = Math.max(Math.round(size * 0.07), 8);
  const r = size / 2 - strokeWidth;
  const cx = size / 2;
  const cy = size / 2;
  const viewHeight = isSemi ? size / 2 + strokeWidth : size;

  return (
    <div
      className={cn('inline-flex flex-col items-center', className)}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-labelledby={label ? titleId : undefined}
      aria-label={label ? undefined : 'Gauge'}
    >
      <svg width={size} height={viewHeight} viewBox={`0 0 ${size} ${viewHeight}`}>
        <path
          d={arcPath(cx, cy, r, startAngle, startAngle + sweep)}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {ratio > 0 ? (
          <path
            d={arcPath(cx, cy, r, startAngle, Math.max(endAngle, startAngle + 0.5))}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-[var(--motion-slow)] ease-[var(--ease-standard)]"
          />
        ) : null}
        <text
          x={cx}
          y={isSemi ? cy - 4 : cy}
          textAnchor="middle"
          dominantBaseline={isSemi ? 'auto' : 'central'}
          className="fill-[var(--color-fg-base)] font-bold"
          style={{ fontSize: size * 0.18 }}
        >
          {fmt(clamped)}
        </text>
        {label && !isSemi ? (
          <text
            x={cx}
            y={cy + size * 0.16}
            textAnchor="middle"
            className="fill-[var(--color-fg-muted)]"
            style={{ fontSize: size * 0.08 }}
            id={titleId}
          >
            {label}
          </text>
        ) : null}
      </svg>
      {label && isSemi ? (
        <span id={titleId} className="mt-1 text-sm text-[var(--color-fg-muted)]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
