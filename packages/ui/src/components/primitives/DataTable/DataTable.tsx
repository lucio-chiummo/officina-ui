import { cn } from '@lib/utils/cn';
/**
 * DataTable — TanStack Table v8 wrapper.
 * Why: PLAN.md §3 / §9.3. Headless primitive: features (sort/filter/pagination/selection)
 * are wired by the consuming feature; this component renders the result.
 */
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import type { ExportColumn } from '@/lib/export/types';
import type { FilterDialect, FilterFieldDef, FilterMode } from '@/lib/filters';

import { FilterBar, FiltersProvider, useFilters } from '../Filters';
import { EmptyState } from '../States/EmptyState';
import { SkeletonRow } from '../States/LoadingState';
import { ExportToolbar, type ExportFormat } from './ExportToolbar';

export type DataTableFilters<TData extends object> = {
  fields: FilterFieldDef<TData>[];
  mode: FilterMode;
  urlKey?: string;
  dialect?: FilterDialect;
  onServerQueryChange?: (params: URLSearchParams) => void;
};

export type DataTableProps<TData extends object> = {
  /** Row data. */
  data: TData[];
  /** TanStack Table column definitions. */
  columns: ColumnDef<TData, unknown>[];
  /** Show a loading skeleton instead of rows. */
  isLoading?: boolean;
  /** Heading for the empty state. */
  emptyTitle?: string;
  /** Description for the empty state. */
  emptyDescription?: string | undefined;
  /** Row height/padding density. */
  density?: 'comfortable' | 'compact';
  /** When set, table renders a checkbox column and reports row selection. */
  enableRowSelection?: boolean;
  /** Called with the selected rows when selection changes. */
  onRowSelectionChange?: (rows: TData[]) => void;
  /** Called when a row is clicked. */
  onRowClick?: (row: TData) => void;
  /** Controlled global search term. */
  globalFilter?: string;
  /** Rows per page; enables pagination when set. */
  pageSize?: number;
  /** Custom toolbar rendered above the table. */
  toolbar?: ReactNode;
  exportable?: {
    columns?: ExportColumn<TData>[];
    filename?: string;
    formats?: ExportFormat[];
    scope?: 'visible' | 'all' | 'selected';
  };
  filters?: DataTableFilters<TData>;
  className?: string;
};

function getExportColumns<TData extends object>(
  columns: ColumnDef<TData, unknown>[],
): ExportColumn<TData>[] {
  return columns.flatMap((column) => {
    const candidate = column as {
      accessorKey?: string;
      header?: ReactNode | ((props: unknown) => ReactNode);
    };
    if (!candidate.accessorKey) return [];
    return [
      {
        header:
          typeof candidate.header === 'string' || typeof candidate.header === 'number'
            ? String(candidate.header)
            : candidate.accessorKey,
        key: candidate.accessorKey as keyof TData & string,
      },
    ];
  });
}

type DataTableBaseProps<TData extends object> = Omit<DataTableProps<TData>, 'filters'>;

function DataTableBase<TData extends object>({
  data,
  columns,
  isLoading,
  emptyTitle = 'No results',
  emptyDescription,
  density = 'comfortable',
  enableRowSelection,
  onRowSelectionChange,
  onRowClick,
  globalFilter,
  pageSize = 25,
  toolbar,
  exportable,
  className,
}: DataTableBaseProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const tableColumns = useMemo<ColumnDef<TData, unknown>[]>(
    () =>
      enableRowSelection
        ? [
            {
              id: '__select',
              enableSorting: false,
              header: ({ table }) => (
                <input
                  aria-label="Select all rows"
                  checked={table.getIsAllPageRowsSelected()}
                  className="size-4 rounded border-[var(--color-border-strong)]"
                  type="checkbox"
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                  onClick={(event) => event.stopPropagation()}
                />
              ),
              cell: ({ row }) => (
                <input
                  aria-label="Select row"
                  checked={row.getIsSelected()}
                  className="size-4 rounded border-[var(--color-border-strong)]"
                  disabled={!row.getCanSelect()}
                  type="checkbox"
                  onChange={row.getToggleSelectedHandler()}
                  onClick={(event) => event.stopPropagation()}
                />
              ),
            },
            ...columns,
          ]
        : columns,
    [columns, enableRowSelection],
  );

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: { sorting, rowSelection, ...(globalFilter !== undefined ? { globalFilter } : {}) },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onRowSelectionChange) {
        const rows = Object.keys(next)
          .filter((id) => next[id])
          .map((id) => data[Number(id)])
          .filter((r): r is TData => r !== undefined);
        onRowSelectionChange(rows);
      }
    },
    enableRowSelection: enableRowSelection ?? false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const padCell = density === 'compact' ? 'px-3 py-1.5 text-xs' : 'px-4 py-3 text-sm';
  const exportColumns = exportable?.columns ?? getExportColumns(columns);
  const exportFormats = exportable?.formats ?? ['csv', 'xlsx', 'json', 'pdf'];
  const exportScope = exportable?.scope ?? 'visible';
  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const visibleRows = table.getRowModel().rows.map((row) => row.original);
  const exportData =
    exportScope === 'selected' ? selectedRows : exportScope === 'all' ? data : visibleRows;

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)]',
        className,
      )}
    >
      {toolbar || exportable ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-3">
          <div>{toolbar}</div>
          {exportable ? (
            <ExportToolbar
              data={exportData}
              filename={exportable.filename ?? 'data'}
              formats={exportFormats}
              columns={exportColumns}
            />
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-bg-subtle)]/80 sticky top-0">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[var(--color-border)]">
                {hg.headers.map((header) => {
                  const sort = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  const headerContent = (
                    <>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sort === 'asc' ? '▲' : sort === 'desc' ? '▼' : null}
                    </>
                  );
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={cn(padCell, 'font-medium text-[var(--color-fg-muted)]')}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex cursor-pointer select-none items-center gap-1"
                        >
                          {headerContent}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">{headerContent}</div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={tableColumns.length} className={padCell}>
                  <SkeletonRow rows={5} />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={tableColumns.length} className="p-8">
                  <EmptyState
                    title={emptyTitle}
                    {...(emptyDescription ? { description: emptyDescription } : {})}
                  />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-subtle)]',
                    onRowClick && 'cursor-pointer',
                  )}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={padCell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] p-3 text-xs">
        <span className="text-[var(--color-fg-muted)]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-[var(--color-border-strong)] px-2 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border border-[var(--color-border-strong)] px-2 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function DataTableWithFilters<TData extends object>({
  filters,
  toolbar,
  data,
  onRowClick,
  ...props
}: DataTableProps<TData> & { filters: DataTableFilters<TData> }) {
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
      <DataTableBase
        data={visibleData}
        toolbar={toolbar ?? <FilterBar />}
        {...(onRowClick ? { onRowClick } : {})}
        {...props}
      />
    </FiltersProvider>
  );
}

export function DataTable<TData extends object>(props: DataTableProps<TData>) {
  if (props.filters) return <DataTableWithFilters {...props} filters={props.filters} />;
  return <DataTableBase {...props} />;
}
