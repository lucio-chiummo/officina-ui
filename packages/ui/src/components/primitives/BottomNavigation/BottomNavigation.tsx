import { cn } from '@lib/utils/cn';
import { type ReactNode } from 'react';

export type BottomNavigationItem = {
  icon?: ReactNode;
  label: string;
  value: string;
};

export type BottomNavigationProps = {
  className?: string;
  /** Navigation destinations. */
  items: BottomNavigationItem[];
  /** Called with the value of the selected destination. */
  onChange: (value: string) => void;
  /** Value of the currently active destination. */
  value: string;
};

export function BottomNavigation({ className, items, onChange, value }: BottomNavigationProps) {
  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        'grid min-w-0 grid-flow-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-1 shadow-[var(--shadow-xs)]',
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-current={selected ? 'page' : undefined}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
              selected
                ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent-fg)]'
                : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]',
            )}
          >
            {item.icon ? <span className="size-4">{item.icon}</span> : null}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
