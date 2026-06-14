import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { ExportColumn } from './types';

import { formatExportValue, getExportHeader } from './types';

export function exportPdf<T extends object>(
  data: T[],
  filename: string,
  columns: ExportColumn<T>[],
): void {
  const document = new jsPDF();
  autoTable(document, {
    body: data.map((row) => columns.map((column) => formatExportValue(row, column))),
    head: [columns.map((column) => getExportHeader(column))],
  });
  document.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
