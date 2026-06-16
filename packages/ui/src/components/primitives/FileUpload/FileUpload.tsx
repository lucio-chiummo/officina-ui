import type { FocusEventHandler } from 'react';

import { cn } from '@lib/utils/cn';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';

export type FileUploadProps = Omit<DropzoneOptions, 'onDrop'> & {
  onFiles: (files: File[]) => void;
  activeLabel?: string;
  ariaLabel?: string;
  hint?: string;
  label?: string;
  className?: string;
  /** Element id, applied to the focusable drop zone. */
  id?: string;
  /** Form field name, applied to the underlying file input. */
  name?: string;
  /** Marks the underlying file input as required for native form validation. */
  required?: boolean;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Id(s) of element(s) describing the field (helper/error text). */
  'aria-describedby'?: string;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  onFocus?: FocusEventHandler<HTMLDivElement>;
};

export function FileUpload({
  onFiles,
  activeLabel = 'Drop files here...',
  ariaLabel = 'File upload area',
  hint,
  label = 'Click or drag files to upload',
  className,
  id,
  name,
  required,
  invalid,
  'aria-describedby': ariaDescribedBy,
  onBlur,
  onFocus,
  ...dropzone
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzone,
    onDrop: onFiles,
  });

  return (
    <>
      <input {...getInputProps({ name, required, 'aria-label': ariaLabel })} />
      <div
        {...getRootProps({ onBlur, onFocus })}
        id={id}
        role="button"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
            : 'border-[var(--color-border-strong)] bg-[var(--color-bg-base)] hover:border-[var(--color-border-strong)]',
          invalid && 'border-[var(--color-danger)]',
          className,
        )}
      >
        <span aria-hidden="true" className="text-2xl text-[var(--color-fg-subtle)]">
          ↑
        </span>
        <p className="text-sm text-[var(--color-fg-muted)]">{isDragActive ? activeLabel : label}</p>
        {hint ? <p className="text-xs text-[var(--color-fg-muted)]">{hint}</p> : null}
      </div>
    </>
  );
}
