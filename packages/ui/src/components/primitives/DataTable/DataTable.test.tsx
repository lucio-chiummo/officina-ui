import type { ColumnDef } from '@tanstack/react-table';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { FilterFieldDef } from '@/lib/filters';

import { toCsv } from './csv';
import { DataTable } from './DataTable';

type Row = { id: number; name: string };
const data: Row[] = [
  { id: 1, name: 'Bravo' },
  { id: 2, name: 'Alpha' },
  { id: 3, name: 'Charlie' },
];
const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
];
const filterFields: FilterFieldDef<Row>[] = [{ id: 'name', label: 'Name', type: 'string' }];

function mockCsvDownload() {
  const createObjectURL = vi.fn((blob: Blob) => {
    void blob;
    return 'blob:table';
  });
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  return createObjectURL;
}

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'));
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsText(blob);
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DataTable', () => {
  it('renders rows and supports sort by clicking header', async () => {
    const user = userEvent.setup();
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getAllByRole('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /name/i }));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Alpha');
  });

  it('shows empty state when data is empty', () => {
    render(<DataTable data={[]} columns={columns} emptyTitle="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('applies universal filters in client mode before pagination', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={data}
        columns={columns}
        filters={{ fields: filterFields, mode: 'client' }}
        pageSize={1}
      />,
    );

    await user.click(screen.getByRole('button', { name: /add filter/i }));
    const nameButtons = screen.getAllByRole('button', { name: 'Name' });
    await user.click(nameButtons[nameButtons.length - 1]!);
    await user.type(screen.getByLabelText('Name value'), 'Alpha');

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Bravo')).not.toBeInTheDocument();
  });

  it('emits universal filter query params in server mode', async () => {
    const user = userEvent.setup();
    const onServerQueryChange = vi.fn();
    render(
      <DataTable
        data={data}
        columns={columns}
        filters={{ fields: filterFields, mode: 'server', onServerQueryChange }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /add filter/i }));
    const nameButtons = screen.getAllByRole('button', { name: 'Name' });
    await user.click(nameButtons[nameButtons.length - 1]!);
    await user.type(screen.getByLabelText('Name value'), 'Alpha');

    await waitFor(() => {
      const lastCall = onServerQueryChange.mock.lastCall?.[0] as URLSearchParams | undefined;
      expect(lastCall?.get('name__contains')).toBe('Alpha');
    });
  });

  it('exports visible rows from the current page', async () => {
    const user = userEvent.setup();
    const createObjectURL = mockCsvDownload();
    render(
      <DataTable
        data={data}
        columns={columns}
        pageSize={1}
        exportable={{ filename: 'rows', formats: ['csv'] }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /export/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'CSV' }));

    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    const blob = createObjectURL.mock.calls[0]![0];
    await expect(readBlob(blob)).resolves.toBe('ID,Name\n1,Bravo');
  });

  it('exports selected rows and disables export with no selection', async () => {
    const user = userEvent.setup();
    const createObjectURL = mockCsvDownload();
    render(
      <DataTable
        enableRowSelection
        data={data}
        columns={columns}
        exportable={{ filename: 'selected', formats: ['csv'], scope: 'selected' }}
      />,
    );

    expect(screen.getByRole('button', { name: /export/i })).toBeDisabled();
    await user.click(screen.getAllByLabelText('Select row')[1]!);
    await user.click(screen.getByRole('button', { name: /export/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'CSV' }));

    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    const blob = createObjectURL.mock.calls[0]![0];
    await expect(readBlob(blob)).resolves.toBe('ID,Name\n2,Alpha');
  });
});

describe('toCsv', () => {
  it('escapes quotes/commas/newlines and joins rows', () => {
    const csv = toCsv(
      [
        { a: 'hi', b: 'a,b' },
        { a: 'q"', b: 'line\nbreak' },
      ],
      ['a', 'b'],
    );
    expect(csv).toBe('a,b\nhi,"a,b"\n"q""","line\nbreak"');
  });
});
