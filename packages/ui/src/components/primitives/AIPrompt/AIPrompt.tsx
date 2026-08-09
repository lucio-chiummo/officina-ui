import { cn } from '@lib/utils/cn';
import { Loader2, Send, Sparkles, Square } from 'lucide-react';
import { useId, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';

export type AIPromptProps = {
  /** Called with the prompt text on submit. Wire your model call here. */
  onSubmit: (prompt: string) => void;
  /** Streaming/working state — shows stop affordance and disables input. */
  busy?: boolean;
  /** Called when the user clicks stop during a busy/streaming response. */
  onStop?: () => void;
  /** Quick-start suggestion chips shown above the input. */
  suggestions?: string[];
  /** Placeholder text for the input. Defaults to `'Ask anything…'`. */
  placeholder?: string;
  /** Accessible label for the input (visually hidden). Defaults to `'AI prompt'`. */
  label?: string;
  /** Rendered output region (markdown, streamed text, components). */
  output?: ReactNode;
  /** Footer hint, e.g. model name or token budget. */
  hint?: string;
  /** Disables the input and submit affordance. */
  disabled?: boolean;
  className?: string;
};

/**
 * Prompt input surface for AI features: suggestion chips, multiline input with
 * Cmd/Ctrl+Enter submit, busy/stop state, and an output slot. Transport-free —
 * wire your own model call in onSubmit.
 */
export function AIPrompt({
  onSubmit,
  busy = false,
  onStop,
  suggestions,
  placeholder = 'Ask anything…',
  label = 'AI prompt',
  output,
  hint,
  disabled = false,
  className,
}: AIPromptProps) {
  const id = useId();
  const [value, setValue] = useState('');

  const submit = () => {
    const prompt = value.trim();
    if (!prompt || busy || disabled) return;
    onSubmit(prompt);
    setValue('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)]',
        className,
      )}
    >
      {output ? (
        <div className="border-b border-[var(--color-border)] p-4 text-sm text-[var(--color-fg-base)]">
          {output}
        </div>
      ) : null}

      {suggestions && suggestions.length > 0 && !output ? (
        <div className="flex flex-wrap gap-1.5 px-4 pt-4">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={busy || disabled}
              onClick={() => {
                setValue(suggestion);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)] transition-colors duration-[var(--motion-fast)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-fg-base)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 focus-visible:outline-none disabled:opacity-50"
            >
              <Sparkles className="size-3 text-[var(--color-accent)]" aria-hidden="true" />
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="p-3">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <div className="flex items-end gap-2 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-2 transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20">
          <textarea
            id={id}
            rows={2}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={busy || disabled}
            className="max-h-40 min-h-9 grow resize-none bg-transparent text-sm text-[var(--color-fg-base)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none disabled:opacity-60"
          />
          {busy ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-muted)] text-[var(--color-fg-base)] transition-colors duration-[var(--motion-fast)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 focus-visible:outline-none"
            >
              {onStop ? (
                <Square className="size-3.5" />
              ) : (
                <Loader2 className="size-4 animate-spin" />
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!value.trim() || disabled}
              aria-label="Send prompt"
              className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)] text-[var(--color-accent-contrast)] transition-opacity duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 focus-visible:outline-none disabled:opacity-40"
            >
              <Send className="size-3.5" />
            </button>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between px-1">
          <span className="text-[10px] text-[var(--color-fg-subtle)]">
            {hint ?? 'Cmd/Ctrl + Enter to send'}
          </span>
          {busy ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-fg-muted)]">
              <Loader2 className="size-3 animate-spin" aria-hidden="true" /> Generating…
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
