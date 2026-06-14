import { cn } from '@lib/utils/cn';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type ContextMenuItem = {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
};

export type ContextMenuProps = {
  /** Target region that opens the menu on right-click. */
  children: ReactNode;
  /** Menu entries, including separators and nested items. */
  items: ContextMenuItem[];
  className?: string;
};

export function ContextMenu({ children, items, className }: ContextMenuProps) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setPoint(null);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPoint(null);
    };
    window.addEventListener('click', close);
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('keydown', onEscape);
    };
  }, []);
  return (
    <div
      className={className}
      onContextMenu={(event) => {
        event.preventDefault();
        const menuWidth = 220;
        const menuHeight = Math.max(44, items.length * 36 + 8);
        const x = Math.min(event.clientX, window.innerWidth - menuWidth - 8);
        const y = Math.min(event.clientY, window.innerHeight - menuHeight - 8);
        setPoint({ x: Math.max(8, x), y: Math.max(8, y) });
      }}
    >
      {children}
      {point ? (
        <div
          ref={ref}
          role="menu"
          className="fixed z-[9997] min-w-44 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-1 shadow-[var(--shadow-xl)] transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)]"
          style={{ left: point.x, top: point.y }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onClick?.();
                setPoint(null);
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-[var(--color-bg-muted)] disabled:opacity-45',
                item.danger && 'text-[var(--color-danger-fg)]',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
