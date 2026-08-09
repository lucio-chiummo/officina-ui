import { cn } from '@lib/utils/cn';
import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from 'react';

export type TextareaAutosizeProps = ComponentPropsWithoutRef<'textarea'> & {
  maxRows?: number;
  minRows?: number;
};

export const TextareaAutosize = forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  function TextareaAutosize(
    { className, maxRows = 8, minRows = 2, onInput, style, value, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLTextAreaElement | null>(null);

    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const resize = useCallback(() => {
      const node = ref.current;
      if (!node) return;
      const computed = window.getComputedStyle(node);
      const lineHeight = Number.parseFloat(computed.lineHeight) || 20;
      node.style.height = 'auto';
      node.style.height = `${String(
        Math.min(node.scrollHeight, lineHeight * maxRows) || lineHeight * minRows,
      )}px`;
    }, [maxRows, minRows]);

    useLayoutEffect(() => {
      resize();
    }, [resize, value]);

    return (
      <textarea
        ref={setRef}
        data-density-control="textarea"
        rows={minRows}
        value={value}
        onInput={(event) => {
          resize();
          onInput?.(event);
        }}
        {...props}
        className={cn(
          'focus:ring-[var(--color-accent)]/20 w-full resize-none rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-3 py-2 text-sm text-[var(--color-fg-base)] shadow-[var(--shadow-xs)] outline-none transition-[border-color,box-shadow] focus:border-[var(--color-accent)] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        style={{ maxHeight: `${String(maxRows * 1.5)}rem`, ...style }}
      />
    );
  },
);
