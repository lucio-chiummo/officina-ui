import { cn } from '@lib/utils/cn';
import { ChevronDown, X } from 'lucide-react';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useRef, useState, useId } from 'react';

export type MultiColumnComboboxColumn = {
  key: string;
  header: string;
  width?: string;
};

export type MultiColumnComboboxItem = Record<string, string> & { id: string };

export type MultiColumnComboboxProps = {
  /** Selectable rows, each carrying a value per column. */
  items: MultiColumnComboboxItem[];
  /** Column definitions shown in the dropdown grid. */
  columns: MultiColumnComboboxColumn[];
  /** Id of the selected item, or null. */
  value: string | null;
  /** Called with the new selection id (or null when cleared). */
  onChange: (id: string | null) => void;
  /** Column key shown in the input when an item is selected. Defaults to first column. */
  displayKey?: string;
  /** Visible field label. */
  label?: string;
  /** Placeholder when nothing is selected. */
  placeholder?: string;
  /** Message shown when no items match the query. */
  emptyMessage?: string;
  /** Disable the control. */
  disabled?: boolean;
  /** Show a clear button when a value is selected. */
  clearable?: boolean;
  className?: string;
};

/**
 * Combobox whose popup is a small table — search across all columns, render
 * structured rows. For picking entities with several identifying fields
 * (e.g. SKU + name + stock, employee + department + role).
 */
export function MultiColumnCombobox({
  items,
  columns,
  value,
  onChange,
  displayKey,
  label,
  placeholder = 'Search…',
  emptyMessage = 'No results',
  disabled = false,
  clearable = true,
  className,
}: MultiColumnComboboxProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const display = displayKey ?? columns[0]?.key ?? 'id';

  const selected = items.find((item) => item.id === value) ?? null;
  const searchKeys = useMemo(() => columns.map((c) => c.key), [columns]);
  const filtered = useMemo(
    () => (query ? matchSorter(items, query, { keys: searchKeys }) : items),
    [items, query, searchKeys],
  );

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  const commit = (item: MultiColumnComboboxItem) => {
    onChange(item.id);
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const inputValue = open ? query : (selected?.[display] ?? '');

  return (
    <div ref={rootRef} className={cn('relative flex flex-col gap-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-fg-base)]">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-grid`}
          aria-autocomplete="list"
          value={inputValue}
          placeholder={selected ? (selected[display] ?? placeholder) : placeholder}
          disabled={disabled}
          onFocus={() => {
            setOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (event.key === 'Enter' && open && activeIndex >= 0) {
              event.preventDefault();
              const item = filtered[activeIndex];
              if (item) commit(item);
            } else if (event.key === 'Escape') {
              setOpen(false);
              setQuery('');
            }
          }}
          className="block h-9 w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 py-2 pr-14 text-sm text-[var(--color-fg-base)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-0.5">
          {clearable && selected && !disabled ? (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={() => {
                onChange(null);
                setQuery('');
              }}
              className="rounded p-0.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-base)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 focus-visible:outline-none"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
          <ChevronDown className="size-4 text-[var(--color-fg-subtle)]" aria-hidden="true" />
        </div>
      </div>

      {open ? (
        <div
          id={`${id}-grid`}
          role="grid"
          aria-label={label ?? 'Options'}
          className="absolute top-full right-0 left-0 z-30 mt-1 max-h-72 overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow-[var(--shadow-md)]"
        >
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-[var(--color-bg-subtle)]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    className="border-b border-[var(--color-border)] px-3 py-1.5 text-left text-[11px] font-semibold tracking-wide text-[var(--color-fg-muted)] uppercase"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-4 text-center text-[var(--color-fg-subtle)]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr
                    key={item.id}
                    aria-selected={item.id === value}
                    onClick={() => {
                      commit(item);
                    }}
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    className={cn(
                      'cursor-pointer transition-colors duration-[var(--motion-fast)]',
                      index === activeIndex && 'bg-[var(--color-bg-subtle)]',
                      item.id === value && 'bg-[var(--color-accent)]/8',
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="border-b border-[var(--color-border-subtle)] px-3 py-2 text-[var(--color-fg-base)]"
                      >
                        {item[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
