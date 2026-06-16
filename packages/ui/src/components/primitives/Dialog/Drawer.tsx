/**
 * Drawer — slide-in panel from the right edge.
 * Why: PLAN.md §3.3 / §9.3. Used for create/edit user, etc.
 */
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { Fragment, useCallback, useEffect, useRef, type ReactNode } from 'react';

export type DrawerProps = {
  /** Whether the drawer is open (controlled). */
  open: boolean;
  /** Called when the drawer requests to close (backdrop, escape, close button). */
  onClose: () => void;
  /** Drawer heading. */
  title: string;
  /** Optional supporting text below the title. */
  description?: string;
  /** Drawer body content. */
  children: ReactNode;
  /** Panel width preset. Defaults to `'md'`. */
  width?: 'sm' | 'md' | 'lg';
};

const WIDTH = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg' } as const;

export function Drawer({ open, onClose, title, description, children, width = 'md' }: DrawerProps) {
  const closingRef = useRef(false);
  const ignoreInitialCloseRef = useRef(false);
  const requestClose = useCallback(
    (force = false) => {
      if (!force && ignoreInitialCloseRef.current) return;
      if (closingRef.current) return;
      closingRef.current = true;
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
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </TransitionChild>
        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel
              className={cn(
                'flex w-full flex-col bg-[var(--color-bg-base)] shadow-xl',
                'h-full max-h-[100dvh]',
                WIDTH[width],
              )}
            >
              <header className="border-b border-[var(--color-border)] px-6 py-4">
                <DialogTitle className="text-base font-semibold text-[var(--color-fg-base)]">
                  {title}
                </DialogTitle>
                {description ? (
                  <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{description}</p>
                ) : null}
              </header>
              <div
                className="flex-1 overflow-y-auto px-4 py-4 sm:px-6"
                style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
              >
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
