import { utils, writeFile } from 'xlsx';

import type { ExportColumn } from './types';

import { exportRows } from './types';

function shapeRows<T extends object>(data: T[], columns?: ExportColumn<T>[]) {
  return columns?.length ? exportRows(data, columns) : data;
}

export function exportXlsx<T extends object>(
  data: T[],
  filename: string,
  columns?: ExportColumn<T>[],
): void {
  const worksheet = utils.json_to_sheet(shapeRows(data, columns));
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Export');
  writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}
