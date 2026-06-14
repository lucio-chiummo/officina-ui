import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

import { cn } from '@lib/utils/cn';

export type BorderBeamProps = ComponentPropsWithoutRef<'div'> & {
  /** Beam thickness in pixels. */
  size?: number;
  /** Full rotation duration in seconds. */
  duration?: number;
  /** Beam color. Defaults to the accent token. */
  color?: string;
};

/**
 * Surface with a light that travels around its border — a premium accent for
 * upsell cards, active states, and hero panels. The beam is purely decorative
 * and pauses under `prefers-reduced-motion`.
 */
export function BorderBeam({
  size = 2,
  duration = 6,
  color = 'var(--color-accent)',
  className,
  style,
  children,
  ...props
}: BorderBeamProps) {
  return (
    <div
      {...props}
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-5',
        className,
      )}
      style={style}
    >
      <span
        aria-hidden="true"
        className="animate-border-beam pointer-events-none absolute inset-0 rounded-[inherit]"
        style={
          {
            '--officina-beam-duration': `${duration}s`,
            padding: `${size}px`,
            background: `conic-gradient(from var(--officina-beam-angle), transparent 0%, ${color} 8%, transparent 22%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          } as CSSProperties
        }
      />
      <div className="relative">{children}</div>
    </div>
  );
}
