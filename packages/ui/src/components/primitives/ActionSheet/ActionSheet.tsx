import { Dialog as HeadlessDialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { type ReactNode } from 'react';

export type ActionSheetAction = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
};

export type ActionSheetProps = {
  /** Whether the sheet is visible. */
  open: boolean;
  /** Called when the sheet is dismissed. */
  onClose: () => void;
  /** Optional heading at the top of the sheet. */
  title?: string;
  /** Supporting text under the title. */
  description?: string;
  /** Action buttons rendered in the sheet. */
  actions: ActionSheetAction[];
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  className?: string;
};

/**
 * Mobile-first bottom sheet presenting a vertical list of actions.
 * Desktop renders the same sheet centered at the bottom with max width.
 */
export function ActionSheet({
  open,
  onClose,
  title,
  description,
  actions,
  cancelLabel = 'Cancel',
  className,
}: ActionSheetProps) {
  return (
    <HeadlessDialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end justify-center p-3 sm:p-4">
        <DialogPanel
          className={cn(
            'animate-slide-in-up w-full max-w-md rounded-2xl bg-[var(--color-bg-base)] shadow-[var(--shadow-lg)]',
            className,
          )}
        >
          {(title ?? description) ? (
            <div className="border-b border-[var(--color-border)] px-4 py-3 text-center">
              {title ? (
                <DialogTitle className="text-sm font-semibold text-[var(--color-fg-base)]">
                  {title}
                </DialogTitle>
              ) : null}
              {description ? (
                <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{description}</p>
              ) : null}
            </div>
          ) : null}
          <div className="p-2">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                disabled={Boolean(action.disabled)}
                onClick={() => {
                  action.onSelect();
                  onClose();
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors duration-[var(--motion-fast)]',
                  'focus-visible:ring-[var(--color-accent)]/40 focus-visible:outline-none focus-visible:ring-2',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                  action.tone === 'danger'
                    ? 'hover:bg-[var(--color-danger)]/8 text-[var(--color-danger)]'
                    : 'text-[var(--color-fg-base)] hover:bg-[var(--color-bg-subtle)]',
                )}
              >
                {action.icon ? <span className="shrink-0">{action.icon}</span> : null}
                {action.label}
              </button>
            ))}
          </div>
          <div className="border-t border-[var(--color-border)] p-2">
            <button
              type="button"
              onClick={onClose}
              className="focus-visible:ring-[var(--color-accent)]/40 w-full rounded-lg px-4 py-3 text-sm font-semibold text-[var(--color-fg-muted)] transition-colors duration-[var(--motion-fast)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2"
            >
              {cancelLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
}
