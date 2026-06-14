import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

export type BannerProps = {
  /** Semantic colour of the banner. */
  tone: 'info' | 'success' | 'warning' | 'danger';
  /** Bold leading title. */
  title?: string;
  /** Banner message body. */
  children: ReactNode;
  /** Called when the dismiss button is clicked; omit to hide it. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
  /** Custom leading icon; defaults to a tone-appropriate icon. */
  icon?: ReactNode;
  /** Trailing action buttons. */
  actions?: ReactNode;
  /** Stretch edge-to-edge with no rounded corners. */
  full?: boolean;
  className?: string;
};

const toneClass = {
  info: 'bg-[var(--color-info-muted)] text-[var(--color-info-fg)] border-[var(--color-info)]',
  success:
    'bg-[var(--color-success-muted)] text-[var(--color-success-fg)] border-[var(--color-success)]',
  warning:
    'bg-[var(--color-warning-muted)] text-[var(--color-warning-fg)] border-[var(--color-warning)]',
  danger:
    'bg-[var(--color-danger-muted)] text-[var(--color-danger-fg)] border-[var(--color-danger)]',
};

const icons = {
  info: <Info className="size-4" />,
  success: <CheckCircle2 className="size-4" />,
  warning: <TriangleAlert className="size-4" />,
  danger: <AlertCircle className="size-4" />,
};

export function Banner({
  tone,
  title,
  children,
  onDismiss,
  dismissLabel = 'Dismiss',
  icon,
  actions,
  full,
  className,
}: BannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 border p-3 text-sm',
        full ? 'rounded-none' : 'rounded-[var(--radius-lg)]',
        toneClass[tone],
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{icon ?? icons[tone]}</span>
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="rounded p-1 hover:bg-black/10"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
