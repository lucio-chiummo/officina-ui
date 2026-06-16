import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSection,
  MenuHeading,
  MenuSeparator,
} from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { Fragment, type ReactNode } from 'react';

export type DropdownItem = {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
};

export type DropdownSection = {
  heading?: string;
  items: DropdownItem[];
};

export type DropdownProps = {
  /** Element that opens the dropdown when activated. */
  trigger: ReactNode;
  /** Grouped menu items, optionally with section headings. */
  sections: DropdownSection[];
  /** Menu alignment relative to the trigger. Defaults to `'start'`. */
  align?: 'start' | 'end';
  /** Extra classes for the menu panel. */
  className?: string;
};

export function Dropdown({ trigger, sections, align = 'end', className }: DropdownProps) {
  return (
    <Menu as="div" className={cn('relative inline-block', className)}>
      <MenuButton as={Fragment}>{trigger}</MenuButton>

      <MenuItems
        anchor={{ to: `bottom ${align}`, gap: 6 }}
        className={cn(
          'z-[9997] min-w-[180px] rounded-[var(--radius-md)] border border-[var(--color-border-strong)]',
          'bg-[var(--color-bg-base)] p-1 shadow-[var(--shadow-xl)]',
          'focus:outline-none',
          'transition-opacity duration-[var(--motion-base)] ease-[var(--ease-standard)]',
          'data-[closed]:opacity-0',
        )}
        transition
      >
        {sections.map((section, si) => (
          <MenuSection
            key={section.heading ?? `section-${section.items.map((item) => item.label).join('-')}`}
          >
            {section.heading && (
              <MenuHeading className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
                {section.heading}
              </MenuHeading>
            )}
            {section.items.map((item) => (
              <MenuItem
                key={item.label}
                {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
              >
                {({ focus }) => {
                  const base = cn(
                    'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium',
                    'transition-colors duration-[var(--duration-fast)] cursor-pointer',
                    focus &&
                      !item.danger &&
                      'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]',
                    focus &&
                      item.danger &&
                      'bg-[var(--color-danger)] text-[var(--color-danger-contrast)]',
                    !focus && item.danger && 'text-[var(--color-danger-fg)]',
                    !focus && !item.danger && 'text-[var(--color-fg-base)]',
                    item.disabled && 'opacity-40 cursor-not-allowed',
                  );
                  return item.href ? (
                    <a href={item.href} className={base}>
                      {item.icon && <span className="size-4 shrink-0">{item.icon}</span>}
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <span className="font-mono text-[10px] opacity-60">{item.shortcut}</span>
                      )}
                    </a>
                  ) : (
                    <button type="button" onClick={item.onClick} className={base}>
                      {item.icon && <span className="size-4 shrink-0">{item.icon}</span>}
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.shortcut && (
                        <span className="font-mono text-[10px] opacity-60">{item.shortcut}</span>
                      )}
                    </button>
                  );
                }}
              </MenuItem>
            ))}
            {si < sections.length - 1 && (
              <MenuSeparator className="my-1 h-px bg-[var(--color-border)]" />
            )}
          </MenuSection>
        ))}
      </MenuItems>
    </Menu>
  );
}
