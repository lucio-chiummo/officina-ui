import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

export type ToggleOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type ToggleGroupProps<T extends string = string> =
  | {
      /** Single-select mode — only one option active at a time. */
      type: 'single';
      /** The active option value (controlled). */
      value: T;
      /** Called with the newly selected value. */
      onChange: (value: T) => void;
      /** Toggle options to render. */
      options: ToggleOption<T>[];
      /** Extra classes for the toggle container. */
      className?: string;
      /** Accessible label for the group (maps to `aria-label`). */
      ariaLabel?: string;
    }
  | {
      /** Multi-select mode — any number of options active. */
      type: 'multiple';
      /** The active option values (controlled). */
      value: T[];
      /** Called with the next array of active values when any toggle flips. */
      onChange: (value: T[]) => void;
      /** Toggle options to render. */
      options: ToggleOption<T>[];
      /** Extra classes for the toggle container. */
      className?: string;
      /** Accessible label for the group (maps to `aria-label`). */
      ariaLabel?: string;
    };

export function ToggleGroup<T extends string = string>(props: ToggleGroupProps<T>) {
  const active = (value: T) =>
    props.type === 'single' ? props.value === value : props.value.includes(value);
  const toggle = (value: T) => {
    if (props.type === 'single') props.onChange(value);
    else
      props.onChange(
        active(value) ? props.value.filter((item) => item !== value) : [...props.value, value],
      );
  };
  return (
    <div
      role={props.type === 'single' ? 'radiogroup' : 'group'}
      aria-label={props.ariaLabel}
      className={cn(
        'inline-flex overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)]',
        props.className,
      )}
    >
      {props.options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={option.disabled}
          aria-pressed={props.type === 'multiple' ? active(option.value) : undefined}
          aria-checked={props.type === 'single' ? active(option.value) : undefined}
          role={props.type === 'single' ? 'radio' : undefined}
          onClick={() => toggle(option.value)}
          className={cn(
            'inline-flex h-9 items-center gap-2 border-r border-[var(--color-border)] px-3 text-sm font-medium text-[var(--color-fg-muted)] last:border-r-0',
            'transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:opacity-45',
            active(option.value) &&
              'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] hover:text-[var(--color-accent-contrast)]',
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
