import { afterEach, describe, expect, it, vi } from 'vitest';

import { toCsv } from '@/components/primitives/DataTable';

import { exportJson } from './json';
import { exportPdf } from './pdf';
import { stableStringify } from './types';
import { exportXlsx } from './xlsx';

const mocks = vi.hoisted(() => ({
  autoTable: vi.fn(),
  bookAppendSheet: vi.fn(),
  bookNew: vi.fn(() => ({ Sheets: {}, SheetNames: [] })),
  jsonToSheet: vi.fn((rows: unknown[]) => ({ rows })),
  pdfSave: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock('xlsx', () => ({
  utils: {
    book_append_sheet: mocks.bookAppendSheet,
    book_new: mocks.bookNew,
    json_to_sheet: mocks.jsonToSheet,
  },
  writeFile: mocks.writeFile,
}));

vi.mock('jspdf', () => ({
  default: vi.fn(() => ({ save: mocks.pdfSave })),
}));

vi.mock('jspdf-autotable', () => ({
  default: mocks.autoTable,
}));

type Row = {
  id: string;
  amount: number;
  meta: { b: number; a: number };
};

const rows: Row[] = [{ id: 'row,1', amount: 12.5, meta: { b: 2, a: 1 } }];

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('export helpers', () => {
  it('escapes CSV and applies headers, values, formatters, and stable JSON', () => {
    const csv = toCsv(rows, [
      { key: 'id', header: 'ID' },
      { key: 'amount', header: 'Total', format: (value) => `$${Number(value).toFixed(2)}` },
      { key: 'meta', header: 'Metadata' },
    ]);

    expect(csv).toBe('ID,Total,Metadata\n"row,1",$12.50,"{""a"":1,""b"":2}"');
    expect(stableStringify({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
  });

  it('shapes XLSX rows with human headers', () => {
    exportXlsx(rows, 'orders', [{ key: 'amount', header: 'Total' }]);

    expect(mocks.jsonToSheet).toHaveBeenCalledWith([{ Total: 12.5 }]);
    expect(mocks.writeFile).toHaveBeenCalledWith(expect.anything(), 'orders.xlsx');
  });

  it('downloads JSON with a json filename', () => {
    let download = '';
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const appendChild = document.body.appendChild.bind(document.body);
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      download = (node as HTMLAnchorElement).download;
      return appendChild(node);
    });
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:json'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });

    exportJson(rows, 'users', [{ key: 'id', header: 'ID' }]);

    expect(download).toBe('users.json');
    expect(click).toHaveBeenCalled();
  });

  it('passes formatted values to PDF export', () => {
    exportPdf(rows, 'report', [
      { key: 'amount', header: 'Total', format: (value) => `$${Number(value).toFixed(2)}` },
    ]);

    expect(mocks.autoTable).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: [['$12.50']],
        head: [['Total']],
      }),
    );
    expect(mocks.pdfSave).toHaveBeenCalledWith('report.pdf');
  });
});
