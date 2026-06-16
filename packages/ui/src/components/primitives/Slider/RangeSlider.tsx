import { cn } from '@lib/utils/cn';
import * as RadixSlider from '@radix-ui/react-slider';
import { forwardRef, useId, type FocusEventHandler } from 'react';

export type RangeSliderProps = {
  /** Current [start, end] values. */
  value: [number, number];
  /** Called with the new [start, end] tuple as either thumb moves. */
  onValueChange: (value: [number, number]) => void;
  /** Lower bound of the track. Defaults to 0. */
  min?: number;
  /** Upper bound of the track. Defaults to 100. */
  max?: number;
  /** Step increment between values. */
  step?: number;
  /** Minimum number of steps to keep between the two thumbs. */
  minStepsBetweenThumbs?: number;
  /** Visible label above the slider. */
  label?: string;
  className?: string;
  /** Format thumb/value captions (e.g. add a unit or currency). */
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

export const RangeSlider = forwardRef<HTMLSpanElement, RangeSliderProps>(function RangeSlider(
  {
    value,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
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
          <span className="text-xs text-[var(--color-fg-muted)]">
            {fmt(value[0])} – {fmt(value[1])}
          </span>
        </div>
      ) : null}
      <RadixSlider.Root
        ref={ref}
        {...(name !== undefined ? { name } : {})}
        {...(disabled !== undefined ? { disabled } : {})}
        value={value}
        onValueChange={(next) => onValueChange([next[0] ?? min, next[1] ?? max])}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        className="relative flex h-5 w-full touch-none select-none items-center"
      >
        <RadixSlider.Track className="relative h-1 grow rounded-full bg-[var(--color-bg-muted)]">
          <RadixSlider.Range className="absolute h-full rounded-full bg-[var(--color-accent)]" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          id={sliderId}
          aria-label={label ? `${label} minimum` : 'Range minimum'}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={ariaDescribedBy}
          onBlur={onBlur}
          onFocus={onFocus}
          className={cn(
            'block size-4 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20',
            'aria-[invalid=true]:border-[var(--color-danger)]',
          )}
        />
        <RadixSlider.Thumb
          aria-label={label ? `${label} maximum` : 'Range maximum'}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={ariaDescribedBy}
          onBlur={onBlur}
          onFocus={onFocus}
          className={cn(
            'block size-4 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20',
            'aria-[invalid=true]:border-[var(--color-danger)]',
          )}
        />
      </RadixSlider.Root>
    </div>
  );
});
