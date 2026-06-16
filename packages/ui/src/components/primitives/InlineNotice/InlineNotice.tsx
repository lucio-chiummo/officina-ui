import { cn } from '@lib/utils/cn';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';

export type InlineNoticeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const toneClass: Record<InlineNoticeTone, string> = {
  info: 'text-[var(--color-info-fg)]',
  success: 'text-[var(--color-success-fg)]',
  warning: 'text-[var(--color-warning-fg)]',
  danger: 'text-[var(--color-danger-fg)]',
  neutral: 'text-[var(--color-fg-muted)]',
};

const ICONS: Record<InlineNoticeTone, typeof Info | null> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
  neutral: null,
};

export type InlineNoticeProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** Semantic tone driving color and default icon. Defaults to `'info'`. */
  tone?: InlineNoticeTone;
  /** Leading icon override; falls back to a tone-based default. */
  icon?: ReactNode;
  /** Trailing action node (e.g. a small Button or Link). */
  action?: ReactNode;
  /** Show a dismiss button. */
  dismissible?: boolean;
  /** Called when the dismiss button is clicked. */
  onDismiss?: () => void;
};

/**
 * Compact single-row feedback for forms and settings panels — lighter than
 * {@link Alert}. No border or fill by default, just toned text + icon.
 */
export function InlineNotice({
  tone = 'info',
  icon,
  action,
  dismissible,
  onDismiss,
  className,
  children,
  ...props
}: InlineNoticeProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const Icon = ICONS[tone];
  const showIcon = icon !== undefined ? icon : Icon ? <Icon className="size-4" /> : null;

  return (
    <div
      {...props}
      className={cn('flex items-center gap-2 text-xs leading-5', toneClass[tone], className)}
    >
      {showIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center [&>svg]:size-4">
          {showIcon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
      {action ? <span className="shrink-0">{action}</span> : null}
      {dismissible ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          className="shrink-0 rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
