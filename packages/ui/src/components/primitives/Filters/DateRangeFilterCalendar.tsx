import type { DateRange } from 'react-day-picker';

import { DayPicker } from 'react-day-picker';

import { dayPickerClassNames } from '../DatePicker/dayPickerStyles';

export type DateRangeFilterCalendarProps = {
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export function DateRangeFilterCalendar({ value, onChange }: DateRangeFilterCalendarProps) {
  return (
    <div className="w-full">
      <DayPicker
        mode="range"
        resetOnSelect
        selected={value}
        onSelect={(range) => onChange(range ?? { from: undefined, to: undefined })}
        numberOfMonths={2}
        classNames={dayPickerClassNames}
      />
    </div>
  );
}
