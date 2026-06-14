import { cn } from '@lib/utils/cn';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';

type FileUploadProps = Omit<DropzoneOptions, 'onDrop'> & {
  onFiles: (files: File[]) => void;
  activeLabel?: string;
  ariaLabel?: string;
  hint?: string;
  label?: string;
  className?: string;
};

export function FileUpload({
  onFiles,
  activeLabel = 'Drop files here...',
  ariaLabel = 'File upload area',
  hint,
  label = 'Click or drag files to upload',
  className,
  ...dropzone
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzone,
    onDrop: onFiles,
  });

  return (
    <>
      <input {...getInputProps({ 'aria-label': ariaLabel })} />
      <div
        {...getRootProps()}
        role="button"
        aria-label={ariaLabel}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
            : 'border-[var(--color-border-strong)] bg-[var(--color-bg-base)] hover:border-[var(--color-border-strong)]',
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
