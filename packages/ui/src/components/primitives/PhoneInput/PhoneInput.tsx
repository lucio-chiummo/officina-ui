import { forwardRef } from 'react';
import {
  PhoneInput as InternationalPhoneInput,
  type PhoneInputProps as BasePhoneInputProps,
  type PhoneInputRefType,
} from 'react-international-phone';
import 'react-international-phone/style.css';

export type PhoneInputProps = Pick<
  BasePhoneInputProps,
  | 'value'
  | 'onChange'
  | 'disabled'
  | 'name'
  | 'placeholder'
  | 'defaultCountry'
  | 'required'
  | 'onBlur'
  | 'onFocus'
> & {
  /** Element id, applied to the underlying input. */
  id?: string;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Id(s) of element(s) describing the field (helper/error text). */
  'aria-describedby'?: string;
};

export const PhoneInput = forwardRef<PhoneInputRefType, PhoneInputProps>(function PhoneInput(
  { id, invalid, 'aria-describedby': ariaDescribedby, ...props },
  ref,
) {
  return (
    <InternationalPhoneInput
      ref={ref}
      {...props}
      inputProps={{
        id,
        'aria-invalid': invalid ? true : undefined,
        'aria-describedby': ariaDescribedby,
      }}
      inputClassName="!h-9 !w-full !border-0 !bg-transparent !text-sm !text-[var(--color-fg-base)] !outline-none"
      className={
        invalid
          ? 'focus-within:!ring-3 focus-within:!ring-[var(--color-danger)]/15 !flex !h-9 !rounded-md !border !border-[var(--color-danger)] !bg-[var(--color-bg-base)]'
          : 'focus-within:!ring-3 focus-within:!ring-[var(--color-accent)]/15 !flex !h-9 !rounded-md !border !border-[var(--color-border-strong)] !bg-[var(--color-bg-base)] focus-within:!border-[var(--color-accent)]'
      }
      countrySelectorStyleProps={{
        buttonClassName: '!h-9 !border-0 !bg-transparent hover:!bg-[var(--color-bg-muted)]',
      }}
    />
  );
});
