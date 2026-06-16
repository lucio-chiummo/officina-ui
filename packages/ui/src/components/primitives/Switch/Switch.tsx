import { Switch as HuiSwitch, Field, Label, Description } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { forwardRef, type FocusEventHandler } from 'react';

export type SwitchProps = {
  /** Controlled on/off state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new boolean state when toggled. */
  onChange?: (checked: boolean) => void;
  /** Disable interaction and dim the control. */
  disabled?: boolean;
  /** Marks the field as required for validation styling and `aria-required`. */
  required?: boolean;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Form field name, for native form submission / form libraries. */
  name?: string;
  /** Visible label rendered beside the switch. */
  label?: string;
  /** Secondary helper text under the label. */
  description?: string;
  className?: string;
  /** Element id, also used to associate the label. */
  id?: string;
  /** Accessible name when no visible `label` is provided. */
  'aria-label'?: string;
  /** Id of an external element labelling the switch. */
  'aria-labelledby'?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked,
    onChange,
    disabled,
    required,
    invalid,
    name,
    label,
    description,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    onBlur,
    onFocus,
  },
  ref,
) {
  const switchProps = {
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
    ...(ariaLabelledby !== undefined
      ? { 'aria-labelledby': ariaLabelledby }
      : ariaLabel !== undefined
        ? { 'aria-label': ariaLabel }
        : {}),
  };

  const control = (
    <HuiSwitch
      ref={ref}
      {...switchProps}
      className={cn(
        'group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent bg-[var(--color-bg-muted)]',
        'transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
        'data-[checked]:bg-[var(--color-accent)]',
        'aria-[invalid=true]:outline aria-[invalid=true]:outline-[var(--color-danger)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block size-4 rounded-full bg-[var(--color-bg-base)] shadow-sm',
          'ring-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)]',
          'translate-x-0.5 group-data-[checked]:translate-x-5',
        )}
      />
    </HuiSwitch>
  );

  if (!label) return control;

  return (
    <Field className="flex items-start gap-3">
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
