import {
  PhoneInput as InternationalPhoneInput,
  type PhoneInputProps as BasePhoneInputProps,
} from 'react-international-phone';
import 'react-international-phone/style.css';

export type PhoneInputProps = Pick<
  BasePhoneInputProps,
  'value' | 'onChange' | 'disabled' | 'name' | 'placeholder' | 'defaultCountry'
>;

export function PhoneInput(props: PhoneInputProps) {
  return (
    <InternationalPhoneInput
      {...props}
      inputClassName="!h-9 !w-full !border-0 !bg-transparent !text-sm !text-[var(--color-fg-base)] !outline-none"
      className="!flex !h-9 !rounded-md !border !border-[var(--color-border-strong)] !bg-[var(--color-bg-base)] focus-within:!border-[var(--color-accent)] focus-within:!ring-3 focus-within:!ring-[var(--color-accent)]/15"
      countrySelectorStyleProps={{
        buttonClassName: '!h-9 !border-0 !bg-transparent hover:!bg-[var(--color-bg-muted)]',
      }}
    />
  );
}
