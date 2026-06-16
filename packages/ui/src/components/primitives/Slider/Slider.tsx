import { cn } from '@lib/utils/cn';
import * as RadixSlider from '@radix-ui/react-slider';
import { forwardRef, useId, type FocusEventHandler } from 'react';

type SliderValueChange = {
  bivarianceHack(value: number[]): void;
}['bivarianceHack'];

export type SliderProps = {
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
  /** Element id, e.g. for wiring to a `FormControl` / external `<label>`. */
  id?: string;
  /** Form field name, for native form submission / form libraries. */
  name?: string;
  disabled?: boolean;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Id(s) of element(s) describing the field (helper/error text). */
  'aria-describedby'?: string;
  onBlur?: FocusEventHandler<HTMLSpanElement>;
  onFocus?: FocusEventHandler<HTMLSpanElement>;
};

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    value,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    className,
    formatValue,
    id,
    name,
    disabled,
    invalid,
    'aria-describedby': ariaDescribedBy,
    onBlur,
    onFocus,
  },
  ref,
) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const fmt = formatValue ?? ((n: number) => String(n));
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <div className="flex items-baseline justify-between">
          <label htmlFor={sliderId} className="text-sm font-medium text-[var(--color-fg-base)]">
            {label}
          </label>
          <span className="text-xs text-[var(--color-fg-muted)]">{value.map(fmt).join(' – ')}</span>
        </div>
      ) : null}
      <RadixSlider.Root
        ref={ref}
        {...(name !== undefined ? { name } : {})}
        {...(disabled !== undefined ? { disabled } : {})}
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
            id={i === 0 ? sliderId : undefined}
            aria-label={label ? `${label} thumb ${String(i + 1)}` : 'Slider thumb'}
            aria-invalid={invalid ? true : undefined}
            aria-describedby={ariaDescribedBy}
            onBlur={onBlur}
            onFocus={onFocus}
            className={cn(
              'block size-4 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20',
              'aria-[invalid=true]:border-[var(--color-danger)]',
            )}
          />
        ))}
      </RadixSlider.Root>
    </div>
  );
});
