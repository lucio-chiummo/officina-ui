import { useCopyToClipboard } from '@hooks/useCopyToClipboard';
import { cn } from '@lib/utils/cn';
import { Check, Copy } from 'lucide-react';
import { type ReactNode } from 'react';

import { IconButton } from '../Button';

export type CopyFieldProps = {
  /** The exact string written to the clipboard. */
  value: string;
  /** Optional display override (e.g. masked or formatted). Defaults to `value`. */
  displayValue?: ReactNode;
  /** Field label rendered above the value. */
  label?: ReactNode;
  /** Truncate the displayed value with an ellipsis when it overflows. */
  truncate?: boolean;
  /** Render the value in a monospace font. */
  monospace?: boolean;
  /** Control size. Defaults to `'md'`. */
  size?: 'sm' | 'md';
  /** Accessible label for the copy button before copying. */
  copyLabel?: string;
  /** Accessible label/feedback shown right after copying. */
  copiedLabel?: string;
  /** Extra classes for the field wrapper. */
  className?: string;
};

/**
 * Read-only value with an inline copy action, truncation, and a hover tooltip
 * on the copy button. Transport-free — copies via the clipboard API only.
 */
export function CopyField({
  value,
  displayValue,
  label,
  truncate = true,
  monospace = true,
  size = 'md',
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  className,
}: CopyFieldProps) {
  const { copied, copy } = useCopyToClipboard(1500);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label ? (
        <span className="text-xs font-medium text-[var(--color-fg-muted)]">{label}</span>
      ) : null}
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-muted)] pl-3',
          size === 'sm' ? 'h-8 pr-1' : 'h-9 pr-1',
        )}
      >
        <span
          title={typeof displayValue === 'string' || displayValue == null ? value : undefined}
          className={cn(
            'min-w-0 flex-1 text-sm text-[var(--color-fg-base)]',
            truncate && 'truncate',
            monospace && 'font-mono text-xs',
          )}
        >
          {displayValue ?? value}
        </span>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label={copied ? copiedLabel : copyLabel}
          tooltip={copied ? copiedLabel : copyLabel}
          onClick={() => void copy(value)}
          icon={copied ? <Check className="text-[var(--color-success-fg)]" /> : <Copy />}
        />
      </div>
    </div>
  );
}
