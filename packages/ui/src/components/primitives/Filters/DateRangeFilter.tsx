import type { DateRange } from 'react-day-picker';

import { lazy, Suspense } from 'react';

import { FilterPopover } from './FilterPopover';

const LazyDateRangeFilterCalendar = lazy(() =>
  import('./DateRangeFilterCalendar').then((module) => ({
    default: module.DateRangeFilterCalendar,
  })),
);

export type DateRangeFilterProps = {
  /** Filter label shown on the trigger. */
  label: string;
  /** Selected range ({ from, to }). */
  value: DateRange;
  /** Called with the new range. */
  onChange: (value: DateRange) => void;
  /** Render inline instead of inside a popover. */
  inline?: boolean;
  /** Called when the filter is cleared; omit to hide the clear control. */
  onClear?: () => void;
  /** Placeholder when no range is set. */
  placeholder?: string;
};

export function DateRangeFilter({
  label,
  value,
  onChange,
  inline = false,
  onClear,
  placeholder,
}: DateRangeFilterProps) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
  const text = value.from
    ? `${dateFormatter.format(value.from)} - ${value.to ? dateFormatter.format(value.to) : ''}`
    : label;
  const picker = (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="h-80 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
        />
      }
    >
      <LazyDateRangeFilterCalendar value={value} onChange={onChange} />
    </Suspense>
  );

  if (inline) return picker;

  return (
    <FilterPopover
      label={text || placeholder || label}
      activeCount={value.from ? 1 : 0}
      {...(onClear ? { onClear } : {})}
    >
      {picker}
    </FilterPopover>
  );
}
