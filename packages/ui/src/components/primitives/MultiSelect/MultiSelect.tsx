import { cn } from '@lib/utils/cn';
import { Check, ChevronDown } from 'lucide-react';
import { matchSorter } from 'match-sorter';
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEventHandler,
  type ReactElement,
  type Ref,
} from 'react';

import type { ComboboxOption } from '../Combobox';

import { Chip } from '../Chip';

export type MultiSelectProps<T = string> = {
  /** Selectable options. */
  options: ComboboxOption<T>[];
  /** Currently selected values. */
  value: T[];
  /** Called with the updated selection. */
  onChange: (value: T[]) => void;
  placeholder?: string;
  /** Message shown when no options match. */
  emptyMessage?: string;
  /** Max chips to render before collapsing into a "+N" badge. */
  maxBadgeCount?: number;
  chipsClassName?: string;
  /** Show a "select all" control. */
  showSelectAll?: boolean;
  /** Label for the select-all control. */
  selectAllLabel?: string;
  /** Label for the clear-all control. */
  clearAllLabel?: string;
  /** Control size. */
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  /** Element id, applied to the trigger button. */
  id?: string;
  /** Form field name, for native form submission / form libraries. */
  name?: string;
  /** Marks the field invalid for validation styling and `aria-invalid`. */
  invalid?: boolean;
  /** Id(s) of element(s) describing the field (helper/error text). */
  'aria-describedby'?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
};

function MultiSelectInner<T = string>(
  {
    options,
    value,
    onChange,
    placeholder,
    emptyMessage = 'No results',
    maxBadgeCount = 3,
    chipsClassName,
    showSelectAll,
    selectAllLabel = 'Select all',
    clearAllLabel = 'Clear all',
    size = 'md',
    disabled,
    className,
    id,
    name,
    invalid,
    'aria-describedby': ariaDescribedBy,
    onBlur,
    onFocus,
  }: MultiSelectProps<T>,
  ref: Ref<HTMLButtonElement>,
) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(
    () => (query ? matchSorter(options, query, { keys: ['label'] }) : options),
    [options, query],
  );
  const selected = options.filter((option) => value.some((item) => Object.is(item, option.value)));
  const visible = selected.slice(0, maxBadgeCount);
  const setValue = (option: ComboboxOption<T>) => {
    const exists = value.some((item) => Object.is(item, option.value));
    onChange(
      exists ? value.filter((item) => !Object.is(item, option.value)) : [...value, option.value],
    );
  };
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={ref}
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-describedby={ariaDescribedBy}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={() => setOpen((next) => !next)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => Math.max(index - 1, 0));
          }
          if (event.key === 'Enter' && open && filtered[activeIndex]) {
            event.preventDefault();
            setValue(filtered[activeIndex]);
          }
          if (event.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
          }
        }}
        className={cn(
          'flex min-h-9 w-full items-center gap-2 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-2 text-left',
          'transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
          'focus:ring-3 focus:ring-[var(--color-accent)]/15 focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-50',
          invalid && 'border-[var(--color-danger)]',
          size === 'sm' && 'min-h-8 text-xs',
        )}
      >
        <span className={cn('flex min-w-0 flex-1 flex-wrap gap-1 py-1', chipsClassName)}>
          {selected.length === 0 ? (
            <span className="text-sm text-[var(--color-fg-subtle)]">{placeholder}</span>
          ) : null}
          {visible.map((option) => (
            <Chip key={String(option.value)} size="sm">
              {option.label}
            </Chip>
          ))}
          {selected.length > maxBadgeCount ? (
            <Chip size="sm">+{selected.length - maxBadgeCount}</Chip>
          ) : null}
        </span>
        <ChevronDown className="size-4 text-[var(--color-fg-subtle)]" />
      </button>
      {open ? (
        <div className="absolute z-[9997] mt-1 w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] shadow-[var(--shadow-xl)] transition-opacity duration-[var(--motion-base)] ease-[var(--ease-emphasized)]">
          <input
            value={query}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !query && value.length) onChange(value.slice(0, -1));
              if (event.key === 'Escape') {
                setOpen(false);
                setActiveIndex(-1);
              }
            }}
            className="focus:ring-[var(--color-accent)]/20 m-2 mb-1 h-9 w-[calc(100%-1rem)] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2"
          />
          {showSelectAll ? (
            <button
              type="button"
              onClick={() =>
                onChange(
                  value.length === options.length ? [] : options.map((option) => option.value),
                )
              }
              className="mx-2 mb-1 w-[calc(100%-1rem)] rounded-md bg-[var(--color-bg-muted)] px-3 py-1.5 text-left text-xs font-medium text-[var(--color-fg-base)] hover:brightness-110"
            >
              {value.length === options.length ? clearAllLabel : selectAllLabel}
            </button>
          ) : null}
          <div
            role="listbox"
            aria-multiselectable="true"
            className="max-h-60 overflow-auto px-1 pb-1"
          >
            {filtered.length === 0 ? (
              <div className="px-2 py-2 text-sm text-[var(--color-fg-subtle)]">{emptyMessage}</div>
            ) : null}
            {filtered.map((option, index) => {
              const active = value.some((item) => Object.is(item, option.value));
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={option.disabled}
                  onClick={() => setValue(option)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-[var(--color-bg-muted)] disabled:opacity-45',
                    active && 'bg-[var(--color-accent)]/10',
                    index === activeIndex && 'bg-[var(--color-bg-muted)]',
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {active ? <Check className="size-4 text-[var(--color-accent)]" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const ForwardedMultiSelect = forwardRef(MultiSelectInner);
ForwardedMultiSelect.displayName = 'MultiSelect';

export const MultiSelect = ForwardedMultiSelect as <T = string>(
  props: MultiSelectProps<T> & { ref?: Ref<HTMLButtonElement> },
) => ReactElement;
