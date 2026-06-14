import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { cn } from '@lib/utils/cn';
import {
  cloneElement,
  isValidElement,
  useEffect,
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

export type PopoverProps = {
  /** Element that toggles the popover; receives the trigger props. */
  trigger: ReactElement;
  /** Panel content, or a render function receiving a `close` callback. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
  /** Preferred side of the trigger to position against. */
  side?: FloatingSide;
  /** Alignment along the chosen side. */
  align?: FloatingAlign;
  /** Gap in pixels between trigger and panel. */
  sideOffset?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Trap focus and block outside interaction while open. */
  modal?: boolean;
  className?: string;
};

export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  open,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  className,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const actualOpen = open ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    if (!actualOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUncontrolledOpen(false);
        onOpenChange?.(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [actualOpen, onOpenChange]);

  const floating = useFloating({
    open: actualOpen,
    onOpenChange: setOpen,
    strategy: 'fixed',
    placement: toPlacement(side, align),
    whileElementsMounted: autoUpdate,
    middleware: [offset(sideOffset), flip(), shift({ padding: 8 })],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(floating.context),
    useDismiss(floating.context),
    useRole(floating.context, { role: modal ? 'dialog' : 'menu' }),
  ]);
  const renderedTrigger = isValidElement(trigger)
    ? (() => {
        const triggerProps = trigger.props as Record<string, unknown> & {
          ref?: Ref<HTMLElement>;
        };
        return cloneElement(
          trigger,
          getReferenceProps({
            ...triggerProps,
            ref: composeRefs(triggerProps.ref, floating.refs.setReference),
          }),
        );
      })()
    : trigger;

  return (
    <>
      {renderedTrigger}
      {actualOpen ? (
        <FloatingPortal>
          <FloatingFocusManager context={floating.context} modal={modal}>
            <div
              ref={floating.refs.setFloating}
              style={floating.floatingStyles}
              {...getFloatingProps({
                className: cn(
                  'z-[9998] min-w-52 max-w-[min(24rem,calc(100vw-1rem))] rounded-[var(--radius-md)] border border-[var(--color-border-strong)]',
                  'bg-[var(--color-bg-base)] p-3.5 text-sm text-[var(--color-fg-base)] shadow-[var(--shadow-xl)] outline-none focus:outline-none focus-visible:outline-none',
                  'transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
                  className,
                ),
              })}
            >
              {typeof children === 'function'
                ? children({ close: () => setOpen(false) })
                : children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}
