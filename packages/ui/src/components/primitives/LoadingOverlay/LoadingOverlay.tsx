import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

import { Spinner } from '../Spinner';

export type LoadingOverlayProps = {
  /** Whether the overlay is shown. */
  visible: boolean;
  /** Optional text shown beneath the spinner. */
  label?: ReactNode;
  /** Blur the underlying content instead of dimming it. */
  blur?: boolean;
  /** Spinner size. Defaults to `'md'`. */
  spinnerSize?: 'sm' | 'md' | 'lg';
  /** Extra classes for the overlay container. */
  className?: string;
  /**
   * When provided, wraps the children in a positioned container and overlays
   * them. When omitted, renders only the overlay (parent must be `relative`).
   */
  children?: ReactNode;
};

/**
 * Contained async overlay for panels, forms, and tables. It traps nothing and
 * owns no data — drive `visible` from the caller's async state.
 */
export function LoadingOverlay({
  visible,
  label,
  blur,
  spinnerSize = 'md',
  className,
  children,
}: LoadingOverlayProps) {
  const overlay = visible ? (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center gap-2',
        'bg-[var(--color-bg-base)]/70',
        blur && 'backdrop-blur-sm',
        'transition-opacity duration-[var(--motion-fast)]',
        className,
      )}
    >
      <Spinner size={spinnerSize} {...(typeof label === 'string' ? { label } : {})} />
      {label ? (
        <span className="text-xs font-medium text-[var(--color-fg-muted)]">{label}</span>
      ) : null}
    </div>
  ) : null;

  if (children === undefined) return overlay;

  return (
    <div className="relative min-w-0" aria-busy={visible}>
      <div className={cn(visible && blur && 'pointer-events-none select-none')}>{children}</div>
      {overlay}
    </div>
  );
}
