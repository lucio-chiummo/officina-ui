import { cn } from '@lib/utils/cn';
import { AlertCircle, RotateCw, X } from 'lucide-react';

import { Spinner } from '../Spinner';

export type ImagePreviewStatus = 'idle' | 'uploading' | 'error';

export type ImagePreviewProps = {
  /** Image source URL or object URL. */
  src: string;
  /** Alt text for the thumbnail. */
  alt?: string;
  /** Optional file name shown as a caption/overlay. */
  name?: string;
  /** Current upload state — drives the overlay and styling. */
  status?: ImagePreviewStatus;
  /** Upload progress 0–100, shown over the thumbnail while `uploading`. */
  progress?: number;
  /** Called when the remove button is clicked. Omit to hide it. */
  onRemove?: () => void;
  /** Called when the retry button is clicked (shown on error). */
  onRetry?: () => void;
  /** Square edge length. Number → px, string → raw CSS size. */
  size?: number | string;
  /** Extra classes for the tile container. */
  className?: string;
};

/**
 * Single image preview tile with remove and retry actions plus uploading/error
 * overlays. Transport-free — the parent owns the object URL and callbacks.
 */
export function ImagePreview({
  src,
  alt = '',
  name,
  status = 'idle',
  progress,
  onRemove,
  onRetry,
  size = 96,
  className,
}: ImagePreviewProps) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)]',
        status === 'error' && 'border-[var(--color-danger-muted)]',
        className,
      )}
      style={{ width: dimension, height: dimension }}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="size-full object-cover" />

      {status === 'uploading' ? (
        <div className="bg-[var(--color-bg-base)]/65 absolute inset-0 flex flex-col items-center justify-center gap-1">
          <Spinner size="sm" />
          {progress !== undefined ? (
            <span className="text-[10px] font-medium text-[var(--color-fg-muted)]">
              {Math.round(progress)}%
            </span>
          ) : null}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="bg-[var(--color-danger-subtle)]/80 absolute inset-0 flex flex-col items-center justify-center gap-1 text-[var(--color-danger-fg)]">
          <AlertCircle className="size-5" />
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-[10px] font-semibold hover:underline focus-visible:outline-none"
            >
              <RotateCw className="size-3" />
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {onRemove ? (
        <button
          type="button"
          aria-label={name ? `Remove ${name}` : 'Remove image'}
          onClick={onRemove}
          className="bg-[var(--color-bg-base)]/90 absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full text-[var(--color-fg-muted)] opacity-0 shadow-[var(--shadow-sm)] transition-opacity hover:text-[var(--color-fg-base)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      ) : null}

      {name ? (
        <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/55 to-transparent px-1.5 py-1 text-[10px] font-medium text-white">
          {name}
        </span>
      ) : null}
    </div>
  );
}
