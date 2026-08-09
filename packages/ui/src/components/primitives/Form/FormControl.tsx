import { cn } from '@lib/utils/cn';
import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

export type FormControlField = {
  /** Stable id shared by the label (`htmlFor`) and the control. */
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
  'aria-required': true | undefined;
  required: boolean;
  disabled: boolean;
};

type FormControlContextValue = FormControlField & {
  descriptionId: string;
  errorId: string;
  invalid: boolean;
};

const FormControlContext = createContext<FormControlContextValue | null>(null);

export function useFormControlContext(): FormControlContextValue | null {
  return useContext(FormControlContext);
}

/**
 * Returns the ARIA wiring a control should spread onto itself so the
 * surrounding {@link FormControl} can connect label, helper text, and error.
 * Returns an empty object when used outside a `FormControl`.
 */
export function useFormControl(): Partial<FormControlField> {
  const ctx = useFormControlContext();
  if (!ctx) return {};
  return {
    id: ctx.id,
    'aria-describedby': ctx['aria-describedby'],
    'aria-invalid': ctx['aria-invalid'],
    'aria-required': ctx['aria-required'],
    required: ctx.required,
    disabled: ctx.disabled,
  };
}

export type FormControlProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'id'> & {
  id?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  /**
   * Children may be a render function that receives the resolved field props,
   * or static nodes that wire themselves with {@link useFormControl}.
   */
  children?: ReactNode | ((field: FormControlField) => ReactNode);
};

export function FormControl({
  id,
  invalid = false,
  required = false,
  disabled = false,
  className,
  children,
  ...props
}: FormControlProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = `${controlId}-description`;
  const errorId = `${controlId}-error`;

  const describedBy =
    [invalid ? errorId : null, descriptionId].filter(Boolean).join(' ') || undefined;

  const field: FormControlField = {
    id: controlId,
    'aria-describedby': describedBy,
    'aria-invalid': invalid ? true : undefined,
    'aria-required': required ? true : undefined,
    required,
    disabled,
  };

  const value: FormControlContextValue = { ...field, descriptionId, errorId, invalid };

  return (
    <FormControlContext.Provider value={value}>
      <div
        {...props}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={cn('flex flex-col gap-1.5', className)}
      >
        {typeof children === 'function' ? children(field) : children}
      </div>
    </FormControlContext.Provider>
  );
}

export type FormLabelProps = Omit<ComponentPropsWithoutRef<'label'>, 'htmlFor'> & {
  htmlFor?: string;
  required?: boolean;
};

export function FormLabel({ className, children, required, htmlFor, ...props }: FormLabelProps) {
  const ctx = useFormControlContext();
  const isRequired = required ?? ctx?.required ?? false;
  const target = htmlFor ?? ctx?.id;
  return (
    <label
      {...props}
      {...(target ? { htmlFor: target } : {})}
      className={cn(
        'flex items-center gap-1 text-sm font-medium text-[var(--color-fg-base)] select-none',
        ctx?.disabled && 'opacity-60',
        className,
      )}
    >
      {children}
      {isRequired ? (
        <span aria-hidden="true" className="text-[var(--color-danger-fg)]">
          *
        </span>
      ) : null}
    </label>
  );
}

const helperTone = {
  muted: 'text-[var(--color-fg-muted)]',
  danger: 'text-[var(--color-danger-fg)]',
  success: 'text-[var(--color-success-fg)]',
} as const;

export type FormHelperTextProps = ComponentPropsWithoutRef<'p'> & {
  tone?: keyof typeof helperTone;
};

export function FormHelperText({
  className,
  tone = 'muted',
  children,
  ...props
}: FormHelperTextProps) {
  const ctx = useFormControlContext();
  return (
    <p
      {...props}
      {...(ctx?.descriptionId ? { id: ctx.descriptionId } : {})}
      className={cn('text-xs leading-5', helperTone[tone], className)}
    >
      {children}
    </p>
  );
}

export type FormErrorProps = ComponentPropsWithoutRef<'p'>;

export function FormError({ className, children, ...props }: FormErrorProps) {
  const ctx = useFormControlContext();
  // When inside a FormControl, only render once the control is marked invalid.
  if (ctx && !ctx.invalid) return null;
  if (!children) return null;
  return (
    <p
      {...props}
      {...(ctx?.errorId ? { id: ctx.errorId } : {})}
      role="alert"
      className={cn('text-xs leading-5 text-[var(--color-danger-fg)]', className)}
    >
      {children}
    </p>
  );
}
