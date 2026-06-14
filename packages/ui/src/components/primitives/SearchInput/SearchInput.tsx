import { cn } from '@lib/utils/cn';
import { Search, X } from 'lucide-react';
import { forwardRef, useEffect, type InputHTMLAttributes } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Current query string. */
  value: string;
  /** Called on every keystroke with the new query. */
  onChange: (value: string) => void;
  /** Called after `debounceMs` of inactivity — ideal for firing searches. */
  onDebouncedChange?: (value: string) => void;
  /** Debounce window for `onDebouncedChange`, in ms. */
  debounceMs?: number;
  /** Show a clear (×) button when there is a value. */
  showClear?: boolean;
  /** Accessible label for the clear button. */
  clearLabel?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    onChange,
    onDebouncedChange,
    debounceMs = 200,
    showClear = true,
    clearLabel = 'Clear',
    className,
    ...props
  },
  ref,
) {
  const debounced = useDebouncedCallback((next: string) => onDebouncedChange?.(next), debounceMs);
  useEffect(() => {
    debounced(value);
  }, [debounced, value]);
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
      <input
        ref={ref}
        data-density-control="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="block h-9 w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] pr-9 pl-9 text-sm text-[var(--color-fg-base)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        {...props}
      />
      {showClear && value ? (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => onChange('')}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-[var(--color-fg-subtle)] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
});
