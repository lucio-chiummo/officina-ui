import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { ChevronDown } from 'lucide-react';
import { type ReactNode } from 'react';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  /** Panel definitions. */
  items: AccordionItem[];
  /** Ids of panels open on first render. */
  defaultOpenIds?: string[];
  /** Allow more than one panel open at a time. */
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenIds = [],
  allowMultiple = true,
  className,
}: AccordionProps) {
  const rootClassName = cn(
    'space-y-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-2',
    className,
  );

  if (allowMultiple) {
    return (
      <div className={rootClassName}>
        {items.map((item) => (
          <Disclosure key={item.id} defaultOpen={defaultOpenIds.includes(item.id)}>
            {({ open }) => (
              <div
                className={cn(
                  'overflow-hidden rounded-md border border-transparent transition-[background-color,border-color,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-standard)]',
                  open
                    ? 'border-[var(--color-border)] bg-[var(--color-bg-muted)]/45 shadow-[var(--shadow-xs)]'
                    : 'hover:bg-[var(--color-bg-muted)]/55',
                )}
              >
                <DisclosureButton
                  disabled={Boolean(item.disabled)}
                  className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[var(--color-fg-base)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{item.title}</span>
                  <span className="grid size-7 place-items-center rounded-full text-[var(--color-fg-muted)] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:bg-[var(--color-bg-base)] group-hover:text-[var(--color-fg-base)]">
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        'size-4 transition-transform duration-[var(--motion-base)] ease-[var(--ease-emphasized)]',
                        open && 'rotate-180 text-[var(--color-accent)]',
                      )}
                    />
                  </span>
                </DisclosureButton>
                <Transition
                  show={open}
                  enter="transition duration-[var(--motion-base)] ease-[var(--ease-standard)]"
                  enterFrom="-translate-y-1 opacity-0"
                  enterTo="translate-y-0 opacity-100"
                  leave="transition duration-[var(--motion-fast)] ease-[var(--ease-standard)]"
                  leaveFrom="translate-y-0 opacity-100"
                  leaveTo="-translate-y-1 opacity-0"
                >
                  <DisclosurePanel
                    static
                    className="border-t border-[var(--color-border)] px-4 pt-3 pb-4 text-sm leading-6 text-[var(--color-fg-muted)]"
                  >
                    {item.content}
                  </DisclosurePanel>
                </Transition>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      {items.map((item, index) => (
        <Disclosure
          key={item.id}
          defaultOpen={
            defaultOpenIds.includes(item.id) || (defaultOpenIds.length === 0 && index === 0)
          }
        >
          {({ open, close }) => (
            <div
              className={cn(
                'overflow-hidden rounded-md border border-transparent transition-[background-color,border-color,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-standard)]',
                open
                  ? 'border-[var(--color-border)] bg-[var(--color-bg-muted)]/45 shadow-[var(--shadow-xs)]'
                  : 'hover:bg-[var(--color-bg-muted)]/55',
              )}
            >
              <DisclosureButton
                disabled={Boolean(item.disabled)}
                onClick={() => {
                  if (!open) {
                    for (const button of document.querySelectorAll<HTMLButtonElement>(
                      '[data-accordion-button="true"][aria-expanded="true"]',
                    ))
                      button.click();
                  } else close();
                }}
                data-accordion-button="true"
                className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[var(--color-fg-base)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{item.title}</span>
                <span className="grid size-7 place-items-center rounded-full text-[var(--color-fg-muted)] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:bg-[var(--color-bg-base)] group-hover:text-[var(--color-fg-base)]">
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-4 transition-transform duration-[var(--motion-base)] ease-[var(--ease-emphasized)]',
                      open && 'rotate-180 text-[var(--color-accent)]',
                    )}
                  />
                </span>
              </DisclosureButton>
              <Transition
                show={open}
                enter="transition duration-[var(--motion-base)] ease-[var(--ease-standard)]"
                enterFrom="-translate-y-1 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transition duration-[var(--motion-fast)] ease-[var(--ease-standard)]"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="-translate-y-1 opacity-0"
              >
                <DisclosurePanel
                  static
                  className="border-t border-[var(--color-border)] px-4 pt-3 pb-4 text-sm leading-6 text-[var(--color-fg-muted)]"
                >
                  {item.content}
                </DisclosurePanel>
              </Transition>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
