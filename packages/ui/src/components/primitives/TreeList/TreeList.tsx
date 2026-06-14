import { cn } from '@lib/utils/cn';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

export type TreeListRow = {
  id: string;
  children?: TreeListRow[];
} & Record<string, unknown>;

export type TreeListColumn<R extends TreeListRow = TreeListRow> = {
  key: string;
  header: ReactNode;
  width?: string;
  align?: 'left' | 'right';
  render?: (row: R) => ReactNode;
};

export type TreeListProps<R extends TreeListRow = TreeListRow> = {
  /** Hierarchical row data; each row may carry nested children. */
  rows: R[];
  /** Column definitions describing how to render each cell. */
  columns: TreeListColumn<R>[];
  /** Ids of branches expanded on first render. */
  defaultExpandedIds?: string[];
  /** Expand every branch initially. */
  defaultExpandAll?: boolean;
  /** Called when a row is clicked. */
  onRowClick?: (row: R) => void;
  /** Highlighted row id. */
  selectedId?: string;
  /** Text shown when there are no rows. */
  emptyMessage?: string;
  /** Extra classes for the tree container. */
  className?: string;
};

type FlatRow<R extends TreeListRow> = {
  row: R;
  depth: number;
  hasChildren: boolean;
  /** aria-setsize / aria-posinset bookkeeping */
  setSize: number;
  posInSet: number;
};

function collectIds(rows: TreeListRow[], acc: string[] = []): string[] {
  for (const row of rows) {
    if (row.children?.length) {
      acc.push(row.id);
      collectIds(row.children, acc);
    }
  }
  return acc;
}

function flatten<R extends TreeListRow>(
  rows: R[],
  expanded: Set<string>,
  depth = 0,
  out: FlatRow<R>[] = [],
): FlatRow<R>[] {
  rows.forEach((row, index) => {
    const children = (row.children ?? []) as R[];
    const hasChildren = children.length > 0;
    out.push({ row, depth, hasChildren, setSize: rows.length, posInSet: index + 1 });
    if (hasChildren && expanded.has(row.id)) {
      flatten(children, expanded, depth + 1, out);
    }
  });
  return out;
}

/**
 * Hierarchical data grid — rows expand/collapse in place while staying aligned
 * to columns. KendoUI TreeList equivalent for org structures, BOM tables,
 * account trees, and file systems.
 */
export function TreeList<R extends TreeListRow = TreeListRow>({
  rows,
  columns,
  defaultExpandedIds,
  defaultExpandAll = false,
  onRowClick,
  selectedId,
  emptyMessage = 'No data',
  className,
}: TreeListProps<R>) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandAll ? collectIds(rows) : (defaultExpandedIds ?? [])),
  );

  const flat = useMemo(() => flatten(rows, expanded), [rows, expanded]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const firstKey = columns[0]?.key;

  return (
    <div
      className={cn(
        'overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)]',
        className,
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role -- treegrid is the correct ARIA role for an expandable hierarchical table (WAI-ARIA treegrid pattern) */}
      <table role="treegrid" className="w-full border-collapse text-sm">
        <thead className="bg-[var(--color-bg-subtle)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  'border-b border-[var(--color-border)] px-3 py-2 text-[11px] font-semibold tracking-wide text-[var(--color-fg-muted)] uppercase',
                  column.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-subtle)]">
          {flat.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-8 text-center text-[var(--color-fg-subtle)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            flat.map(({ row, depth, hasChildren, setSize, posInSet }) => {
              const isOpen = expanded.has(row.id);
              const isSelected = selectedId === row.id;
              return (
                <tr
                  key={row.id}
                  aria-level={depth + 1}
                  aria-setsize={setSize}
                  aria-posinset={posInSet}
                  aria-expanded={hasChildren ? isOpen : undefined}
                  aria-selected={isSelected}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'transition-colors duration-[var(--motion-fast)]',
                    onRowClick && 'cursor-pointer hover:bg-[var(--color-bg-subtle)]',
                    isSelected && 'bg-[var(--color-accent)]/8',
                  )}
                >
                  {columns.map((column) => {
                    const content = column.render
                      ? column.render(row)
                      : ((row[column.key] ?? '') as ReactNode);
                    const isTreeCell = column.key === firstKey;
                    return (
                      <td
                        key={column.key}
                        className={cn(
                          'px-3 py-2 text-[var(--color-fg-base)]',
                          column.align === 'right' && 'text-right tabular-nums',
                        )}
                      >
                        {isTreeCell ? (
                          <span
                            className="flex items-center gap-1"
                            style={{ paddingInlineStart: `${depth * 20}px` }}
                          >
                            {hasChildren ? (
                              <button
                                type="button"
                                aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggle(row.id);
                                }}
                                className="rounded p-0.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-base)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 focus-visible:outline-none"
                              >
                                {isOpen ? (
                                  <ChevronDown className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-3.5" />
                                )}
                              </button>
                            ) : (
                              <span className="w-[18px]" aria-hidden="true" />
                            )}
                            {content}
                          </span>
                        ) : (
                          content
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
