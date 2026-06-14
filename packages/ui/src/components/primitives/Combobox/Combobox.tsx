import { cn } from '@lib/utils/cn';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';

export type ComboboxOption<T = string> = {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type ComboboxProps<T = string> = {
  /** Selectable options. */
  options: ComboboxOption<T>[];
  /** Currently selected value, or null. */
  value: T | null;
  /** Called with the chosen value (or null when cleared). */
  onChange: (value: T | null) => void;
  /** Placeholder text for the input when nothing is selected. */
  placeholder?: string;
  /** Message shown when no options match the query. */
  emptyMessage?: string;
  /** Show a loading state (e.g. while fetching options). */
  loading?: boolean;
  /** Called as the user types — use for async/remote filtering. */
  onInputChange?: (q: string) => void;
  /** Custom renderer for an option row. */
  renderOption?: (option: ComboboxOption<T>) => ReactNode;
  /** Control size. */
  size?: 'sm' | 'md';
  /** Disables the input and prevents selection. */
  disabled?: boolean;
  /** Show a clear button to reset the selection. */
  clearable?: boolean;
  /** Form field name for the underlying input. */
  name?: string;
  /** Explicit id for the input. */
  id?: string;
  /** Extra classes for the combobox container. */
  className?: string;
};

function isSameValue<T>(a: T | null, b: T) {
  return Object.is(a, b);
}

export function Combobox<T = string>({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage = 'No results',
  loading,
  onInputChange,
  renderOption,
  size = 'md',
  disabled,
  clearable = true,
  name,
  id,
  className,
  inputRef,
}: ComboboxProps<T> & {
  /** Ref forwarded to the underlying text input. */
  inputRef?: Ref<HTMLInputElement>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => isSameValue(value, option.value));
  const filtered = useMemo(
    () => (query ? matchSorter(options, query, { keys: ['label', 'description'] }) : options),
    [options, query],
  );
  const inputValue = open ? query : (selected?.label ?? '');
  const listboxId = id ? `${id}-listbox` : undefined;
  const optionId = (index: number) => (id ? `${id}-option-${String(index)}` : undefined);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={(event) => {
            if (disabled) return;
            setQuery(event.target.value);
            onInputChange?.(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (disabled) return;
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
            if (event.key === 'Enter' && open && activeIndex >= 0 && filtered[activeIndex]) {
              event.preventDefault();
              onChange(filtered[activeIndex].value);
              setOpen(false);
              setQuery('');
              setActiveIndex(-1);
            }
            if (event.key === 'Escape') {
              setOpen(false);
              setQuery('');
              setActiveIndex(-1);
            }
          }}
          className={cn(
            'block w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] pr-16 text-[var(--color-fg-base)]',
            'placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:ring-3 focus:ring-[var(--color-accent)]/15 focus:outline-none',
            size === 'sm' ? 'h-8 px-2 text-xs' : 'h-9 px-3 text-sm',
          )}
        />
        <div className="absolute inset-y-0 right-1 flex items-center gap-1">
          {loading ? (
            <Loader2 className="size-4 animate-spin text-[var(--color-fg-subtle)]" />
          ) : null}
          {clearable && value !== null ? (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                onChange(null);
                setQuery('');
              }}
              className="rounded p-1 text-[var(--color-fg-subtle)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
          <button
            type="button"
            aria-label="Toggle"
            disabled={disabled}
            onClick={() => {
              setOpen((next) => !next);
              setActiveIndex(-1);
            }}
            className="rounded p-1 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-base)]"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-[9997] mt-1 max-h-64 w-full overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-1 shadow-[var(--shadow-xl)] transition-opacity duration-[var(--motion-base)] ease-[var(--ease-standard)]"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[var(--color-fg-subtle)]">{emptyMessage}</div>
          ) : (
            filtered.map((option, index) => (
              <button
                key={String(option.value)}
                id={optionId(index)}
                type="button"
                role="option"
                disabled={option.disabled}
                aria-selected={isSameValue(value, option.value)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm disabled:opacity-45',
                  isSameValue(value, option.value) && 'bg-[var(--color-accent)]/10',
                  index === activeIndex
                    ? 'bg-[var(--color-bg-muted)]'
                    : 'hover:bg-[var(--color-bg-muted)]',
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  onChange(option.value);
                  setQuery('');
                  setOpen(false);
                  setActiveIndex(-1);
                }}
              >
                {option.icon}
                <span className="min-w-0 flex-1">
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <span className="block truncate">{option.label}</span>
                  )}
                  {option.description ? (
                    <span className="block truncate text-xs text-[var(--color-fg-subtle)]">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {isSameValue(value, option.value) ? (
                  <Check className="size-4 text-[var(--color-accent)]" />
                ) : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
