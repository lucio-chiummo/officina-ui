import { cn } from '@lib/utils/cn';
import { useRef, useState, type ComponentPropsWithoutRef, type CSSProperties } from 'react';

export type SpotlightCardProps = ComponentPropsWithoutRef<'div'> & {
  /** Glow color. Defaults to the accent token. */
  glowColor?: string;
  /** Glow radius in pixels. */
  radius?: number;
  /** Peak glow opacity (0–1). */
  intensity?: number;
};

/**
 * Surface with a radial glow that follows the cursor — the signature premium
 * hover used by Linear/Vercel-style dashboards. Pointer-driven only, so it adds
 * no ambient motion.
 */
export function SpotlightCard({
  glowColor = 'var(--color-accent)',
  radius = 280,
  intensity = 0.12,
  className,
  style,
  children,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (node) {
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
      node.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
    }
    onPointerMove?.(event);
  };

  return (
    <div
      ref={ref}
      {...props}
      onPointerMove={handlePointerMove}
      onPointerEnter={(event) => {
        setActive(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setActive(false);
        onPointerLeave?.(event);
      }}
      style={
        {
          ...style,
          '--spotlight-radius': `${radius}px`,
          '--spotlight-color': glowColor,
          '--spotlight-intensity': active ? intensity : 0,
        } as CSSProperties
      }
      className={cn(
        'group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-5 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow] duration-[var(--motion-base)] hover:border-[var(--color-border-strong)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-[var(--motion-base)]"
        style={{
          opacity: 'var(--spotlight-intensity)',
          background:
            'radial-gradient(var(--spotlight-radius) circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight-color), transparent 65%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
