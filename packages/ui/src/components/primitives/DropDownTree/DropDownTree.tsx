import { cn } from '@lib/utils/cn';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { useId, useMemo, useState, type ReactNode } from 'react';

import { Popover } from '../Popover';
import { type TreeNode } from '../TreeView';

export type DropDownTreeProps = {
  /** Hierarchical tree nodes to choose from. */
  nodes: TreeNode[];
  /** Id of the selected node, or `undefined` when empty (controlled). */
  value: string | undefined;
  /** Called with the newly selected node id. */
  onChange: (id: string | undefined) => void;
  /** Field label shown above the control. */
  label?: string;
  /** Placeholder text when nothing is selected. */
  placeholder?: string;
  /** Only allow selecting leaf nodes (no children). */
  leafOnly?: boolean;
  /** Ids of branches expanded on first render. */
  defaultExpandedIds?: string[];
  /** Extra classes for the control wrapper. */
  className?: string;
};

function findLabel(nodes: TreeNode[], id: string | undefined): ReactNode {
  if (!id) return null;
  for (const node of nodes) {
    if (node.id === id) return node.label;
    if (node.children) {
      const found = findLabel(node.children, id);
      if (found != null) return found;
    }
  }
  return null;
}

function Branch({
  node,
  depth,
  expanded,
  toggle,
  value,
  select,
  leafOnly,
}: {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  value: string | undefined;
  select: (id: string) => void;
  leafOnly: boolean;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isOpen = expanded.has(node.id);
  const selectable = !leafOnly || !hasChildren;
  const isSelected = value === node.id;

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isOpen : undefined} aria-selected={isSelected}>
      <div className="flex items-center gap-1" style={{ paddingInlineStart: `${depth * 16}px` }}>
        {hasChildren ? (
          <button
            type="button"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            onClick={() => {
              toggle(node.id);
            }}
            className="focus-visible:ring-[var(--color-accent)]/40 rounded p-0.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-base)] focus-visible:outline-none focus-visible:ring-2"
          >
            {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
        ) : (
          <span className="w-[18px]" aria-hidden="true" />
        )}
        <button
          type="button"
          disabled={!selectable}
          onClick={() => {
            if (selectable) select(node.id);
          }}
          className={cn(
            'flex grow items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-[var(--motion-fast)]',
            'focus-visible:ring-[var(--color-accent)]/40 focus-visible:outline-none focus-visible:ring-2',
            selectable
              ? 'text-[var(--color-fg-base)] hover:bg-[var(--color-bg-subtle)]'
              : 'cursor-default text-[var(--color-fg-muted)]',
            isSelected && 'bg-[var(--color-accent)]/8 font-medium text-[var(--color-accent)]',
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            {node.icon}
            {node.label}
          </span>
          {isSelected ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : null}
        </button>
      </div>
      {hasChildren && isOpen ? (
        <ul role="group">
          {node.children?.map((child) => (
            <Branch
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              value={value}
              select={select}
              leafOnly={leafOnly}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** Select-style trigger opening a tree picker — for hierarchical taxonomies. */
export function DropDownTree({
  nodes,
  value,
  onChange,
  label,
  placeholder = 'Select…',
  leafOnly = false,
  defaultExpandedIds = [],
  className,
}: DropDownTreeProps) {
  const id = useId();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedIds));
  const [open, setOpen] = useState(false);
  const display = useMemo(() => findLabel(nodes, value), [nodes, value]);

  const toggle = (nodeId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-fg-base)]">
          {label}
        </label>
      ) : null}
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button
            id={id}
            type="button"
            className="focus-visible:ring-[var(--color-accent)]/20 flex h-9 w-full items-center justify-between rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 py-2 text-left text-sm text-[var(--color-fg-base)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2"
          >
            <span className={display ? '' : 'text-[var(--color-fg-subtle)]'}>
              {display ?? placeholder}
            </span>
            <ChevronDown className="size-4 text-[var(--color-fg-subtle)]" aria-hidden="true" />
          </button>
        }
        className="max-h-72 w-[min(320px,94vw)] overflow-auto p-1.5"
      >
        <ul role="tree" aria-label={label ?? 'Tree options'}>
          {nodes.map((node) => (
            <Branch
              key={node.id}
              node={node}
              depth={0}
              expanded={expanded}
              toggle={toggle}
              value={value}
              select={(nodeId) => {
                onChange(nodeId);
                setOpen(false);
              }}
              leafOnly={leafOnly}
            />
          ))}
        </ul>
      </Popover>
    </div>
  );
}
