import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
import { AlertCircle, CheckCircle2, File as FileIcon, RotateCw, X } from 'lucide-react';

import { Spinner } from '../Spinner';

export type FileItemStatus = 'idle' | 'uploading' | 'success' | 'error';

export type FileItemProps = {
  /** File name shown as the primary label. */
  name: string;
  /** Size in bytes. Rendered as a human-readable label. */
  size?: number;
  /** Current upload state — drives the status icon and styling. */
  status?: FileItemStatus;
  /** Upload progress 0–100. Shown as a thin bar when `status` is `uploading`. */
  progress?: number;
  /** Error message shown when `status` is `error`. */
  error?: string;
  /** Leading icon; defaults to a file-type glyph. */
  icon?: ReactNode;
  /** Called when the remove button is clicked. Omit to hide it. */
  onRemove?: () => void;
  /** Called when the retry button is clicked (shown on error). */
  onRetry?: () => void;
  /** Extra classes for the row container. */
  className?: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

/**
 * Reusable file row with name, size, progress, status, and remove/retry
 * actions. Transport-free — the parent owns upload state and callbacks.
 */
export function FileItem({
  name,
  size,
  status = 'idle',
  progress,
  error,
  icon,
  onRemove,
  onRetry,
  className,
}: FileItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3 py-2',
        status === 'error' && 'border-[var(--color-danger-muted)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)] [&>svg]:size-4"
      >
        {icon ?? <FileIcon />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-[var(--color-fg-base)]">{name}</p>
          {size !== undefined ? (
            <span className="shrink-0 text-xs text-[var(--color-fg-subtle)]">
              {formatBytes(size)}
            </span>
          ) : null}
        </div>
        {status === 'uploading' && progress !== undefined ? (
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-[var(--motion-base)]"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        ) : null}
        {status === 'error' && error ? (
          <p className="mt-0.5 truncate text-xs text-[var(--color-danger-fg)]">{error}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {status === 'uploading' ? <Spinner size="xs" /> : null}
        {status === 'success' ? (
          <CheckCircle2 aria-label="Uploaded" className="size-4 text-[var(--color-success-fg)]" />
        ) : null}
        {status === 'error' ? (
          <AlertCircle aria-label="Failed" className="size-4 text-[var(--color-danger-fg)]" />
        ) : null}
        {status === 'error' && onRetry ? (
          <button
            type="button"
            aria-label="Retry"
            onClick={onRetry}
            className="inline-flex size-6 items-center justify-center rounded text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <RotateCw className="size-3.5" />
          </button>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            aria-label="Remove"
            onClick={onRemove}
            className="inline-flex size-6 items-center justify-center rounded text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
