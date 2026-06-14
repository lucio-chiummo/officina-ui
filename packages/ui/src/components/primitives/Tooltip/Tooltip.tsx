import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { cn } from '@lib/utils/cn';
import {
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type Ref,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  composeRefs,
  toPlacement,
  type FloatingAlign,
  type FloatingSide,
} from '../_internal/floating';

export type TooltipProps = {
  /** Tooltip body shown on hover/focus. */
  content: ReactNode;
  /** The single trigger element the tooltip is attached to. */
  children: ReactElement;
  /** Preferred side to position against the trigger. */
  side?: FloatingSide;
  /** Alignment along the chosen side. */
  align?: FloatingAlign;
  /** Hover open delay in milliseconds. */
  delayMs?: number;
  /** Gap in pixels between trigger and tooltip. */
  sideOffset?: number;
  /** Disable the tooltip entirely. */
  disabled?: boolean;
};

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayMs = 200,
  sideOffset = 6,
  disabled,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const floating = useFloating({
    open: disabled ? false : open,
    onOpenChange: setOpen,
    placement: toPlacement(side, align),
    whileElementsMounted: autoUpdate,
    middleware: [offset(sideOffset), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });
  const hover = useHover(floating.context, {
    delay: { open: delayMs, close: 60 },
    enabled: !disabled,
  });
  const focus = useFocus(floating.context, { enabled: !disabled });
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  const trigger = isValidElement(children)
    ? (() => {
        const childProps = children.props as Record<string, unknown> & {
          ref?: Ref<HTMLElement>;
        };
        return cloneElement(
          children,
          getReferenceProps({
            ...childProps,
            ref: composeRefs(childProps.ref, floating.refs.setReference),
          }),
        );
      })()
    : children;

  return (
    <>
      {trigger}
      {open && !disabled ? (
        <FloatingPortal>
          <div
            ref={floating.refs.setFloating}
            style={floating.floatingStyles}
            {...getFloatingProps({
              className: cn(
                'z-[9999] max-w-xs rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-tooltip-bg)] px-2 py-1',
                'text-xs font-medium text-[var(--color-tooltip-fg)] shadow-[var(--shadow-lg)]',
                'transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
              ),
            })}
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={floating.context}
              className="fill-[var(--color-tooltip-bg)]"
            />
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
}
