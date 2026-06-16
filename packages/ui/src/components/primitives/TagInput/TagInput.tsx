import { X } from 'lucide-react';
import { forwardRef, useState } from 'react';

export type TagInputProps = {
  /** Current list of tags. */
  value: string[];
  /** Called with the updated tag list on add/remove. */
  onChange: (value: string[]) => void;
  placeholder?: string;
  /** Maximum number of tags allowed. */
  maxTags?: number;
  /** Pattern that splits typed input into tags (e.g. comma/space). */
  delimiter?: RegExp;
  /** Validate a candidate tag; return an error string to reject it. */
  validate?: (tag: string) => string | null;
  /** Autocomplete suggestions offered while typing. */
  suggestions?: string[];
  className?: string;
};

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    value,
    onChange,
    placeholder,
    maxTags,
    delimiter = /[,;\n\t]/,
    validate,
    suggestions = [],
    className,
  },
  ref,
) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const add = (raw: string) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag) || (maxTags && value.length >= maxTags)) return;
    const nextError = validate?.(tag) ?? null;
    setError(nextError);
    if (!nextError) {
      onChange([...value, tag]);
      setInput('');
    }
  };
  return (
    <div className={className}>
      <div className="focus-within:ring-3 focus-within:ring-[var(--color-accent)]/15 flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-2 py-1 focus-within:border-[var(--color-accent)]">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--color-bg-muted)] px-2.5 text-sm text-[var(--color-fg-base)]"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((item) => item !== tag))}
              className="inline-flex size-5 items-center justify-center rounded-full text-[var(--color-fg-muted)] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-black/10 hover:text-[var(--color-fg-base)]"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={ref}
          value={input}
          placeholder={value.length ? undefined : placeholder}
          onChange={(event) => {
            const next = event.target.value;
            if (delimiter.test(next)) add(next.replace(delimiter, ''));
            else setInput(next);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add(input);
            }
            if (event.key === 'Backspace' && !input) onChange(value.slice(0, -1));
          }}
          className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-fg-subtle)]"
        />
      </div>
      {suggestions.length > 0 && input ? (
        <div className="mt-1 flex flex-wrap gap-1">
          {suggestions
            .filter((item) => item.toLowerCase().includes(input.toLowerCase()))
            .slice(0, 5)
            .map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => add(item)}
                className="inline-flex h-6 cursor-pointer items-center rounded-full bg-[var(--color-bg-muted)] px-2 text-xs font-medium text-[var(--color-fg-base)] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
              >
                {item}
              </button>
            ))}
        </div>
      ) : null}
      {error ? <p className="mt-1 text-xs text-[var(--color-danger-fg)]">{error}</p> : null}
    </div>
  );
});
