import { cn } from '@lib/utils/cn';
import { useId } from 'react';

export type SparklineProps = {
  /** Series values to plot. */
  data: number[];
  /** Render as a line or as bars. */
  variant?: 'line' | 'bars';
  /** Width in pixels. */
  width?: number;
  /** Height in pixels. */
  height?: number;
  /** Stroke/bar colour. */
  color?: string;
  /** Fill the area under a line sparkline. */
  fill?: boolean;
  /** Accessible description of the trend. */
  'aria-label'?: string;
  className?: string;
};

function linePath(data: number[], width: number, height: number, pad = 2): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = (width - pad * 2) / Math.max(data.length - 1, 1);
  return data
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (1 - (v - min) / span) * (height - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function Sparkline({
  data,
  variant = 'line',
  width = 120,
  height = 32,
  color = 'var(--color-accent)',
  fill = false,
  'aria-label': ariaLabel,
  className,
}: SparklineProps) {
  const gradientId = useId();

  if (data.length === 0) return null;

  if (variant === 'bars') {
    const max = Math.max(...data);
    return (
      <div
        className={cn('flex items-end gap-0.5', className)}
        style={{ width, height }}
        role="img"
        aria-label={ariaLabel ?? 'Trend sparkline'}
      >
        {data.map((v, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key -- static series, order is identity
            key={i}
            className="min-w-[3px] flex-1 rounded-sm"
            style={{
              height: `${Math.max(Math.round((v / (max || 1)) * 100), 4)}%`,
              background: v === max ? color : `color-mix(in srgb, ${color} 35%, transparent)`,
            }}
          />
        ))}
      </div>
    );
  }

  const d = linePath(data, width, height);
  const areaD = `${d} L${width - 2},${height - 2} L2,${height - 2} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? 'Trend sparkline'}
      className={className}
    >
      {fill ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradientId})`} stroke="none" />
        </>
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
