import { useMemo, useState } from 'react';

import { Chip } from '../Chip';

export type MentionOption = { id: string; label: string };

export type MentionInputProps = {
  /** Current text value, including any @-mentions. */
  value: string;
  /** Called with the new text on change. */
  onChange: (value: string) => void;
  /** Candidates shown in the mention autocomplete. */
  options: MentionOption[];
  /** Placeholder text when empty. */
  placeholder?: string;
};

export function MentionInput({ value, onChange, options, placeholder }: MentionInputProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const matches = useMemo(
    () =>
      options
        .filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6),
    [options, query],
  );
  const active = /@([\w-]*)$/.exec(value);
  const commitMention = (index: number) => {
    const choice = matches[index];
    if (!choice) return;
    onChange(value.replace(/@([\w-]*)$/, `@[${choice.label}](${choice.id}) `));
    setActiveIndex(0);
  };
  return (
    <div className="relative">
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setQuery(/@([\w-]*)$/.exec(event.target.value)?.[1] ?? '');
          setActiveIndex(0);
        }}
        onKeyDown={(event) => {
          if (!active) return;
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, Math.max(0, matches.length - 1)));
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
          }
          if (event.key === 'Enter' && matches.length > 0) {
            event.preventDefault();
            commitMention(activeIndex);
          }
          if (event.key === 'Escape') {
            setQuery('');
            setActiveIndex(0);
          }
        }}
        className="min-h-24 w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-3 focus:ring-[var(--color-accent)]/15"
      />
      {active ? (
        <div className="absolute top-full left-0 z-[9997] mt-1 w-56 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-1 shadow-[var(--shadow-xl)] transition-opacity duration-[var(--motion-base)] ease-[var(--ease-emphasized)]">
          {matches.length === 0 ? (
            <p className="px-2 py-2 text-xs text-[var(--color-fg-subtle)]">No matches</p>
          ) : null}
          {matches.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onClick={() => commitMention(index)}
              className={`block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-[var(--color-bg-muted)] ${index === activeIndex ? 'bg-[var(--color-bg-muted)]' : ''}`}
            >
              <Chip size="sm">@{option.label}</Chip>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
