import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { type ComponentPropsWithoutRef, useState } from 'react';

const alertVariants = cva('flex gap-3 rounded-md border px-3.5 py-3 text-sm', {
  variants: {
    variant: {
      info: 'border-[var(--color-info-muted)] bg-[var(--color-info-subtle)] text-[var(--color-info-fg)]',
      success:
        'border-[var(--color-success-muted)] bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
      warning:
        'border-[var(--color-warning-muted)] bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)]',
      danger:
        'border-[var(--color-danger-muted)] bg-[var(--color-danger-subtle)] text-[var(--color-danger-fg)]',
    },
  },
  defaultVariants: { variant: 'info' },
});

const ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
};

export type AlertProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof alertVariants> & {
    /** Bold heading shown above the message. */
    title?: string;
    /** Show a close button that hides the alert. */
    dismissible?: boolean;
  };

export function Alert({
  className,
  variant = 'info',
  title,
  dismissible,
  children,
  ...props
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const Icon = ICONS[variant ?? 'info'];

  return (
    <div role="alert" {...props} className={cn(alertVariants({ variant }), className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        {children && <div className="text-[0.8rem] opacity-90">{children}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
