import { cn } from '@lib/utils/cn';
import { Check } from 'lucide-react';

export type Swatch = { value: string; label?: string };

export type SwatchPickerProps = {
  /** Selectable swatches — hex strings or `{ value, label }` objects. */
  swatches: Array<string | Swatch>;
  /** Currently selected swatch value (controlled). */
  value: string;
  /** Called with the newly selected swatch value. */
  onChange: (value: string) => void;
  /** Swatch size. Defaults to `'md'`. */
  size?: 'sm' | 'md';
  /** Append a native color input for arbitrary values. */
  allowCustom?: boolean;
  /** Extra classes for the picker container. */
  className?: string;
  /** Accessible label for the swatch group. */
  'aria-label'?: string;
};

function normalize(swatch: string | Swatch): Swatch {
  return typeof swatch === 'string' ? { value: swatch } : swatch;
}

/**
 * Controlled color/accent preset selector. Domain-neutral — the app wires
 * `value`/`onChange` to its own theme state (e.g. brand accent color).
 */
export function SwatchPicker({
  swatches,
  value,
  onChange,
  size = 'md',
  allowCustom = false,
  className,
  'aria-label': ariaLabel = 'Color',
}: SwatchPickerProps) {
  const dot = size === 'sm' ? 'size-6' : 'size-8';
  const normalized = value.toLowerCase();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {swatches.map((entry) => {
        const swatch = normalize(entry);
        const selected = swatch.value.toLowerCase() === normalized;
        return (
          <button
            key={swatch.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={swatch.label ?? swatch.value}
            title={swatch.label ?? swatch.value}
            onClick={() => onChange(swatch.value)}
            style={{ backgroundColor: swatch.value }}
            className={cn(
              dot,
              'relative inline-flex items-center justify-center rounded-full transition-transform',
              'focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)] focus-visible:outline-none',
              selected
                ? 'ring-2 ring-[var(--color-fg-base)] ring-offset-2 ring-offset-[var(--color-bg-base)]'
                : 'hover:scale-110',
            )}
          >
            {selected ? (
              <Check className="size-3.5 text-white drop-shadow" strokeWidth={3} />
            ) : null}
          </button>
        );
      })}
      {allowCustom ? (
        <label
          className={cn(
            dot,
            'relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[var(--color-border-strong)]',
            'bg-[conic-gradient(from_0deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]',
          )}
          title="Custom color"
        >
          <input
            type="color"
            value={value}
            aria-label="Custom color"
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      ) : null}
    </div>
  );
}
