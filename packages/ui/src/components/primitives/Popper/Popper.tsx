import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  type Placement,
} from '@floating-ui/react';
import { cn } from '@lib/utils/cn';
import { useEffect, type ReactNode } from 'react';

export type PopperProps = {
  /** Element to position the floating content against. */
  anchor: HTMLElement | null;
  /** Floating content. */
  children: ReactNode;
  className?: string;
  /** Whether the floating content is rendered. */
  open: boolean;
  /** Preferred placement relative to the anchor. */
  placement?: Placement;
};

export function Popper({
  anchor,
  children,
  className,
  open,
  placement = 'bottom-start',
}: PopperProps) {
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    open,
    placement,
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    refs.setReference(anchor);
  }, [anchor, refs]);

  if (!open || !anchor) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={cn(
          'z-[9998] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3 text-sm text-[var(--color-fg-base)] shadow-[var(--shadow-lg)]',
          className,
        )}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}
