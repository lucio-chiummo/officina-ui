import { cn } from '@lib/utils/cn';
import { forwardRef, useId, type ChangeEvent, type FocusEventHandler } from 'react';

/**
 * Mask tokens:
 *   9 — digit (0-9)
 *   a — letter (A-Z, a-z)
 *   * — alphanumeric
 * Any other character is a literal and is inserted automatically.
 * Example masks: "(999) 999-9999", "99/99/9999", "aa-9999", "99:99"
 */
export type MaskedInputProps = {
  /** Mask pattern; `9` = digit, `a` = letter, `*` = alphanumeric (e.g. "(999) 999-9999"). */
  mask: string;
  /** Current (masked) value. */
  value: string;
  /** Called with the masked value on input. */
  onChange: (value: string) => void;
  /** Visible label above the field. */
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Mark the field invalid for validation styling. */
  invalid?: boolean;
  required?: boolean;
  /** Overrides the auto-generated id (e.g. to pair with `FormControl`). */
  id?: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  className?: string;
  /** Accessible name when no visible label is present. */
  'aria-label'?: string;
  'aria-describedby'?: string;
};

const TOKEN_PATTERNS: Record<string, RegExp> = {
  '9': /\d/,
  a: /[a-zA-Z]/,
  '*': /[a-zA-Z0-9]/,
};

export function applyMask(raw: string, mask: string): string {
  let out = '';
  let rawIdx = 0;
  for (const maskChar of mask) {
    if (rawIdx >= raw.length) break;
    const pattern = TOKEN_PATTERNS[maskChar];
    if (pattern) {
      while (rawIdx < raw.length && !pattern.test(raw[rawIdx] ?? '')) rawIdx += 1;
      if (rawIdx >= raw.length) break;
      out += raw[rawIdx];
      rawIdx += 1;
    } else {
      out += maskChar;
      if (raw[rawIdx] === maskChar) rawIdx += 1;
    }
  }
  return out;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(function MaskedInput(
  {
    mask,
    value,
    onChange,
    label,
    placeholder,
    disabled,
    invalid,
    required,
    id: idProp,
    name,
    onBlur,
    className,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(applyMask(event.target.value, mask));
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-fg-base)]">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        name={name}
        type="text"
        inputMode={/^[^9]*9/.test(mask) && !/[a*]/.test(mask) ? 'numeric' : 'text'}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder ?? mask.replace(/9/g, '0').replace(/a/g, 'A').replace(/\*/g, '#')}
        disabled={Boolean(disabled)}
        required={required}
        aria-label={ariaLabel ?? label}
        aria-invalid={invalid ? true : undefined}
        aria-required={required ? true : undefined}
        aria-describedby={ariaDescribedby}
        maxLength={mask.length}
        className={cn(
          'block h-9 w-full rounded-md border bg-[var(--color-bg-base)] px-3 py-2 text-sm text-[var(--color-fg-base)]',
          'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
          'placeholder:text-[var(--color-fg-subtle)]',
          'focus-visible:ring-[var(--color-accent)]/20 focus:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid
            ? 'focus-visible:ring-[var(--color-danger)]/20 border-[var(--color-danger)] focus-visible:border-[var(--color-danger)]'
            : 'border-[var(--color-border-strong)]',
        )}
      />
    </div>
  );
});
