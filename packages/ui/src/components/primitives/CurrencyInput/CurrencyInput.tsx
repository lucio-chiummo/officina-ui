import { forwardRef } from 'react';

import { NumberInput, type NumberInputProps } from '../NumberInput';

export type CurrencyInputProps = Omit<
  NumberInputProps,
  'prefix' | 'precision' | 'step' | 'ariaLabel'
> & {
  /** ISO 4217 currency code (e.g. "USD"). */
  currency: string;
  /** BCP 47 locale for formatting. Defaults to the runtime locale. */
  locale?: string;
  /** Accessible name when no visible label is present. */
  ariaLabel?: string;
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ currency, locale = 'en-US', ...props }, ref) {
    const symbol =
      new Intl.NumberFormat(locale, { style: 'currency', currency })
        .formatToParts(0)
        .find((part) => part.type === 'currency')?.value ?? currency;
    return <NumberInput ref={ref} {...props} prefix={symbol} precision={2} step={0.01} />;
  },
);
