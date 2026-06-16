import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useMemo, useState, type InputHTMLAttributes } from 'react';

import { Progress } from '../Progress';

export type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Show a live password-strength meter below the field. */
  showStrength?: boolean;
  /** Accessible label for the reveal toggle (show state). */
  revealLabel?: string;
  /** Accessible label for the reveal toggle (hide state). */
  hideLabel?: string;
};

function scorePassword(value: string) {
  let score = 0;
  if (value.length >= 8) score += 25;
  if (/[A-Z]/.test(value)) score += 25;
  if (/[0-9]/.test(value)) score += 25;
  if (/[^A-Za-z0-9]/.test(value)) score += 25;
  return score;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      showStrength,
      revealLabel = 'Show password',
      hideLabel = 'Hide password',
      value,
      className,
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const score = useMemo(() => scorePassword(String(value ?? '')), [value]);
    return (
      <div className={className}>
        <div className="relative">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            value={value}
            className="focus:ring-3 focus:ring-[var(--color-accent)]/15 block h-9 w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 pr-10 text-sm outline-none focus:border-[var(--color-accent)]"
            {...props}
          />
          <button
            type="button"
            aria-label={visible ? hideLabel : revealLabel}
            onClick={() => setVisible((next) => !next)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--color-fg-subtle)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {showStrength ? (
          <Progress
            className="mt-2"
            value={score}
            size="sm"
            variant={score > 70 ? 'success' : score > 40 ? 'warning' : 'danger'}
            showValue
          />
        ) : null}
      </div>
    );
  },
);
