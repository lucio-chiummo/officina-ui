import type { Table } from '@tanstack/react-table';

import { Columns3 } from 'lucide-react';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Popover } from '../Popover';

export type ColumnsToggleProps<TData> = {
  table: Table<TData>;
  label?: string;
};

export function ColumnsToggle<TData>({ table, label = 'Columns' }: ColumnsToggleProps<TData>) {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  return (
    <Popover
      trigger={
        <Button variant="secondary" size="sm">
          <Columns3 className="size-4" />
          {label}
        </Button>
      }
    >
      <div className="space-y-1">
        {columns.map((column) => (
          <label
            key={column.id}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)]"
          >
            <Checkbox
              checked={column.getIsVisible()}
              onChange={(checked) => column.toggleVisibility(checked)}
            />
            <span className="truncate">{String(column.columnDef.header ?? column.id)}</span>
          </label>
        ))}
      </div>
    </Popover>
  );
}
