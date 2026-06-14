import type { ReactNode } from 'react';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { cn } from '@lib/utils/cn';

export type MegamenuColumn = {
  heading?: string;
  items: { label: string; description?: string; href: string; icon?: ReactNode }[];
};

type MegamenuProps = {
  /** Text label for the menu trigger. */
  trigger: string;
  /** Column groups of links shown in the open panel. */
  columns: MegamenuColumn[];
  /** Optional footer content below the columns. */
  footer?: ReactNode;
  /** Extra classes for the menu container. */
  className?: string;
};

export function Megamenu({ trigger, columns, footer, className }: MegamenuProps) {
  return (
    <Popover className={cn('relative', className)}>
      <PopoverButton className="rounded-md px-3 py-2 text-sm hover:bg-[var(--color-bg-muted)]">
        {trigger}
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="z-40 mt-2 w-[min(960px,90vw)] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] p-6 shadow-xl"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col, i) => (
            // eslint-disable-next-line react/no-array-index-key -- column order is the prop order
            <div key={i}>
              {col.heading ? (
                <div className="mb-2 text-xs font-semibold tracking-wider text-[var(--color-fg-muted)] uppercase">
                  {col.heading}
                </div>
              ) : null}
              <ul className="space-y-1">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-start gap-2 rounded-md p-2 text-sm hover:bg-[var(--color-bg-muted)]"
                    >
                      {item.icon}
                      <div>
                        <div className="font-medium text-[var(--color-fg-base)]">{item.label}</div>
                        {item.description ? (
                          <div className="text-xs text-[var(--color-fg-muted)]">
                            {item.description}
                          </div>
                        ) : null}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {footer ? (
          <div className="mt-4 border-t border-[var(--color-border)] pt-4">{footer}</div>
        ) : null}
      </PopoverPanel>
    </Popover>
  );
}
