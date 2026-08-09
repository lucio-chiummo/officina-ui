import { cn } from '@lib/utils/cn';
import { Plus } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Button } from '../Button';

export type SpeedDialAction = {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
};

export type SpeedDialProps = {
  /** Actions revealed when the dial expands. */
  actions: SpeedDialAction[];
  /** Accessible name for the trigger button. */
  ariaLabel?: string;
  className?: string;
  /** Custom trigger icon. Defaults to a plus. */
  icon?: ReactNode;
};

export function SpeedDial({
  actions,
  ariaLabel = 'Open actions',
  className,
  icon,
}: SpeedDialProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative inline-flex flex-col items-end gap-2', className)}>
      <div
        className={cn(
          'flex flex-col items-end gap-2 transition-[opacity,transform] duration-[var(--motion-base)] ease-[var(--ease-standard)]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => {
              action.onClick();
              setOpen(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3 py-2 text-xs font-semibold text-[var(--color-fg-base)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--color-bg-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          >
            {action.icon ? <span className="size-4">{action.icon}</span> : null}
            {action.label}
          </button>
        ))}
      </div>
      <Button
        size="icon"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
      >
        {icon ?? (
          <Plus
            className={cn(
              'size-5 transition-transform duration-[var(--motion-base)]',
              open && 'rotate-45',
            )}
            aria-hidden="true"
          />
        )}
      </Button>
    </div>
  );
}
