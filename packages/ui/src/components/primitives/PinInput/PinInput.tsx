import { cn } from '@lib/utils/cn';
import { OTPInput } from 'input-otp';

export type PinInputProps = {
  /** Current code value. */
  value: string;
  /** Called with the full code as digits are entered. */
  onChange: (value: string) => void;
  /** Number of input cells. Defaults to 6. */
  length?: number;
  /** Visible label above the inputs. */
  label?: string;
  disabled?: boolean;
  /** Mark the field invalid for validation styling. */
  invalid?: boolean;
  /** Extra classes for the slot container. */
  className?: string;
  'aria-describedby'?: string;
};

export function PinInput({
  value,
  onChange,
  length = 6,
  label = 'Security code',
  disabled,
  invalid,
  className,
  'aria-describedby': ariaDescribedby,
}: PinInputProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={length}
      disabled={disabled}
      aria-label={label}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={ariaDescribedby}
      containerClassName={cn('flex gap-2', className)}
      render={({ slots }) => (
        <>
          {slots.map((slot, index) => (
            <div
              key={`slot-${String(index + 1)}`}
              className={cn(
                'flex size-10 items-center justify-center rounded-md border bg-[var(--color-bg-base)] text-sm font-semibold',
                invalid ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-strong)]',
              )}
            >
              {slot.char}
              {slot.hasFakeCaret ? (
                <span className="h-5 w-px animate-pulse bg-[var(--color-fg-base)]" />
              ) : null}
            </div>
          ))}
        </>
      )}
    />
  );
}
