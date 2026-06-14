import type { ReactNode } from 'react';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

export type CollapsibleProps = {
  /** Clickable header that toggles the panel. */
  title: ReactNode;
  /** Collapsible content. */
  children: ReactNode;
  /** Whether the panel starts open. */
  defaultOpen?: boolean;
};

export function Collapsible({ title, children, defaultOpen }: CollapsibleProps) {
  return (
    <Disclosure {...(defaultOpen !== undefined ? { defaultOpen } : {})}>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <DisclosureButton className="group flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium">
          {title}
          <ChevronDown className="size-4 transition-transform group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="border-t border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-fg-muted)]">
          {children}
        </DisclosurePanel>
      </div>
    </Disclosure>
  );
}
