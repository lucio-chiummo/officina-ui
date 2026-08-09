import { Button, type ButtonProps } from '@primitives/Button';
import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export interface SplitButtonAction {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps extends Omit<ButtonProps, 'children'> {
  /** Label for the primary (left) button. */
  label: ReactNode;
  /** Secondary actions shown in the attached dropdown. */
  actions: SplitButtonAction[];
}

export function SplitButton({
  label,
  actions,
  onClick,
  variant = 'primary',
  size = 'md',
  ...props
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-flex">
      <Button {...props} variant={variant} size={size} onClick={onClick} className="rounded-r-none">
        {label}
      </Button>
      <Button
        variant={variant}
        size={size === 'lg' ? 'lg' : 'md'}
        aria-label="More actions"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="rounded-l-none border-l-white/20 px-2"
      >
        <ChevronDown className="size-4" aria-hidden />
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-1 min-w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] p-1 shadow-[var(--shadow-lg)]"
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              disabled={action.disabled}
              onClick={() => {
                action.onSelect();
                setOpen(false);
              }}
              className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--color-fg-base)] hover:bg-[var(--color-bg-muted)] disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
