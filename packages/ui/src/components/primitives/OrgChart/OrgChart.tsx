import { cn } from '@lib/utils/cn';
import { type ReactNode } from 'react';

export interface OrgChartNode {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  children?: OrgChartNode[];
}

export interface OrgChartProps {
  node: OrgChartNode;
  className?: string;
}

export function OrgChart({ node, className }: OrgChartProps) {
  return (
    <div
      className={cn(
        'overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4',
        className,
      )}
    >
      <OrgNode node={node} />
    </div>
  );
}

function OrgNode({ node }: { node: OrgChartNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-40 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] px-4 py-3 text-center">
        <div className="text-sm font-semibold text-[var(--color-fg-base)]">{node.label}</div>
        {node.description ? (
          <div className="mt-1 text-xs text-[var(--color-fg-muted)]">{node.description}</div>
        ) : null}
      </div>
      {node.children?.length ? (
        <>
          <div className="h-5 w-px bg-[var(--color-border)]" />
          <div className="flex gap-4">
            {node.children.map((child) => (
              <OrgNode key={child.id} node={child} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
