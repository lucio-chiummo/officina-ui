import type { ReactNode } from 'react';

import { Radio, RadioGroup as HeadlessRadioGroup } from '@headlessui/react';
import { cn } from '@lib/utils/cn';
import { CheckCircle2 } from 'lucide-react';

export type RadioOption<T = string> = {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps<T = string> = {
  /** Radio options to choose from. */
  options: RadioOption<T>[];
  /** Currently selected value. */
  value: T;
  /** Called with the newly selected value. */
  onChange: (value: T) => void;
  /** Layout direction of the options. */
  orientation?: 'horizontal' | 'vertical';
  /** Plain radios or selectable cards. */
  variant?: 'plain' | 'card';
  name?: string;
  className?: string;
};

export function RadioGroup<T = string>({
  options,
  value,
  onChange,
  orientation = 'vertical',
  variant = 'plain',
  name,
  className,
}: RadioGroupProps<T>) {
  return (
    <HeadlessRadioGroup
      value={value}
      onChange={onChange}
      {...(name ? { name } : {})}
      className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
    >
      {options.map((option) => (
        <Radio
          key={String(option.value)}
          value={option.value}
          {...(option.disabled !== undefined ? { disabled: option.disabled } : {})}
          className={cn(
            'group flex min-h-16 cursor-pointer items-start gap-2 rounded-[var(--radius-md)] text-sm transition-[background-color,border-color,box-shadow,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] outline-none disabled:cursor-not-allowed disabled:opacity-45',
            variant === 'card'
              ? 'min-w-48 border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-3 hover:border-[var(--color-border)] data-[checked]:border-[var(--color-accent)] data-[checked]:bg-[var(--color-accent)]/5 data-[checked]:ring-2 data-[checked]:ring-[var(--color-accent)]/20'
              : 'p-1',
          )}
        >
          <span className="mt-0.5 flex size-4 items-center justify-center rounded-full border border-[var(--color-border-strong)] group-data-[checked]:border-[var(--color-accent)] group-data-[checked]:bg-[var(--color-accent)]">
            <span className="hidden size-1.5 rounded-full bg-[var(--color-bg-base)] group-data-[checked]:block" />
          </span>
          {option.icon ? <span className="size-4 shrink-0">{option.icon}</span> : null}
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 font-medium text-[var(--color-fg-base)]">
              {option.label}
              {variant === 'card' ? (
                <CheckCircle2 className="hidden size-4 text-[var(--color-accent)] group-data-[checked]:block" />
              ) : null}
            </span>
            {option.description ? (
              <span className="block text-xs text-[var(--color-fg-subtle)]">
                {option.description}
              </span>
            ) : null}
          </span>
        </Radio>
      ))}
    </HeadlessRadioGroup>
  );
}
