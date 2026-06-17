/**
 * ConfirmDialog — destructive-action confirmation.
 * Why: PLAN.md §9.5/§9.6 — typed-confirm pattern for delete-team / danger-zone.
 */
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../Button';

export type ConfirmDialogProps = {
  /** Whether the dialog is visible (controlled). */
  open: boolean;
  /** Called when the dialog is dismissed or cancelled. */
  onClose: () => void;
  /** Called when the user confirms the action. */
  onConfirm: () => void;
  /** Dialog heading. */
  title: string;
  /** Body text explaining the consequence of confirming. */
  description: string;
  /** Label for the confirm button. Defaults to `'Confirm'`. */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to `'Cancel'`. */
  cancelLabel?: string;
  /** When set, user must type this value to enable the confirm button. */
  typeToConfirm?: string;
  /** Styles the confirm button as a destructive action. */
  destructive?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  typeToConfirm,
  destructive,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');
  const closingRef = useRef(false);
  const ignoreInitialCloseRef = useRef(false);
  const enabled = typeToConfirm === undefined || typed === typeToConfirm;
  const requestClose = useCallback(
    (force = false) => {
      if (!force && ignoreInitialCloseRef.current) return;
      if (closingRef.current) return;
      closingRef.current = true;
      setTyped('');
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;
    closingRef.current = false;
    ignoreInitialCloseRef.current = true;
    const timer = window.setTimeout(() => {
      ignoreInitialCloseRef.current = false;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => requestClose()} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </TransitionChild>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="transition duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md rounded-lg bg-[var(--color-bg-base)] p-6 shadow-xl">
              <DialogTitle className="text-base font-semibold text-[var(--color-fg-base)]">
                {title}
              </DialogTitle>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{description}</p>
              {typeToConfirm ? (
                <label className="mt-4 block text-sm">
                  <span className="text-[var(--color-fg-muted)]">
                    Type <code className="font-mono">{typeToConfirm}</code> to confirm
                  </span>
                  <input
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- destructive confirm requires immediate focus
                    autoFocus
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    className="mt-1 w-full rounded-md border border-[var(--color-border-strong)] px-3 py-2"
                  />
                </label>
              ) : null}
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => requestClose(true)}>
                  {cancelLabel}
                </Button>
                <Button
                  variant={destructive ? 'danger' : 'primary'}
                  disabled={!enabled}
                  onClick={() => {
                    setTyped('');
                    onConfirm();
                  }}
                >
                  {confirmLabel}
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
