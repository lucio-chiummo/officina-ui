import type { ReactNode } from 'react';

import { SearchInput } from '../SearchInput';

export type TableToolbarProps = {
  /** Built-in search box config; omit to hide the search input. */
  search?: { value: string; onChange: (value: string) => void; placeholder?: string };
  /** Filter controls rendered in the toolbar's filter slot. */
  filters?: ReactNode;
  /** Bulk-action controls shown when rows are selected. */
  bulkActions?: ReactNode;
  /** Column visibility toggle control. */
  columnsToggle?: ReactNode;
  /** Arbitrary content pinned to the right edge of the toolbar. */
  rightSlot?: ReactNode;
};

export function TableToolbar({
  search,
  filters,
  bulkActions,
  columnsToggle,
  rightSlot,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[var(--color-border-subtle)] pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {search ? (
          <SearchInput
            className="w-full sm:w-72"
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder}
          />
        ) : null}
        {filters}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {bulkActions}
        {columnsToggle}
        {rightSlot}
      </div>
    </div>
  );
}
