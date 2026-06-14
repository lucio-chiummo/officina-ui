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
};

export function PinInput({
  value,
  onChange,
  length = 6,
  label = 'Security code',
  disabled,
}: PinInputProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={length}
      disabled={disabled}
      aria-label={label}
      containerClassName="flex gap-2"
      render={({ slots }) => (
        <>
          {slots.map((slot, index) => (
            <div
              key={`slot-${String(index + 1)}`}
              className="flex size-10 items-center justify-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] text-sm font-semibold"
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
