import { cn } from '@lib/utils/cn';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SearchInput } from '../SearchInput';
import { FilterPopover } from './FilterPopover';

export type FacetOption<T = string> = { value: T; label: string; count?: number };

export type FacetedFilterProps<T = string> = {
  /** Filter label shown on the trigger. */
  label: string;
  /** Selectable facet options, optionally with counts. */
  options: FacetOption<T>[];
  /** Currently selected option values. */
  value: T[];
  /** Called with the new selection array. */
  onChange: (value: T[]) => void;
  /** Render inline instead of inside a popover. */
  inline?: boolean;
  /** Show a search box above the options. */
  showSearch?: boolean;
  /** Placeholder for the option search box. */
  searchPlaceholder?: string;
};

export function FacetedFilter<T = string>({
  label,
  options,
  value,
  onChange,
  inline = false,
  showSearch,
  searchPlaceholder,
}: FacetedFilterProps<T>) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );
  const toggle = (option: FacetOption<T>) =>
    onChange(
      value.some((item) => Object.is(item, option.value))
        ? value.filter((item) => !Object.is(item, option.value))
        : [...value, option.value],
    );
  const inlineContent = (
    <div className="min-w-0 space-y-2">
      {showSearch ? (
        <SearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} />
      ) : null}
      <div className="flex max-h-24 min-w-0 flex-wrap gap-1.5 overflow-auto pr-1">
        {filtered.map((option) => {
          const active = value.some((item) => Object.is(item, option.value));
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={active}
              className={cn(
                'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                'transition-[background-color,border-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
                active
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent-fg)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]',
              )}
            >
              <span className="truncate">{option.label}</span>
              {option.count !== undefined ? (
                <span className="text-[var(--color-fg-subtle)]">{option.count}</span>
              ) : null}
            </button>
          );
        })}
        {filtered.length === 0 ? (
          <span className="text-xs text-[var(--color-fg-subtle)]">No options</span>
        ) : null}
      </div>
    </div>
  );

  const content = (
    <>
      {showSearch ? (
        <SearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} />
      ) : null}
      <div className="max-h-60 space-y-0.5 overflow-auto">
        {filtered.map((option) => {
          const active = value.some((item) => Object.is(item, option.value));
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => toggle(option)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)]"
            >
              <span className="flex size-4 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-bg-base)]">
                {active ? <Check className="size-3 text-[var(--color-accent)]" /> : null}
              </span>
              <span
                className={
                  active
                    ? 'flex-1 text-[var(--color-fg-base)]'
                    : 'flex-1 text-[var(--color-fg-muted)]'
                }
              >
                {option.label}
              </span>
              {option.count !== undefined ? (
                <span className="text-xs text-[var(--color-fg-subtle)]">{option.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );

  if (inline) return inlineContent;

  return (
    <FilterPopover label={label} activeCount={value.length}>
      {content}
    </FilterPopover>
  );
}
