/**
 * Sheet — bottom-sheet on mobile, centered modal on desktop.
 * Mostly used for short forms / confirmations that need more space than ConfirmDialog.
 */
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Sheet({ open, onClose, title, children }: SheetProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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
        <div className="fixed inset-0 flex items-end justify-center sm:items-center">
          <TransitionChild
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="translate-y-full sm:translate-y-2 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full sm:translate-y-2 opacity-0"
          >
            <DialogPanel
              className="w-full max-w-md rounded-t-xl bg-[var(--color-bg-base)] p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-xl sm:p-6"
              style={{ maxHeight: 'calc(100dvh - 4rem)' }}
            >
              <DialogTitle className="text-base font-semibold text-[var(--color-fg-base)]">
                {title}
              </DialogTitle>
              <div className="mt-4 overflow-y-auto">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
