import { cn } from '@lib/utils/cn';
import * as RadixSlider from '@radix-ui/react-slider';
import { useId } from 'react';

type SliderValueChange = {
  bivarianceHack(value: number[]): void;
}['bivarianceHack'];

type SliderProps = {
  /** Current thumb value(s). One entry per thumb. */
  value: number[];
  /** Called with the updated value array as thumbs move. */
  onValueChange: SliderValueChange;
  /** Minimum value. Defaults to 0. */
  min?: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Step increment. Defaults to 1. */
  step?: number;
  /** Visible label above the track. */
  label?: string;
  className?: string;
  /** Format a raw value for display (e.g. add a "$"). */
  formatValue?: (n: number) => string;
};

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className,
  formatValue,
}: SliderProps) {
  const id = useId();
  const fmt = formatValue ?? ((n: number) => String(n));
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <div className="flex items-baseline justify-between">
          <label htmlFor={id} className="text-sm font-medium text-[var(--color-fg-base)]">
            {label}
          </label>
          <span className="text-xs text-[var(--color-fg-muted)]">{value.map(fmt).join(' – ')}</span>
        </div>
      ) : null}
      <RadixSlider.Root
        id={id}
        value={value}
        onValueChange={(next) => onValueChange(next)}
        min={min}
        max={max}
        step={step}
        className="relative flex h-5 w-full touch-none select-none items-center"
      >
        <RadixSlider.Track className="relative h-1 grow rounded-full bg-[var(--color-bg-muted)]">
          <RadixSlider.Range className="absolute h-full rounded-full bg-[var(--color-accent)]" />
        </RadixSlider.Track>
        {value.map((_, i) => (
          <RadixSlider.Thumb
            // eslint-disable-next-line react/no-array-index-key -- thumb count is fixed by parent state
            key={i}
            aria-label={label ? `${label} thumb ${String(i + 1)}` : 'Slider thumb'}
            className="focus-visible:ring-[var(--color-accent)]/20 block size-4 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow focus-visible:outline-none focus-visible:ring-2"
          />
        ))}
      </RadixSlider.Root>
    </div>
  );
}
