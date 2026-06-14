import { NumberInput } from '../NumberInput';

export type CurrencyInputProps = {
  /** Amount in major units, or null when empty. */
  value: number | null;
  /** Called with the parsed amount (null when cleared). */
  onChange: (value: number | null) => void;
  /** ISO 4217 currency code (e.g. "USD"). */
  currency: string;
  /** BCP 47 locale for formatting. Defaults to the runtime locale. */
  locale?: string;
  /** Minimum allowed amount. */
  min?: number;
  /** Maximum allowed amount. */
  max?: number;
};

export function CurrencyInput({ currency, locale = 'en-US', ...props }: CurrencyInputProps) {
  const symbol =
    new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? currency;
  return <NumberInput {...props} prefix={symbol} precision={2} step={0.01} />;
}
