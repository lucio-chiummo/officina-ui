import { SearchInput } from '../SearchInput';

export type SearchFilterProps = {
  /** Current search text (controlled). */
  value: string;
  /** Called on every keystroke with the raw input value. */
  onChange: (value: string) => void;
  /** Called with the value after `debounceMs` of inactivity. */
  onDebouncedChange?: (value: string) => void;
  /** Debounce window in ms for `onDebouncedChange`. */
  debounceMs?: number;
  /** Placeholder text for the search input. */
  placeholder?: string;
  /** Extra classes for the input wrapper. */
  className?: string;
};

export function SearchFilter({
  value,
  onChange,
  onDebouncedChange,
  debounceMs,
  placeholder,
  className,
}: SearchFilterProps) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      {...(onDebouncedChange ? { onDebouncedChange } : {})}
      {...(debounceMs !== undefined ? { debounceMs } : {})}
      {...(placeholder ? { placeholder } : {})}
      {...(className ? { className } : {})}
    />
  );
}
