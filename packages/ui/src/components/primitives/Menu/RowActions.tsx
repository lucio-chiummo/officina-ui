import { cn } from '@lib/utils/cn';
import { type ReactNode } from 'react';

import { IconButton } from '../Button';
import { ActionMenu, type ActionMenuItem } from './ActionMenu';

export type RowAction = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
};

export type RowActionsProps = {
  /** Row actions; the first `max` show inline, the rest fold into a menu. */
  actions: RowAction[];
  /** Number of actions shown inline before collapsing the rest into a menu. */
  max?: number;
  /** Size of the action buttons. Defaults to `'md'`. */
  size?: 'sm' | 'md';
  /** Accessible label for the overflow menu trigger. */
  menuLabel?: string;
  /** Extra classes for the actions container. */
  className?: string;
};

/**
 * Compact action cluster for table rows and list items. Shows up to `max`
 * inline icon buttons (each with a tooltip), then collapses overflow into an
 * {@link ActionMenu}. Domain-neutral — it never imports table primitives.
 */
export function RowActions({
  actions,
  max = 3,
  size = 'sm',
  menuLabel = 'More actions',
  className,
}: RowActionsProps) {
  const inline = actions.slice(0, max);
  const overflow = actions.slice(max);

  const overflowItems: ActionMenuItem[] = overflow.map((action) => ({
    label: action.label,
    icon: action.icon,
    ...(action.onClick ? { onClick: action.onClick } : {}),
    ...(action.href ? { href: action.href } : {}),
    ...(action.danger ? { danger: action.danger } : {}),
    ...(action.disabled ? { disabled: action.disabled } : {}),
  }));

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {inline.map((action) => (
        <IconButton
          key={action.label}
          icon={action.icon}
          size={size}
          variant="ghost"
          aria-label={action.label}
          tooltip={action.label}
          disabled={action.disabled}
          {...(action.onClick ? { onClick: action.onClick } : {})}
          className={action.danger ? 'text-[var(--color-danger-fg)]' : undefined}
        />
      ))}
      {overflow.length > 0 ? (
        <ActionMenu items={overflowItems} label={menuLabel} size={size} />
      ) : null}
    </div>
  );
}
