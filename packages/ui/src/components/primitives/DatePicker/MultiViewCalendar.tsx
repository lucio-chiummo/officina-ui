import { cn } from '@lib/utils/cn';
import 'react-day-picker/style.css';
import { DayPicker, type DateRange } from 'react-day-picker';

import { dayPickerClassNames } from './dayPickerStyles';

type SingleProps = {
  /** Single-date selection mode (default). */
  mode?: 'single';
  /** Selected date, or `undefined` when empty (controlled). */
  value: Date | undefined;
  /** Called with the newly selected date. */
  onChange: (date: Date | undefined) => void;
  /** Number of months rendered side by side. Defaults to `2`. */
  months?: number;
  /** Extra classes for the calendar container. */
  className?: string;
};

type RangeProps = {
  /** Date-range selection mode. */
  mode: 'range';
  /** Selected start/end range, or `undefined` when empty (controlled). */
  value: DateRange | undefined;
  /** Called with the newly selected range. */
  onChange: (range: DateRange | undefined) => void;
  /** Number of months rendered side by side. Defaults to `2`. */
  months?: number;
  /** Extra classes for the calendar container. */
  className?: string;
};

export type MultiViewCalendarProps = SingleProps | RangeProps;

/**
 * Inline calendar showing multiple months side by side. Unlike DatePicker this
 * renders directly in the page (no popover) — for range dashboards, booking
 * flows, and availability views.
 */
export function MultiViewCalendar(props: MultiViewCalendarProps) {
  const months = props.months ?? 2;
  return (
    <div
      className={cn(
        'inline-block rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3',
        props.className,
      )}
    >
      {props.mode === 'range' ? (
        <DayPicker
          mode="range"
          selected={props.value}
          onSelect={props.onChange}
          numberOfMonths={months}
          classNames={dayPickerClassNames}
        />
      ) : (
        <DayPicker
          mode="single"
          selected={props.value}
          onSelect={props.onChange}
          numberOfMonths={months}
          classNames={dayPickerClassNames}
        />
      )}
    </div>
  );
}
