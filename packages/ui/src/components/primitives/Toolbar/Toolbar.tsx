import type { ReactNode } from 'react';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '../Button';
import { Dropdown, type DropdownSection } from '../Dropdown';
import { Separator } from '../Separator';

export type ToolbarProps = {
  /** Control groups; each inner array renders as a divided cluster. */
  groups: ReactNode[][];
  /** Actions collapsed into an overflow menu. */
  overflow?: DropdownSection[];
};

export function Toolbar({ groups, overflow }: ToolbarProps) {
  return (
    <div
      role="toolbar"
      className="flex min-w-0 items-center gap-2 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-1 transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)]"
    >
      {groups.map((group, index) => (
        <div key={`group-${String(index + 1)}`} className="flex items-center gap-1">
          {index > 0 ? <Separator orientation="vertical" className="mx-1 h-6" /> : null}
          {group}
        </div>
      ))}
      {overflow ? (
        <Dropdown
          trigger={
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          }
          sections={overflow}
        />
      ) : null}
    </div>
  );
}
