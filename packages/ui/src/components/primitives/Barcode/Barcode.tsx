import { cn } from '@lib/utils/cn';

export interface BarcodeProps {
  /** Value encoded as a barcode. */
  value: string;
  /** Bar height in pixels. */
  height?: number;
  className?: string;
}

export function Barcode({ value, height = 72, className }: BarcodeProps) {
  const bits = Array.from(value).flatMap((char) =>
    char.charCodeAt(0).toString(2).padStart(8, '0').split(''),
  );
  const bars: Array<{ x: number }> = [];
  for (let x = 0; x < bits.length; x += 1) {
    if (bits[x] === '1') bars.push({ x: x * 2 });
  }
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3',
        className,
      )}
    >
      <svg
        role="img"
        aria-label={`Barcode ${value}`}
        height={height}
        width={Math.max(bits.length * 2, 120)}
      >
        {bars.map((bar) => (
          <rect
            key={`${value}-${bar.x}`}
            x={bar.x}
            y={0}
            width={1.5}
            height={height}
            fill="black"
          />
        ))}
      </svg>
      <span className="font-mono text-xs text-black">{value}</span>
    </div>
  );
}
