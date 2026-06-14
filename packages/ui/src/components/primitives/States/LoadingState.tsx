import { cn } from '@lib/utils/cn';

type LoadingStateProps = { label?: string; className?: string };

export function LoadingState({ label = 'Loading…', className }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className={cn('flex items-center gap-3 p-4', className)}>
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-accent)]"
      />
      <span className="text-sm text-[var(--color-fg-muted)]">{label}</span>
    </div>
  );
}

type SkeletonRowProps = { rows?: number; className?: string };

export function SkeletonRow({ rows = 3, className }: SkeletonRowProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex flex-col gap-2', className)}
      aria-live="polite"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={`row-${String(i)}`}
          className="h-4 animate-pulse rounded bg-[var(--color-bg-muted)]"
          style={{ width: `${String(60 + ((i * 17) % 35))}%` }}
        />
      ))}
    </div>
  );
}
