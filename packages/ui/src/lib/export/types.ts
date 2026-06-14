export type ExportColumn<T> = {
  key: keyof T & string;
  header?: string;
  value?: (row: T) => unknown;
  format?: (value: unknown, row: T) => string;
};

export type ExportCellValue = string | number | boolean | null;

export function stableStringify(value: unknown): string {
  if (value === undefined) return 'null';
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return `{${entries
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`)
      .join(',')}}`;
  }
  if (typeof value === 'symbol') return JSON.stringify(value.toString());
  if (typeof value === 'bigint') return JSON.stringify(value.toString());
  if (typeof value === 'function') return JSON.stringify(value.name || 'function');
  return JSON.stringify(value);
}

export function normalizeExportColumns<T extends object>(
  columns: ExportColumn<T>[] | (keyof T & string)[],
): ExportColumn<T>[] {
  return columns.map<ExportColumn<T>>((column) =>
    typeof column === 'string' ? { key: column } : column,
  );
}

export function getExportHeader<T>(column: ExportColumn<T>): string {
  return column.header ?? column.key;
}

export function getExportValue<T extends object>(row: T, column: ExportColumn<T>): unknown {
  const value = column.value?.(row) ?? row[column.key];
  return column.format ? column.format(value, row) : value;
}

export function serializeExportValue(value: unknown): ExportCellValue {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'bigint') return value.toString();
  return stableStringify(value);
}

export function exportRows<T extends object>(
  rows: T[],
  columns: ExportColumn<T>[],
): Record<string, ExportCellValue>[] {
  return rows.map((row) =>
    Object.fromEntries(
      columns.map((column) => [
        getExportHeader(column),
        serializeExportValue(getExportValue(row, column)),
      ]),
    ),
  );
}

export function formatExportValue<T extends object>(row: T, column: ExportColumn<T>): string {
  const value = serializeExportValue(getExportValue(row, column));
  return value === null ? '' : String(value);
}
