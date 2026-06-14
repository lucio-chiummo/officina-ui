import type { DateRange } from 'react-day-picker';

import { cn } from '@lib/utils/cn';
import { useMemo } from 'react';

import { DateRangePicker } from '../DatePicker';
import { TimePicker, type TimeValue } from './TimePicker';

export type DateTimeRangePickerProps = {
  /** Selected start/end date-time range (controlled). */
  value: DateRange;
  /** Called with the next range when either date or time changes. */
  onChange: (value: DateRange) => void;
  /** Placeholder text for the date inputs. */
  placeholder?: string;
  /** Label for the start date-time field. */
  startLabel?: string;
  /** Label for the end date-time field. */
  endLabel?: string;
  /** Extra classes for the picker container. */
  className?: string;
};

function toTime(value?: Date): TimeValue {
  return { hours: value?.getHours() ?? 0, minutes: value?.getMinutes() ?? 0 };
}

function withTime(date: Date, time: TimeValue): Date {
  const next = new Date(date);
  next.setHours(time.hours, time.minutes, 0, 0);
  return next;
}

export function DateTimeRangePicker({
  value,
  onChange,
  placeholder,
  startLabel = 'Start time',
  endLabel = 'End time',
  className,
}: DateTimeRangePickerProps) {
  const start = useMemo(() => toTime(value.from), [value.from]);
  const end = useMemo(() => toTime(value.to), [value.to]);

  return (
    <div className={cn('space-y-2', className)}>
      <DateRangePicker
        value={value}
        onChange={(next) =>
          onChange({
            from: next.from ? withTime(next.from, start) : undefined,
            to: next.to ? withTime(next.to, end) : undefined,
          })
        }
        {...(placeholder ? { placeholder } : {})}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <TimePicker
          value={start}
          label={startLabel}
          disabled={!value.from}
          onChange={(next) => {
            if (!value.from) return;
            onChange({ from: withTime(value.from, next), to: value.to });
          }}
        />
        <TimePicker
          value={end}
          label={endLabel}
          disabled={!value.to}
          onChange={(next) => {
            if (!value.to) return;
            onChange({ from: value.from, to: withTime(value.to, next) });
          }}
        />
      </div>
    </div>
  );
}
