import { useMemo } from 'react';

import { DatePicker } from '../DatePicker';
import { TimePicker, type TimeValue } from './TimePicker';

export type DateTimePickerProps = {
  /** Selected date-time, or `undefined` when empty (controlled). */
  value: Date | undefined;
  /** Called with the newly selected date-time. */
  onChange: (value: Date | undefined) => void;
  /** Placeholder text when nothing is selected. */
  placeholder?: string;
};

export function DateTimePicker({ value, onChange, placeholder }: DateTimePickerProps) {
  const time = useMemo<TimeValue>(
    () => ({ hours: value?.getHours() ?? 0, minutes: value?.getMinutes() ?? 0 }),
    [value],
  );
  return (
    <div className="flex flex-wrap items-start gap-2">
      <DatePicker
        value={value}
        onChange={(date) => {
          if (!date) onChange(undefined);
          else {
            const next = new Date(date);
            next.setHours(time.hours, time.minutes, 0, 0);
            onChange(next);
          }
        }}
        className="min-w-52 flex-1"
        {...(placeholder ? { placeholder } : {})}
      />
      <TimePicker
        value={time}
        onChange={(next) => {
          const date = value ? new Date(value) : new Date();
          date.setHours(next.hours, next.minutes, next.seconds ?? 0, 0);
          onChange(date);
        }}
      />
    </div>
  );
}
