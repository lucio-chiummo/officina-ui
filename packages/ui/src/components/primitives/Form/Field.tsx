import { cn } from '@lib/utils/cn';
/**
 * Field — labeled form-control wrapper. Reads errors from RHF context by name.
 */
import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type FieldProps = {
  /** Explicit id for the control; auto-generated when omitted. */
  id?: string;
  /** RHF field name — used to read validation errors from form context. */
  name?: string;
  /** Visible field label. */
  label: string;
  /** Helper text shown below the control. */
  hint?: string;
  /** Manual error message; overrides any RHF error for `name`. */
  error?: string | undefined;
  /** Marks the field required (adds the required indicator). */
  required?: boolean;
  /** Extra classes for the field wrapper. */
  className?: string;
  children:
    | ReactNode
    | ((props: { id: string; 'aria-invalid': boolean; 'aria-describedby': string }) => ReactNode);
};

export function Field({
  id: providedId,
  name,
  label,
  hint,
  error: manualError,
  required,
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const ctx = useFormContext();
  const error = name ? ctx?.formState.errors[name] : undefined;
  const errorMessage =
    manualError ?? (typeof error?.message === 'string' ? error.message : undefined);

  const describedBy = [hint ? hintId : null, errorMessage ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-fg-base)]">
        {label}
        {required ? (
          <span className="ml-1 text-[var(--color-danger)]" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {typeof children === 'function'
        ? children({ id, 'aria-invalid': Boolean(errorMessage), 'aria-describedby': describedBy })
        : isValidElement(children)
          ? cloneElement(children as ReactElement<Record<string, unknown>>, {
              id,
              'aria-invalid': Boolean(errorMessage),
              'aria-describedby': describedBy || undefined,
            })
          : children}
      {hint && !errorMessage ? (
        <p id={hintId} className="text-xs text-[var(--color-fg-muted)]">
          {hint}
        </p>
      ) : null}
      {errorMessage ? (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-danger)]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
