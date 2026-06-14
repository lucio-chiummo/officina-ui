'use client';

import {
  DateRangeFilter,
  FacetedFilter,
  FilterChips,
  FilterPopover,
  RangeFilter,
} from '@officina/ui';
import { type ComponentProps, useState } from 'react';

const statusOptions = [
  { value: 'live', label: 'Live' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export function FilterPopoverDemo() {
  return (
    <FilterPopover label="Status">
      <p className="text-sm">Put any filter content here.</p>
    </FilterPopover>
  );
}

export function FacetedFilterDemo() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <FacetedFilter
      label="Status"
      options={statusOptions.map((option, index) => ({ ...option, count: 12 + index }))}
      value={value}
      onChange={setValue}
      showSearch
      searchPlaceholder="Search statuses"
    />
  );
}

export function DateRangeFilterDemo() {
  const [range, setRange] = useState<ComponentProps<typeof DateRangeFilter>['value']>({
    from: undefined,
    to: undefined,
  });
  return (
    <DateRangeFilter
      label="Created"
      value={range}
      onChange={setRange}
      onClear={() => setRange({ from: undefined, to: undefined })}
    />
  );
}

export function RangeFilterDemo() {
  const [score, setScore] = useState<[number, number]>([0, 100]);
  const [price, setPrice] = useState<[number, number]>([20, 80]);
  return (
    <div className="grid w-full gap-4">
      <RangeFilter label="Score" value={score} onChange={setScore} min={0} max={100} />
      <RangeFilter label="Price ($)" value={price} onChange={setPrice} min={0} max={200} />
    </div>
  );
}

export function FilterChipsDemo() {
  const [chips, setChips] = useState(['live', 'draft']);
  return (
    <FilterChips
      chips={chips.map((item) => ({
        id: item,
        label: `Status: ${item}`,
        onRemove: () => setChips(chips.filter((next) => next !== item)),
      }))}
      onClearAll={() => setChips([])}
    />
  );
}
