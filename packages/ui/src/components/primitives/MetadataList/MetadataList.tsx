import { cn } from '@lib/utils/cn';
import { Check, Copy } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export type MetadataItem = {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** When set, renders an inline copy button that copies this string. */
  copyValue?: string;
};

const columnClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
} as const;

export type MetadataListProps = {
  /** Key/value entries to render. */
  items: MetadataItem[];
  /** Number of grid columns. */
  columns?: keyof typeof columnClass;
  className?: string;
};

/**
 * Compact key/value metadata grid with muted labels, optional leading icons,
 * and per-item copy actions. Domain-neutral.
 */
export function MetadataList({ items, columns = 1, className }: MetadataListProps) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-3', columnClass[columns], className)}>
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key -- metadata rows are positional and stable
        <div key={index} className="min-w-0">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-fg-muted)]">
            {item.icon ? (
              <span
                aria-hidden="true"
                className="inline-flex size-4 shrink-0 items-center text-[var(--color-fg-subtle)] [&>svg]:size-4"
              >
                {item.icon}
              </span>
            ) : null}
            {item.label}
          </dt>
          <dd className="mt-0.5 flex items-center gap-1.5 text-sm text-[var(--color-fg-base)]">
            <span className="min-w-0 truncate">{item.value}</span>
            {item.copyValue ? <CopyInline value={item.copyValue} /> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CopyInline({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : 'Copy'}
      onClick={() =>
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        })
      }
      className="inline-flex size-5 shrink-0 items-center justify-center rounded text-[var(--color-fg-subtle)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      {copied ? (
        <Check className="size-3 text-[var(--color-success-fg)]" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );
}
