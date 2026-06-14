import type { Locale } from 'date-fns';

import { cn } from '@lib/utils/cn';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';

import { Button } from '../Button';
import { Popover } from '../Popover';
import { dayPickerClassNames } from './dayPickerStyles';

export type { DateRange } from 'react-day-picker';

export type DateRangePickerProps = {
  /** Selected range ({ from, to }). */
  value: DateRange;
  /** Called with the new range on selection. */
  onChange: (value: DateRange) => void;
  /** Quick-select preset ranges shown beside the calendar. */
  presets?: { label: string; range: DateRange }[];
  /** Earliest selectable date. */
  minDate?: Date;
  /** Latest selectable date. */
  maxDate?: Date;
  /** Placeholder for the trigger input when empty. */
  placeholder?: string;
  /** date-fns locale for labels and formatting. */
  locale?: Locale;
  className?: string;
  /** Render the calendar inline instead of in a popover. */
  inline?: boolean;
};

function formatRange(value: DateRange, placeholder?: string, locale?: Locale) {
  const opts = locale ? { locale } : undefined;
  if (!value.from) return placeholder ?? '';
  if (!value.to) return format(value.from, 'MMM d, yyyy', opts);
  return `${format(value.from, 'MMM d', opts)} - ${format(value.to, 'MMM d, yyyy', opts)}`;
}

export function DateRangePicker({
  value,
  onChange,
  presets = [],
  minDate,
  maxDate,
  placeholder,
  locale,
  className,
  inline = false,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const disabled = [
    minDate ? { before: minDate } : false,
    maxDate ? { after: maxDate } : false,
  ].filter(Boolean);
  const content = (
    <div className="flex flex-col gap-3 p-4 md:flex-row">
      {presets.length ? (
        <div className="flex min-w-36 flex-col gap-1 border-r border-[var(--color-border)] pr-3">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onChange(preset.range);
                setOpen(false);
              }}
              className="rounded-md px-2 py-1.5 text-left text-sm transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}
      <DayPicker
        mode="range"
        resetOnSelect
        selected={value}
        onSelect={(range) => {
          const next = range ?? { from: undefined, to: undefined };
          onChange(next);
          if (next.from && next.to) setOpen(false);
        }}
        numberOfMonths={2}
        disabled={disabled}
        classNames={dayPickerClassNames}
        {...(locale ? { locale } : {})}
      />
    </div>
  );

  if (inline) {
    return <div className={cn('w-full', className)}>{content}</div>;
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="secondary" className={cn('w-full justify-start font-normal', className)}>
          <Calendar className="size-4" />
          <span className="truncate">{formatRange(value, placeholder, locale)}</span>
        </Button>
      }
      className="w-[min(720px,96vw)] p-0"
    >
      {content}
    </Popover>
  );
}
