'use client';

import {
  ColumnsToggle,
  DataGrid,
  DataTable,
  FacetedFilter,
  SavedViews,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from '@officina/ui';
import { type ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

type Row = { id: string; name: string; status: string };

const statusOptions = [
  { value: 'live', label: 'Live' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

function useDemoTable() {
  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'status', header: 'Status' },
    ],
    [],
  );
  const table = useReactTable({
    data: [{ id: '1', name: 'Officina', status: 'Live' }],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return { columns, table };
}

export function DataTableDemo() {
  const { columns } = useDemoTable();
  return (
    <DataTable
      columns={columns}
      data={[
        { id: '1', name: 'Officina', status: 'Live' },
        { id: '2', name: 'Template', status: 'Draft' },
      ]}
      density="compact"
      pageSize={2}
      exportable={{ filename: 'primitive-table', formats: ['csv'] }}
    />
  );
}

export function DataGridDemo() {
  const { columns } = useDemoTable();
  const [rows, setRows] = useState<Row[]>([
    { id: '1', name: 'Officina', status: 'Live' },
    { id: '2', name: 'Template', status: 'Draft' },
  ]);
  return (
    <DataGrid
      data={rows}
      columns={columns}
      editableColumns={['name', 'status']}
      pageSize={2}
      density="compact"
      onCellChange={(rowIndex, columnId, value) =>
        setRows((prev) =>
          prev.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)),
        )
      }
    />
  );
}

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Pro</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Starter</TableCell>
          <TableCell>Trial</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export function TableToolbarDemo() {
  const { table } = useDemoTable();
  const [search, setSearch] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  return (
    <TableToolbar
      search={{ value: search, onChange: setSearch, placeholder: 'Search table' }}
      filters={
        <FacetedFilter
          label="Status"
          options={statusOptions}
          value={multi}
          onChange={setMulti}
          showSearch
        />
      }
      columnsToggle={<ColumnsToggle table={table} />}
    />
  );
}

export function ColumnsToggleDemo() {
  const { table } = useDemoTable();
  return <ColumnsToggle table={table} />;
}

export function SavedViewsDemo() {
  const [savedView, setSavedView] = useState<string | null>(null);
  return (
    <SavedViews
      storageKey="primitive-views"
      value={savedView}
      onChange={(view) => setSavedView(view?.id ?? null)}
      currentFilters={{ status: 'live' }}
    />
  );
}
