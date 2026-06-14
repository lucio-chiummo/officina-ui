import { cn } from '@lib/utils/cn';
import { useId } from 'react';
import 'react-day-picker/style.css';
import { DayPicker, type DateRange } from 'react-day-picker';

import { Popover } from '../Popover';
import { dayPickerClassNames } from './dayPickerStyles';

type SingleProps = {
  /** Single-date selection mode (default). */
  mode?: 'single';
  /** Selected date, or `undefined` when empty (controlled). */
  value: Date | undefined;
  /** Called with the newly selected date. */
  onChange: (date: Date | undefined) => void;
  /** Field label shown above the input. */
  label?: string;
  /** Placeholder text when no date is selected. */
  placeholder?: string;
  /** Extra classes for the field wrapper. */
  className?: string;
};

type RangeProps = {
  /** Date-range selection mode. */
  mode: 'range';
  /** Selected start/end range, or `undefined` when empty (controlled). */
  value: DateRange | undefined;
  /** Called with the newly selected range. */
  onChange: (range: DateRange | undefined) => void;
  /** Field label shown above the input. */
  label?: string;
  /** Placeholder text when no range is selected. */
  placeholder?: string;
  /** Extra classes for the field wrapper. */
  className?: string;
};

export type DatePickerProps = SingleProps | RangeProps;

function format(date?: Date): string {
  return date ? date.toISOString().slice(0, 10) : '';
}

export function DatePicker(props: DatePickerProps) {
  const id = useId();
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
            id={id}
            type="button"
            className="block h-9 w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 py-2 text-left text-sm text-[var(--color-fg-base)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20"
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
}
