import { cn } from '@lib/utils/cn';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';

export type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'other';
  senderName?: string;
  avatar?: ReactNode;
  timestamp?: Date | string;
  status?: 'sending' | 'sent' | 'error';
};

export type ChatProps = {
  /** Conversation messages in chronological order. */
  messages: ChatMessage[];
  /** Called with the message text when the user sends. */
  onSend: (content: string) => void;
  /** Show a loading state for an in-flight response. */
  loading?: boolean;
  /** Placeholder for the composer input. */
  placeholder?: string;
  /** Disable the composer. */
  disabled?: boolean;
  /** Content shown when there are no messages. */
  emptyState?: ReactNode;
  /** Show an animated typing indicator. */
  typingIndicator?: boolean;
  className?: string;
};

function Avatar({ children, name }: { children?: ReactNode; name?: string | undefined }) {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-xs font-semibold text-[var(--color-accent)]">
      {children ?? initials}
    </div>
  );
}

function formatTime(ts: Date | string): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function Chat({
  messages,
  onSend,
  loading = false,
  placeholder = 'Type a message…',
  disabled = false,
  emptyState,
  typingIndicator = false,
  className,
}: ChatProps) {
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingIndicator]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setDraft('');
    textareaRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)]',
        className,
      )}
    >
      {/* Message list */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {messages.length === 0
          ? (emptyState ?? (
              <p className="m-auto text-sm text-[var(--color-fg-subtle)]">No messages yet.</p>
            ))
          : messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={cn('flex items-end gap-2', isUser && 'flex-row-reverse')}
                >
                  <Avatar name={msg.senderName}>{msg.avatar}</Avatar>
                  <div className={cn('flex max-w-[70%] flex-col gap-1', isUser && 'items-end')}>
                    {msg.senderName && (
                      <span className="text-xs font-medium text-[var(--color-fg-muted)]">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={cn(
                        'rounded-[var(--radius-lg)] px-3 py-2 text-sm leading-relaxed',
                        isUser
                          ? 'rounded-br-sm bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                          : 'rounded-bl-sm bg-[var(--color-bg-muted)] text-[var(--color-fg-base)]',
                        msg.status === 'error' && 'opacity-60',
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.timestamp && (
                      <span className="text-[10px] text-[var(--color-fg-subtle)]">
                        {formatTime(msg.timestamp)}
                        {msg.status === 'error' && ' · Failed'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

        {typingIndicator && (
          <div className="flex items-end gap-2">
            <Avatar />
            <div className="flex items-center gap-1 rounded-[var(--radius-lg)] rounded-bl-sm bg-[var(--color-bg-muted)] px-3 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-[var(--color-fg-muted)]"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={submit}
        className="flex items-end gap-2 border-t border-[var(--color-border)] p-3"
      >
        <textarea
          ref={textareaRef}
          value={draft}
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="focus:ring-[var(--color-accent)]/20 max-h-32 flex-1 resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-muted)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 disabled:opacity-50"
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={!draft.trim() || disabled || loading}
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)] transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
