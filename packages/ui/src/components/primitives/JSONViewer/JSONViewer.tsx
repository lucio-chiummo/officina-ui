import { cn } from '@lib/utils/cn';
import { type ReactNode } from 'react';

export interface JSONViewerProps {
  /** The value to render as an interactive JSON tree. */
  value: unknown;
  /** Expand all nodes on first render. */
  defaultExpanded?: boolean;
  /** Extra classes for the viewer container. */
  className?: string;
}

function renderValue(value: unknown, name?: string, defaultExpanded = true): ReactNode {
  if (value === null)
    return (
      <span>
        <Key name={name} />
        <span className="text-[var(--color-fg-subtle)]">null</span>
      </span>
    );
  if (typeof value !== 'object')
    return (
      <span>
        <Key name={name} />
        <span className="text-[var(--color-accent)]">{JSON.stringify(value)}</span>
      </span>
    );

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value as Record<string, unknown>);
  return (
    <details open={defaultExpanded} className="pl-3">
      <summary className="cursor-pointer text-[var(--color-fg-muted)] select-none">
        <Key name={name} />
        {Array.isArray(value) ? `Array(${entries.length})` : `Object(${entries.length})`}
      </summary>
      <div className="border-l border-[var(--color-border)] pl-3">
        {entries.map(([key, item]) => (
          <div key={key}>{renderValue(item, key, false)}</div>
        ))}
      </div>
    </details>
  );
}

function Key({ name }: { name?: string | undefined }) {
  return name ? (
    <span className="mr-2 text-[var(--color-fg-base)]">{JSON.stringify(name)}:</span>
  ) : null;
}

export function JSONViewer({ value, defaultExpanded = true, className }: JSONViewerProps) {
  return (
    <div
      className={cn(
        'overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3 font-mono text-xs',
        className,
      )}
    >
      {renderValue(value, undefined, defaultExpanded)}
    </div>
  );
}
