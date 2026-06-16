import type { CSSProperties, ComponentProps, ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
import { GripVertical } from 'lucide-react';
import { Group, Panel as BasePanel, Separator as PanelResizeHandle } from 'react-resizable-panels';

export type ResizablePanelsProps = {
  direction: 'horizontal' | 'vertical';
  children: ReactNode;
  autoSaveId?: string;
  className?: string;
};

export function ResizablePanels({
  direction,
  children,
  autoSaveId,
  className,
}: ResizablePanelsProps) {
  return (
    <Group
      orientation={direction}
      className={cn('size-full min-h-0 min-w-0 overflow-hidden', className)}
      {...(autoSaveId ? { id: autoSaveId } : {})}
    >
      {children}
    </Group>
  );
}

export function PanelHandle(props: ComponentProps<typeof PanelResizeHandle>) {
  return (
    <PanelResizeHandle
      {...props}
      className={cn(
        'group relative flex shrink-0 select-none items-center justify-center rounded-sm bg-[var(--color-bg-muted)]',
        'touch-none transition-[background-color,box-shadow,opacity] duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
        'hover:bg-[var(--color-accent-muted)] hover:shadow-[var(--shadow-sm)]',
        'focus-visible:ring-[var(--color-accent)]/25 focus:outline-none focus-visible:ring-2',
        'data-[separator=active]:bg-[var(--color-accent-muted)] data-[separator=focus]:bg-[var(--color-accent-muted)]',
        'aria-[orientation=vertical]:w-3 aria-[orientation=vertical]:cursor-col-resize',
        'aria-[orientation=horizontal]:h-3 aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-row-resize',
        props.className,
      )}
    >
      <span className="pointer-events-none absolute rounded-full bg-[var(--color-border-strong)] transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:bg-[var(--color-accent)] aria-[orientation=horizontal]:h-px aria-[orientation=vertical]:h-10 aria-[orientation=horizontal]:w-10 aria-[orientation=vertical]:w-px group-data-[separator=active]:bg-[var(--color-accent)] group-data-[separator=focus]:bg-[var(--color-accent)]" />
      <GripVertical className="pointer-events-none relative z-10 size-3 text-[var(--color-accent)] opacity-70 transition-[color,opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:opacity-100 aria-[orientation=horizontal]:rotate-90 group-data-[separator=active]:opacity-100 group-data-[separator=focus]:opacity-100" />
    </PanelResizeHandle>
  );
}

type PanelProps = ComponentProps<typeof BasePanel> & {
  scroll?: 'auto' | 'hidden' | 'x' | 'y';
};

export function Panel({ className, scroll = 'hidden', style, ...props }: PanelProps) {
  const overflowStyle: CSSProperties =
    scroll === 'auto'
      ? {}
      : scroll === 'x'
        ? { overflowX: 'auto', overflowY: 'hidden' }
        : scroll === 'y'
          ? { overflowX: 'hidden', overflowY: 'auto' }
          : { overflow: 'hidden' };

  return (
    <BasePanel
      {...props}
      className={cn('min-h-0 min-w-0 overflow-hidden', className)}
      style={{ ...overflowStyle, ...style }}
    />
  );
}
