import { cn } from '@lib/utils/cn';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

import type { FilterDialect, FilterFieldDef, FilterMode } from '@/lib/filters';

import { FilterBar, FiltersProvider, useFilters } from '../Filters';

export type DataGridColumn<TData extends object> = ColumnDef<TData, unknown>;

export type DataGridFilters<TData extends object> = {
  fields: FilterFieldDef<TData>[];
  mode: FilterMode;
  urlKey?: string;
  dialect?: FilterDialect;
  onServerQueryChange?: (params: URLSearchParams) => void;
};

export type DataGridProps<TData extends object> = {
  /** Row data. */
  data: TData[];
  /** Column definitions. */
  columns: DataGridColumn<TData>[];
  /** Column accessorKey/id values that allow double-click inline editing. */
  editableColumns?: string[];
  /** Called when an editable cell is committed. */
  onCellChange?: (rowIndex: number, columnId: string, value: string) => void;
  /** Row height/padding density. */
  density?: 'comfortable' | 'compact';
  /** Controlled global search term. */
  globalFilter?: string;
  /** Rows per page; enables pagination when set. */
  pageSize?: number;
  /** Keep the header visible while scrolling. */
  stickyHeader?: boolean;
  /** Per-column filter configuration. */
  filters?: DataGridFilters<TData>;
  className?: string;
};

type EditingCell = { rowIndex: number; columnId: string } | null;

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') return <ChevronUp className="size-3.5 shrink-0" />;
  if (sorted === 'desc') return <ChevronDown className="size-3.5 shrink-0" />;
  return <ChevronsUpDown className="size-3.5 shrink-0 opacity-40" />;
}

function EditableCell({
  value,
  onCommit,
  onAbort,
}: {
  value: string;
  onCommit: (next: string) => void;
  onAbort: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onCommit(e.currentTarget.value);
    if (e.key === 'Escape') onAbort();
  };

  return (
    <input
      ref={ref}
      defaultValue={value}
      onBlur={(e) => onCommit(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
      className="ring-[var(--color-accent)]/25 w-full rounded border border-[var(--color-accent)] bg-[var(--color-bg-base)] px-1.5 py-0.5 text-sm outline-none ring-2"
    />
  );
}

type DataGridBaseProps<TData extends object> = Omit<DataGridProps<TData>, 'filters'>;

function DataGridBase<TData extends object>({
  data,
  columns,
  editableColumns,
  onCellChange,
  density = 'comfortable',
  globalFilter,
  pageSize = 50,
  stickyHeader = false,
  className,
}: DataGridBaseProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editing, setEditing] = useState<EditingCell>(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const isEditable = useCallback(
    (columnId: string) => editableColumns?.includes(columnId) ?? false,
    [editableColumns],
  );

  const cellValue = (row: Row<TData>, columnId: string): string => {
    const v = row.getValue(columnId);
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return JSON.stringify(v);
  };

  const tdClass = density === 'compact' ? 'px-3 py-1' : 'px-4 py-2.5';

  return (
    <div
      className={cn(
        'overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border)]',
        className,
      )}
    >
      <table className="w-full min-w-max border-collapse text-sm">
        <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
          {table.getHeaderGroups().map((hg) => (
            <tr
              key={hg.id}
              className="border-b border-[var(--color-border)] bg-[var(--color-bg-muted)]"
            >
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    'whitespace-nowrap text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]',
                    tdClass,
                    header.column.getCanSort() && 'cursor-pointer select-none',
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <SortIcon sorted={header.column.getIsSorted()} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className="border-b border-[var(--color-border)] bg-[var(--color-bg-base)] transition-colors last:border-0 hover:bg-[var(--color-bg-muted)]"
            >
              {row.getVisibleCells().map((cell) => {
                const isEditingThis =
                  editing?.rowIndex === rowIndex && editing.columnId === cell.column.id;
                const canEdit = isEditable(cell.column.id);

                return (
                  <td
                    key={cell.id}
                    className={cn(
                      'text-[var(--color-fg-base)]',
                      tdClass,
                      canEdit &&
                        !isEditingThis &&
                        'cursor-pointer hover:bg-[var(--color-accent-muted)]',
                    )}
                    onDoubleClick={() => {
                      if (canEdit) setEditing({ rowIndex, columnId: cell.column.id });
                    }}
                  >
                    {isEditingThis ? (
                      <EditableCell
                        value={cellValue(row, cell.column.id)}
                        onCommit={(next) => {
                          onCellChange?.(rowIndex, cell.column.id, next);
                          setEditing(null);
                        }}
                        onAbort={() => setEditing(null)}
                      />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-muted)] px-4 py-2 text-xs text-[var(--color-fg-muted)]">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded px-2 py-1 hover:bg-[var(--color-bg-base)] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded px-2 py-1 hover:bg-[var(--color-bg-base)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DataGridWithFilters<TData extends object>({
  filters,
  data,
  className,
  ...props
}: DataGridProps<TData> & { filters: DataGridFilters<TData> }) {
  const { dialect, fields, mode, onServerQueryChange, urlKey } = filters;
  const controls = useFilters<TData>({
    fields,
    mode,
    ...(urlKey ? { urlKey } : {}),
    ...(dialect ? { dialect } : {}),
  });

  const visibleData = useMemo(
    () => (mode === 'client' ? controls.filter(data) : data),
    [controls, data, mode],
  );

  useEffect(() => {
    if (mode !== 'server') return;
    onServerQueryChange?.(controls.queryParams);
  }, [controls.queryParams, controls.queryString, mode, onServerQueryChange]);

  return (
    <FiltersProvider value={controls}>
      <div className="space-y-2">
        <FilterBar />
        <DataGridBase data={visibleData} {...(className ? { className } : {})} {...props} />
      </div>
    </FiltersProvider>
  );
}

export function DataGrid<TData extends object>(props: DataGridProps<TData>) {
  if (props.filters) return <DataGridWithFilters {...props} filters={props.filters} />;
  return <DataGridBase {...props} />;
}

export { createColumnHelper };
