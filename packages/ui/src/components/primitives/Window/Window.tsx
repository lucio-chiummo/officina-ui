import { cn } from '@lib/utils/cn';
import { Maximize2, Minimize2, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import { Portal } from '../Portal';

export type WindowProps = {
  /** Whether the window is open (controlled). */
  open: boolean;
  /** Called when the window is closed. */
  onClose: () => void;
  /** Window title bar content. */
  title: ReactNode;
  /** Window body content. */
  children: ReactNode;
  /** Starting top-left position in pixels. */
  initialPosition?: { x: number; y: number };
  /** Starting size in pixels. */
  initialSize?: { width: number; height: number };
  /** Minimum width when resizing. */
  minWidth?: number;
  /** Minimum height when resizing. */
  minHeight?: number;
  /** Allow the user to resize the window. */
  resizable?: boolean;
  /** Show the maximize control. */
  maximizable?: boolean;
  /** Stack order among multiple windows. */
  zIndex?: number;
  /** Called when the window gains focus (e.g. to raise it). */
  onFocus?: () => void;
  /** Extra classes for the window container. */
  className?: string;
};

/**
 * Draggable, resizable floating window. Non-modal — page behind stays
 * interactive. For multi-window dashboards, tool palettes, and pop-out panels.
 */
export function Window({
  open,
  onClose,
  title,
  children,
  initialPosition = { x: 80, y: 80 },
  initialSize = { width: 480, height: 360 },
  minWidth = 280,
  minHeight = 160,
  resizable = true,
  maximizable = true,
  zIndex = 50,
  onFocus,
  className,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [maximized, setMaximized] = useState(false);
  const dragState = useRef<{
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    origin: { x: number; y: number; width: number; height: number };
  } | null>(null);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragState.current;
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (drag.mode === 'move') {
        setPosition({
          x: Math.max(drag.origin.x + dx, 0),
          y: Math.max(drag.origin.y + dy, 0),
        });
      } else {
        setSize({
          width: Math.max(drag.origin.width + dx, minWidth),
          height: Math.max(drag.origin.height + dy, minHeight),
        });
      }
    },
    [minWidth, minHeight],
  );

  const endDrag = useCallback(() => {
    dragState.current = null;
    document.removeEventListener('pointermove', onPointerMove);
  }, [onPointerMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', endDrag);
    };
  }, [onPointerMove, endDrag]);

  const startDrag = (mode: 'move' | 'resize') => (event: ReactPointerEvent) => {
    if (maximized) return;
    event.preventDefault();
    dragState.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...position, ...size },
    };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', endDrag, { once: true });
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const frame = maximized
    ? { top: 0, left: 0, width: '100vw', height: '100vh' }
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="false"
        aria-label={typeof title === 'string' ? title : 'Window'}
        className={cn(
          'fixed flex flex-col overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] shadow-[var(--shadow-lg)]',
          className,
        )}
        style={{ ...frame, zIndex }}
        onPointerDown={onFocus}
      >
        <div
          className={cn(
            'flex h-10 shrink-0 select-none items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3',
            !maximized && 'cursor-move',
          )}
          onPointerDown={startDrag('move')}
          onDoubleClick={() => {
            if (maximizable) setMaximized((m) => !m);
          }}
        >
          <span className="truncate text-sm font-medium text-[var(--color-fg-base)]">{title}</span>
          <div className="flex items-center gap-1">
            {maximizable ? (
              <button
                type="button"
                aria-label={maximized ? 'Restore window' : 'Maximize window'}
                onClick={() => {
                  setMaximized((m) => !m);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                className="focus-visible:ring-[var(--color-accent)]/40 rounded p-1 text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)] focus-visible:outline-none focus-visible:ring-2"
              >
                {maximized ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Close window"
              onClick={onClose}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              className="hover:bg-[var(--color-danger)]/10 focus-visible:ring-[var(--color-accent)]/40 rounded p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="grow overflow-auto p-4">{children}</div>
        {resizable && !maximized ? (
          <div
            aria-hidden="true"
            onPointerDown={startDrag('resize')}
            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
            style={{
              background:
                'linear-gradient(135deg, transparent 50%, var(--color-border-strong) 50%)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            }}
          />
        ) : null}
      </div>
    </Portal>
  );
}
