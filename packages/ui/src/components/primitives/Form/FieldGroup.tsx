import { cn } from '@lib/utils/cn';

import { Checkbox } from '../Checkbox';
import { RadioGroup, type RadioGroupProps, type RadioOption } from '../RadioGroup';
import { Switch } from '../Switch';

export type CheckboxGroupOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type CheckboxGroupProps = {
  /** Selectable options rendered as checkboxes. */
  options: CheckboxGroupOption[];
  /** Currently selected option values (controlled). */
  value: string[];
  /** Called with the next array of selected values when any box toggles. */
  onChange: (value: string[]) => void;
  /** Stacking direction of the checkboxes. Defaults to `'vertical'`. */
  orientation?: 'vertical' | 'horizontal';
  /** Disables every checkbox in the group. */
  disabled?: boolean;
  /** Marks the group invalid for validation styling (sets `data-invalid`). */
  invalid?: boolean;
  /** Shared form field name applied to each checkbox. */
  name?: string;
  /** Extra classes for the group container. */
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export function CheckboxGroup({
  options,
  value,
  onChange,
  orientation = 'vertical',
  disabled,
  invalid,
  name,
  className,
  ...aria
}: CheckboxGroupProps) {
  const toggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      if (!value.includes(optionValue)) onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div
      {...aria}
      role="group"
      data-invalid={invalid ? '' : undefined}
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap gap-x-6',
        className,
      )}
    >
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={value.includes(option.value)}
          onChange={(checked) => toggle(option.value, checked)}
          disabled={Boolean(disabled || option.disabled)}
          label={option.label}
          {...(option.description ? { description: option.description } : {})}
          {...(name ? { id: `${name}-${option.value}` } : {})}
        />
      ))}
    </div>
  );
}

export type SwitchGroupOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type SwitchGroupProps = {
  /** Switch options rendered as toggle rows. */
  options: SwitchGroupOption[];
  /** Values of the switches currently on (controlled). */
  value: string[];
  /** Called with the next array of on values when any switch toggles. */
  onChange: (value: string[]) => void;
  /** Disables every switch in the group. */
  disabled?: boolean;
  /** Wrap each row in a bordered settings panel. */
  bordered?: boolean;
  /** Extra classes for the group container. */
  className?: string;
  /** Accessible label for the group. */
  'aria-label'?: string;
  /** Id of an element labelling the group. */
  'aria-labelledby'?: string;
};

export function SwitchGroup({
  options,
  value,
  onChange,
  disabled,
  bordered = true,
  className,
  ...aria
}: SwitchGroupProps) {
  const toggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      if (!value.includes(optionValue)) onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div
      {...aria}
      role="group"
      className={cn(
        'flex flex-col',
        bordered
          ? 'divide-y divide-[var(--color-border)] overflow-hidden rounded-lg border border-[var(--color-border)]'
          : 'gap-3',
        className,
      )}
    >
      {options.map((option) => {
        const id = `switch-${option.value}`;
        return (
          <div
            key={option.value}
            className={cn(
              'flex items-start justify-between gap-4',
              bordered ? 'px-3.5 py-3 hover:bg-[var(--color-bg-muted)]' : '',
              (disabled || option.disabled) && 'opacity-60',
            )}
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-[var(--color-fg-base)]">
                {option.label}
              </span>
              {option.description ? (
                <span className="mt-0.5 block text-xs text-[var(--color-fg-subtle)]">
                  {option.description}
                </span>
              ) : null}
            </span>
            <Switch
              id={id}
              aria-label={option.label}
              checked={value.includes(option.value)}
              onChange={(checked) => toggle(option.value, checked)}
              disabled={Boolean(disabled || option.disabled)}
            />
          </div>
        );
      })}
    </div>
  );
}

export type RadioCardOption<T = string> = RadioOption<T>;

const cardColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
} as const;

export type RadioCardGroupProps<T = string> = Omit<RadioGroupProps<T>, 'variant'> & {
  /** Lay cards out as a fixed-column grid instead of wrapping rows. */
  columns?: keyof typeof cardColumns;
};

/**
 * Single-choice card selector for plans, roles, layouts, or preferences.
 * Thin preset over {@link RadioGroup} locked to the `card` variant.
 */
export function RadioCardGroup<T = string>({
  columns,
  className,
  ...props
}: RadioCardGroupProps<T>) {
  const gridClass = columns ? cn('!grid !flex-none', cardColumns[columns]) : undefined;
  return (
    <RadioGroup
      {...props}
      variant="card"
      orientation={props.orientation ?? 'horizontal'}
      className={cn(gridClass, className)}
    />
  );
}
