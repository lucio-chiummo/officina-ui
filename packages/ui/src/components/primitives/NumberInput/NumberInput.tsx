import { clamp } from '@lib/utils/clamp';
import { cn } from '@lib/utils/cn';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef, type FocusEventHandler, type KeyboardEvent } from 'react';

export type NumberInputProps = {
  /** Current value, or null when empty. */
  value: number | null;
  /** Called with the parsed value (null when cleared). */
  onChange: (value: number | null) => void;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Increment/decrement step. Defaults to 1. */
  step?: number;
  /** Number of decimal places to enforce. */
  precision?: number;
  placeholder?: string;
  /** Unit suffix shown inside the field (e.g. "%"). */
  suffix?: string;
  /** Prefix shown inside the field (e.g. "$"). */
  prefix?: string;
  /** Show the stepper +/- buttons. */
  showSteppers?: boolean;
  /** Control size. */
  size?: 'sm' | 'md';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  /** Accessible name when no visible label is present. */
  ariaLabel?: string;
  /** DOM id, e.g. for wiring to a `FormControl` / external `<label>`. */
  id?: string;
  /** Form field name, for native form submission / form libraries. */
  name?: string;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Id(s) of element(s) describing the field (helper/error text). */
  'aria-describedby'?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    onChange,
    min,
    max,
    step = 1,
    precision,
    placeholder,
    suffix,
    prefix,
    showSteppers = true,
    size = 'md',
    disabled,
    required,
    className,
    ariaLabel,
    id,
    name,
    invalid,
    'aria-describedby': ariaDescribedBy,
    onBlur,
    onFocus,
  },
  ref,
) {
  const commit = (next: number | null) =>
    onChange(next === null ? null : Number(clamp(next, min, max).toFixed(precision ?? 10)));
  const bump = (factor: number) => commit((value ?? 0) + step * factor);
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') bump(1);
    if (event.key === 'ArrowDown') bump(-1);
    if (event.key === 'PageUp') bump(10);
    if (event.key === 'PageDown') bump(-10);
    if (event.key === 'Home' && min !== undefined) commit(min);
    if (event.key === 'End' && max !== undefined) commit(max);
  };
  return (
    <div className={cn('relative', className)}>
      {prefix ? (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-fg-subtle)]">
          {prefix}
        </span>
      ) : null}
      <input
        ref={ref}
        id={id}
        name={name}
        type="number"
        role="spinbutton"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value ?? undefined}
        aria-invalid={invalid ? true : undefined}
        aria-required={required ? true : undefined}
        aria-describedby={ariaDescribedBy}
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        data-density-control="input"
        data-density-size={size}
        onKeyDown={keyDown}
        onChange={(event) => commit(event.target.value === '' ? null : Number(event.target.value))}
        onBlur={onBlur}
        onFocus={onFocus}
        className={cn(
          'number-input block w-full appearance-none rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] text-[var(--color-fg-base)] outline-none',
          'focus:ring-3 focus:ring-[var(--color-accent)]/15 focus:border-[var(--color-accent)] disabled:opacity-50',
          'aria-[invalid=true]:focus:ring-[var(--color-danger)]/15 aria-[invalid=true]:border-[var(--color-danger)]',
          size === 'sm' ? 'h-8 px-2 text-xs' : 'h-9 px-3 text-sm',
          prefix && 'pl-7',
          showSteppers ? 'pr-14' : suffix ? 'pr-10' : undefined,
        )}
      />
      {suffix ? (
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-sm text-[var(--color-fg-subtle)]',
            showSteppers ? 'right-10' : 'right-3',
          )}
        >
          {suffix}
        </span>
      ) : null}
      {showSteppers ? (
        <span className="absolute bottom-1 right-1 top-1 flex w-7 flex-col overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          <button
            type="button"
            aria-label="Increment"
            disabled={disabled}
            onClick={() => bump(1)}
            className="flex flex-1 cursor-pointer items-center justify-center text-[var(--color-fg-muted)] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronUp className="size-3" />
          </button>
          <button
            type="button"
            aria-label="Decrement"
            disabled={disabled}
            onClick={() => bump(-1)}
            className="flex flex-1 cursor-pointer items-center justify-center border-t border-[var(--color-border)] text-[var(--color-fg-muted)] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronDown className="size-3" />
          </button>
        </span>
      ) : null}
      <style>{`
        .number-input::-webkit-outer-spin-button,
        .number-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .number-input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
});
