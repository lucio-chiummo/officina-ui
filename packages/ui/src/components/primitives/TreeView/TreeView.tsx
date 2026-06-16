import { cn } from '@lib/utils/cn';
import { useState, type ReactNode } from 'react';

export type TreeNode = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
};

type TreeViewProps = {
  /** Hierarchical nodes to render. */
  nodes: TreeNode[];
  /** Ids of branches expanded on first render. */
  defaultExpandedIds?: string[];
  /** Called with the node id when a node is selected. */
  onSelect?: (id: string) => void;
  /** Extra classes for the tree container. */
  className?: string;
};

export function TreeView({ nodes, defaultExpandedIds = [], onSelect, className }: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedIds));

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ul role="tree" className={cn('list-none text-sm', className)}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          expanded={expanded}
          toggle={toggle}
          {...(onSelect ? { onSelect } : {})}
        />
      ))}
    </ul>
  );
}

function TreeItem({
  node,
  depth,
  expanded,
  toggle,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  onSelect?: (id: string) => void;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isOpen = expanded.has(node.id);

  return (
    <li role="treeitem" aria-selected={false} aria-expanded={hasChildren ? isOpen : undefined}>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) toggle(node.id);
          onSelect?.(node.id);
        }}
        style={{ paddingInlineStart: `${String(depth * 16 + 8)}px` }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-[var(--color-bg-muted)]"
      >
        {hasChildren ? (
          <span aria-hidden="true" className="size-3 text-xs text-[var(--color-fg-muted)]">
            {isOpen ? '▾' : '▸'}
          </span>
        ) : (
          <span aria-hidden="true" className="size-3" />
        )}
        {node.icon}
        <span className="text-[var(--color-fg-muted)]">{node.label}</span>
      </button>
      {hasChildren && isOpen ? (
        <ul role="group" className="list-none">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              {...(onSelect ? { onSelect } : {})}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
