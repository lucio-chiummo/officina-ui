import { MoreHorizontal } from 'lucide-react';
import { type ReactNode } from 'react';

import { IconButton } from '../Button';
import { Dropdown, type DropdownItem, type DropdownSection } from '../Dropdown';

export type ActionMenuItem = DropdownItem;
export type ActionMenuSection = DropdownSection;

export type ActionMenuProps = {
  /** Flat list of actions. Use `sections` instead for grouped/headed menus. */
  items?: ActionMenuItem[];
  /** Grouped actions with optional section headings. */
  sections?: ActionMenuSection[];
  /** Accessible label for the default trigger. */
  label?: string;
  /** Menu alignment relative to the trigger. Defaults to `'end'`. */
  align?: 'start' | 'end';
  /** Replace the default overflow trigger entirely. */
  trigger?: ReactNode;
  /** Icon for the default trigger button. Defaults to `MoreHorizontal`. */
  icon?: ReactNode;
  /** Size of the default trigger button. */
  size?: 'sm' | 'md';
  /** Extra classes for the menu container. */
  className?: string;
};

/**
 * Domain-neutral overflow menu for row, toolbar, and contextual actions.
 * Renders a `MoreHorizontal` {@link IconButton} trigger unless overridden.
 */
export function ActionMenu({
  items,
  sections,
  label = 'Actions',
  align = 'end',
  trigger,
  icon,
  size = 'sm',
  className,
}: ActionMenuProps) {
  const resolvedSections: DropdownSection[] = sections ?? [{ items: items ?? [] }];
  const resolvedTrigger = trigger ?? (
    <IconButton variant="ghost" size={size} aria-label={label} icon={icon ?? <MoreHorizontal />} />
  );

  return (
    <Dropdown
      trigger={resolvedTrigger}
      sections={resolvedSections}
      align={align}
      {...(className ? { className } : {})}
    />
  );
}
