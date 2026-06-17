import { cn } from '@lib/utils/cn';
import { forwardRef, useId, type FocusEventHandler } from 'react';
import 'react-day-picker/style.css';
import { DayPicker, type DateRange } from 'react-day-picker';

import { Popover } from '../Popover';
import { dayPickerClassNames } from './dayPickerStyles';

type SharedProps = {
  /** Field label shown above the input. */
  label?: string;
  /** Extra classes for the field wrapper. */
  className?: string;
  /** Element id, also used to associate the label. */
  id?: string;
  /** Form field name, for native form submission / form libraries. */
  name?: string;
  disabled?: boolean;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Id(s) of element(s) describing the field (helper/error text). */
  'aria-describedby'?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
};

type SingleProps = SharedProps & {
  /** Single-date selection mode (default). */
  mode?: 'single';
  /** Selected date, or `undefined` when empty (controlled). */
  value: Date | undefined;
  /** Called with the newly selected date. */
  onChange: (date: Date | undefined) => void;
  /** Placeholder text when no date is selected. */
  placeholder?: string;
};

type RangeProps = SharedProps & {
  /** Date-range selection mode. */
  mode: 'range';
  /** Selected start/end range, or `undefined` when empty (controlled). */
  value: DateRange | undefined;
  /** Called with the newly selected range. */
  onChange: (range: DateRange | undefined) => void;
  /** Placeholder text when no range is selected. */
  placeholder?: string;
};

export type DatePickerProps = SingleProps | RangeProps;

function format(date?: Date): string {
  return date ? date.toISOString().slice(0, 10) : '';
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const generatedId = useId();
    const id = props.id ?? generatedId;
    const display =
      props.mode === 'range'
        ? props.value?.from
          ? `${format(props.value.from)} → ${format(props.value.to) || '…'}`
          : ''
        : format(props.value);

    return (
      <div className={cn('flex flex-col gap-1.5', props.className)}>
        {props.label ? (
          <label htmlFor={id} className="text-sm font-medium text-[var(--color-fg-base)]">
            {props.label}
          </label>
        ) : null}
        <Popover
          trigger={
            <button
              ref={ref}
              id={id}
              name={props.name}
              type="button"
              disabled={props.disabled}
              aria-describedby={props['aria-describedby']}
              onBlur={props.onBlur}
              onFocus={props.onFocus}
              className={cn(
                'focus-visible:ring-[var(--color-accent)]/20 block h-9 w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 py-2 text-left text-sm text-[var(--color-fg-base)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2',
                props.invalid && 'border-[var(--color-danger)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {display || (props.placeholder ?? 'Select a date')}
            </button>
          }
          className="w-[min(360px,94vw)] p-3"
        >
          {props.mode === 'range' ? (
            <DayPicker
              mode="range"
              selected={props.value}
              onSelect={props.onChange}
              numberOfMonths={2}
              classNames={dayPickerClassNames}
            />
          ) : (
            <DayPicker
              mode="single"
              selected={props.value}
              onSelect={props.onChange}
              classNames={dayPickerClassNames}
            />
          )}
        </Popover>
      </div>
    );
  },
);
