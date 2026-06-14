import type { ExportColumn } from './types';

import { exportRows } from './types';

export function exportJson<T extends object>(
  data: T[],
  filename: string,
  columns?: ExportColumn<T>[],
): void {
  const payload = columns?.length ? exportRows(data, columns) : data;
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
