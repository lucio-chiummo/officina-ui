import type { ExportColumn } from '@/lib/export/types';

import { formatExportValue, getExportHeader, normalizeExportColumns } from '@/lib/export/types';

/**
 * Tiny CSV exporter — no third-party dep.
 */
export function toCsv<T extends object>(
  rows: T[],
  columns: ExportColumn<T>[] | (keyof T & string)[],
): string {
  const exportColumns = normalizeExportColumns(columns);
  const escape = (value: string): string => {
    if (value === null || value === undefined) return '';
    if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
    return value;
  };
  const header = exportColumns.map((column) => escape(getExportHeader(column))).join(',');
  const body = rows
    .map((row) => exportColumns.map((column) => escape(formatExportValue(row, column))).join(','))
    .join('\n');
  return `${header}\n${body}`;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
