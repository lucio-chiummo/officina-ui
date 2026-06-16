import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { cn } from '@lib/utils/cn';
import { Bell, Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export type Notification = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  meta?: ReactNode;
  unread?: boolean;
  timestamp?: Date | string;
  onClick?: () => void;
};

export type NotificationCenterProps = {
  /** Notifications to display, newest first. */
  notifications: Notification[];
  /** Called when "mark all as read" is pressed. */
  onMarkAllRead?: () => void;
  /** Called with an id when a single item is marked read. */
  onMarkRead?: (id: string) => void;
  /** Called when the clear-all action is pressed. */
  onClear?: () => void;
  /** Called when the "see all" footer link is pressed. */
  onSeeAll?: () => void;
  /** Maximum number of items shown before scrolling. */
  maxVisible?: number;
  /** Content rendered when there are no notifications. */
  emptyState?: ReactNode;
  /** Accessible label for the panel/trigger. */
  label?: string;
  className?: string;
};

function relativeTime(ts: Date | string): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function sortByTimestamp(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    if (!a.timestamp && !b.timestamp) return 0;
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    const da = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
    const db = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
    return db.getTime() - da.getTime();
  });
}

export function NotificationCenter({
  notifications,
  onMarkAllRead,
  onMarkRead,
  onClear,
  onSeeAll,
  maxVisible = 8,
  emptyState,
  label = 'Notifications',
  className,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const sorted = sortByTimestamp(notifications);
  const visible = sorted.slice(0, maxVisible);
  const hasMore = sorted.length > maxVisible;

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-end',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        ref={refs.setReference}
        type="button"
        aria-label={`${label}${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        className="relative flex size-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]"
        {...getReferenceProps()}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold leading-none text-[var(--color-accent-contrast)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-50 w-[min(20rem,calc(100vw-1rem))] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow-[var(--shadow-lg)]"
              {...getFloatingProps()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-[var(--color-fg-base)]">{label}</h2>
                  {unreadCount > 0 && (
                    <span className="flex h-5 items-center rounded-full bg-[var(--color-accent)] px-1.5 text-[10px] font-bold text-[var(--color-accent-contrast)]">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {onMarkAllRead && unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllRead}
                      className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
                    >
                      <Check className="size-3" />
                      Mark all read
                    </button>
                  )}
                  {onClear && notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={onClear}
                      className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg-base)]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-[420px] overflow-y-auto">
                {visible.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    {emptyState ?? (
                      <>
                        <Bell className="size-8 text-[var(--color-fg-subtle)]" />
                        <p className="text-sm text-[var(--color-fg-muted)]">All caught up!</p>
                      </>
                    )}
                  </div>
                ) : (
                  <ul>
                    {visible.map((n) => (
                      <li
                        key={n.id}
                        className="border-b border-[var(--color-border)] last:border-0"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onMarkRead?.(n.id);
                            n.onClick?.();
                          }}
                          className={cn(
                            'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-muted)]',
                            n.unread && 'bg-[var(--color-accent-muted)]/20',
                          )}
                        >
                          <div className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)]">
                            {n.icon ?? <Bell className="size-4" />}
                            {n.unread && (
                              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-bg-base)]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium leading-snug text-[var(--color-fg-base)]">
                                {n.title}
                              </p>
                              {n.timestamp && (
                                <span className="shrink-0 text-[10px] text-[var(--color-fg-subtle)]">
                                  {relativeTime(n.timestamp)}
                                </span>
                              )}
                            </div>
                            {n.description && (
                              <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-fg-muted)]">
                                {n.description}
                              </p>
                            )}
                            {n.meta && (
                              <div className="mt-1 text-[10px] text-[var(--color-fg-subtle)]">
                                {n.meta}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {(hasMore || onSeeAll) && notifications.length > 0 && (
                <div className="border-t border-[var(--color-border)] px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSeeAll?.();
                      setOpen(false);
                    }}
                    className="w-full text-center text-xs font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {hasMore
                      ? `See all ${notifications.length} notifications`
                      : 'See all notifications'}
                  </button>
                </div>
              )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
