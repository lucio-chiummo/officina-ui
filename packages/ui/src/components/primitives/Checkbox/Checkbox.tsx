import { Checkbox as HuiCheckbox, Field, Label, Description } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { Check, Minus } from 'lucide-react';
import { forwardRef, type FocusEventHandler } from 'react';

export type CheckboxProps = {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new checked state on toggle. */
  onChange?: (checked: boolean) => void;
  /** Render the mixed/indeterminate visual state. */
  indeterminate?: boolean;
  /** Disable interaction and dim the control. */
  disabled?: boolean;
  /** Marks the field as required for validation styling and `aria-required`. */
  required?: boolean;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Form field name, for native form submission / form libraries. */
  name?: string;
  /** Visible label beside the checkbox. */
  label?: string;
  /** Secondary helper text under the label. */
  description?: string;
  className?: string;
  /** Element id, also associates the label. */
  id?: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
};

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked,
    onChange,
    indeterminate,
    disabled,
    required,
    invalid,
    name,
    label,
    description,
    className,
    id,
    onBlur,
    onFocus,
  },
  ref,
) {
  const checkboxProps = {
    ...(id !== undefined ? { id } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(checked !== undefined ? { checked } : {}),
    ...(defaultChecked !== undefined ? { defaultChecked } : {}),
    ...(onChange !== undefined ? { onChange } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(required !== undefined ? { 'aria-required': required } : {}),
    ...(invalid !== undefined ? { 'aria-invalid': invalid } : {}),
    ...(onBlur !== undefined ? { onBlur } : {}),
    ...(onFocus !== undefined ? { onFocus } : {}),
  };

  const control = (
    <HuiCheckbox
      ref={ref}
      {...checkboxProps}
      className={cn(
        'group relative flex size-4 shrink-0 items-center justify-center rounded',
        'border border-[var(--color-border-strong)] bg-[var(--color-bg-base)]',
        'transition-colors duration-[var(--duration-fast)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
        'data-[checked]:border-[var(--color-accent)] data-[checked]:bg-[var(--color-accent)]',
        'data-[indeterminate]:border-[var(--color-accent)] data-[indeterminate]:bg-[var(--color-accent)]',
        'aria-[invalid=true]:border-[var(--color-danger)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...(indeterminate ? { 'data-indeterminate': true } : {})}
    >
      {indeterminate ? (
        <Minus className="size-2.5 text-white" strokeWidth={3} aria-hidden="true" />
      ) : (
        <Check
          className="hidden size-2.5 text-white group-data-[checked]:block"
          strokeWidth={3}
          aria-hidden="true"
        />
      )}
    </HuiCheckbox>
  );

  if (!label) return control;

  return (
    <Field className="flex items-start gap-2.5">
      <div className="mt-0.5">{control}</div>
      <div className="min-w-0">
        <Label
          {...(id !== undefined ? { htmlFor: id } : {})}
          className="block cursor-pointer select-none text-sm font-medium text-[var(--color-fg-base)]"
        >
          {label}
        </Label>
        {description && (
          <Description className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
            {description}
          </Description>
        )}
      </div>
    </Field>
  );
});
