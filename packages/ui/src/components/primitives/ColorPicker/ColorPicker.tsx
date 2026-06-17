import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { forwardRef, type FocusEventHandler } from 'react';

export type ColorPickerProps = {
  /** Selected color as a hex string (controlled). */
  value: string;
  /** Called with the new hex value when the color changes. */
  onChange: (hex: string) => void;
  /** Swatch presets shown for quick selection. Falls back to a default palette. */
  presets?: string[];
  /** Field label shown above the picker. */
  label?: string;
  /** Extra classes for the picker container. */
  className?: string;
  /** Element id, applied to the trigger button. */
  id?: string;
  /** Form field name, for native form submission / form libraries. */
  name?: string;
  disabled?: boolean;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Id(s) of element(s) describing the field (helper/error text). */
  'aria-describedby'?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
};

const DEFAULT_PRESETS = [
  '#6366f1', // indigo  (default)
  '#7c3aed', // violet
  '#2563eb', // blue
  '#0891b2', // cyan
  '#059669', // emerald
  '#16a34a', // green
  '#d97706', // amber
  '#dc2626', // red
  '#db2777', // pink
  '#0f172a', // slate-near-black
];

export const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(function ColorPicker(
  {
    value,
    onChange,
    presets = DEFAULT_PRESETS,
    label,
    className,
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
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <span className="text-sm font-medium text-[var(--color-fg-base)]">{label}</span>
      ) : null}
      <Popover className="relative">
        <PopoverButton
          ref={ref}
          id={id}
          name={name}
          {...(disabled !== undefined ? { disabled } : {})}
          aria-describedby={ariaDescribedBy}
          onBlur={onBlur}
          onFocus={onFocus}
          className={cn(
            'inline-flex items-center gap-2 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 py-2 text-sm text-[var(--color-fg-base)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
            invalid && 'border-[var(--color-danger)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          aria-label={`Color: ${value}`}
        >
          <span
            className="size-5 rounded-full border border-[var(--color-border)]"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-xs">{value}</span>
        </PopoverButton>
        <PopoverPanel
          anchor="bottom start"
          className="z-[9997] mt-1 w-56 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-3 shadow-[var(--shadow-xl)] transition-opacity duration-[var(--motion-base)] ease-[var(--ease-standard)]"
        >
          <div className="grid grid-cols-5 gap-2">
            {presets.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Select ${c}`}
                onClick={() => onChange(c)}
                className={cn(
                  'size-6 rounded-full border-2 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:opacity-85',
                  c === value ? 'border-[var(--color-fg-base)]' : 'border-transparent',
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="size-8 cursor-pointer rounded border border-[var(--color-border)] bg-transparent"
              aria-label="Custom color"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              pattern="^#[0-9a-fA-F]{6}$"
              className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] px-2 py-1 font-mono text-xs text-[var(--color-fg-base)]"
              aria-label="Hex value"
            />
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  );
});
