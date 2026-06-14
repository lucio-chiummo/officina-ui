import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { type ReactNode } from 'react';

export type TabItem = {
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
};

export type TabsProps = {
  /** Tab definitions; each provides a label and panel content. */
  items: TabItem[];
  /** Initially selected tab index when uncontrolled. */
  defaultIndex?: number;
  /** Controlled selected tab index. */
  selectedIndex?: number;
  /** Called with the newly selected index. */
  onChange?: (index: number) => void;
  className?: string;
  /** Visual style of the tab strip. */
  variant?: 'underline' | 'pills';
};

export function Tabs({
  items,
  defaultIndex,
  selectedIndex,
  onChange,
  className,
  variant = 'underline',
}: TabsProps) {
  const tabGroupProps = {
    ...(defaultIndex !== undefined ? { defaultIndex } : {}),
    ...(selectedIndex !== undefined ? { selectedIndex } : {}),
    ...(onChange !== undefined ? { onChange } : {}),
  };

  return (
    <TabGroup {...tabGroupProps} className={cn('w-full', className)}>
      <TabList
        className={cn(
          'flex gap-1',
          variant === 'underline'
            ? 'border-b border-[var(--color-border)]'
            : 'rounded-lg bg-[var(--color-bg-muted)] p-1',
        )}
      >
        {items.map((item) => (
          <Tab
            key={item.label}
            {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
            className={({ selected }) =>
              cn(
                'group relative flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm font-medium',
                'transition-[color,background-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
                'active:scale-[0.99]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                variant === 'underline'
                  ? cn(
                      '-mb-px border-b-2',
                      selected
                        ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg-base)]',
                    )
                  : cn(
                      'rounded-md',
                      selected
                        ? 'bg-[var(--color-bg-base)] text-[var(--color-fg-base)] shadow-[var(--shadow-sm)]'
                        : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-base)]',
                    ),
              )
            }
          >
            {item.icon ? (
              <span className="inline-flex shrink-0 items-center text-current">{item.icon}</span>
            ) : null}
            {item.label}
            {item.badge != null && (
              <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-[var(--color-bg-muted)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-fg-muted)]">
                {item.badge}
              </span>
            )}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-4">
        {items.map((item) => (
          <TabPanel key={item.label} className="focus:outline-none">
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
