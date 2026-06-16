import type { ReactNode } from 'react';

import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ExportColumn } from '@/lib/export/types';

import { exportJson } from '@/lib/export/json';
import { exportPdf } from '@/lib/export/pdf';
import { exportXlsx } from '@/lib/export/xlsx';

import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { downloadCsv, toCsv } from './csv';

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';

type ExportToolbarProps<T extends object> = {
  /** Rows to export. */
  data: T[];
  /** Base filename (without extension) for the downloaded file. */
  filename: string;
  /** Export formats to offer (e.g. CSV, JSON). */
  formats: ExportFormat[];
  /** Column definitions controlling which fields and headers are exported. */
  columns: ExportColumn<T>[];
};

const iconClassName = 'size-4';

const defaultFormatLabels: Record<ExportFormat, string> = {
  csv: 'CSV',
  xlsx: 'Excel',
  json: 'JSON',
  pdf: 'PDF',
};

export function ExportToolbar<T extends object>({
  data,
  filename,
  formats,
  columns,
}: ExportToolbarProps<T>) {
  const { t } = useTranslation();
  const disabled = !data.length || !columns.length;

  const handlers: Record<ExportFormat, () => void> = {
    csv: () => downloadCsv(`${filename}.csv`, toCsv(data, columns)),
    json: () => exportJson(data, filename, columns),
    pdf: () => exportPdf(data, filename, columns),
    xlsx: () => exportXlsx(data, filename, columns),
  };

  const icons: Record<ExportFormat, ReactNode> = {
    csv: <FileText className={iconClassName} aria-hidden="true" />,
    json: <FileJson className={iconClassName} aria-hidden="true" />,
    pdf: <FileText className={iconClassName} aria-hidden="true" />,
    xlsx: <FileSpreadsheet className={iconClassName} aria-hidden="true" />,
  };

  return (
    <Dropdown
      trigger={
        <Button size="sm" variant="secondary" disabled={disabled}>
          <Download className="size-4" aria-hidden="true" />
          {t('dataTable.export', 'Export')}
        </Button>
      }
      sections={[
        {
          items: formats.map((format) => ({
            disabled,
            icon: icons[format],
            label: t(`dataTable.exportFormats.${format}`, defaultFormatLabels[format]),
            onClick: handlers[format],
          })),
        },
      ]}
    />
  );
}
