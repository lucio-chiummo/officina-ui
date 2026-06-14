import { cn } from '@lib/utils/cn';
import { X } from 'lucide-react';
import { useEffect, useId, type ReactNode } from 'react';

import { Backdrop } from '../Backdrop';
import { Button } from '../Button';
import { Portal } from '../Portal';

export type ModalProps = {
  /** Dialog body content. */
  children: ReactNode;
  className?: string;
  /** Supporting text rendered under the title. */
  description?: ReactNode;
  /** Called when the user dismisses the modal (overlay click, Esc, close button). */
  onClose: () => void;
  /** Whether the modal is visible. */
  open: boolean;
  /** Heading shown at the top of the dialog. */
  title?: ReactNode;
};

export function Modal({ children, className, description, onClose, open, title }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <Portal>
      <Backdrop open />
      <div className="fixed inset-0 z-50 grid place-items-center p-4">
        <div
          aria-describedby={description ? descriptionId : undefined}
          aria-labelledby={title ? titleId : undefined}
          aria-modal="true"
          role="dialog"
          className={cn(
            'max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow-[var(--shadow-xl)]',
            className,
          )}
        >
          {(title || description) && (
            <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-4 py-3">
              <div className="min-w-0">
                {title ? (
                  <h2 id={titleId} className="text-sm font-semibold text-[var(--color-fg-base)]">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p id={descriptionId} className="mt-1 text-xs text-[var(--color-fg-muted)]">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button size="icon-sm" variant="ghost" aria-label="Close modal" onClick={onClose}>
                <X className="size-4" aria-hidden="true" />
              </Button>
            </header>
          )}
          <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </Portal>
  );
}
