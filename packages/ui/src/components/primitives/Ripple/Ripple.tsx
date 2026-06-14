import { cn } from '@lib/utils/cn';
import { useRef, useState, type ComponentPropsWithoutRef, type PointerEvent } from 'react';

type RippleInstance = { key: number; x: number; y: number; size: number };

export type RippleProps = ComponentPropsWithoutRef<'span'> & {
  /** Ripple color. Defaults to a translucent current-color tint. */
  color?: string;
  disabled?: boolean;
};

/**
 * Wraps interactive content with a material-style click ripple. Decorative and
 * skipped under `prefers-reduced-motion`. Keep it around buttons, list rows, or
 * any pressable surface.
 */
export function Ripple({
  color = 'currentColor',
  disabled,
  className,
  children,
  onPointerDown,
  ...props
}: RippleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const counter = useRef(0);
  const [ripples, setRipples] = useState<RippleInstance[]>([]);

  const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(event);
    const node = ref.current;
    if (disabled || !node) return;
    const rect = node.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const key = counter.current++;
    setRipples((prev) => [
      ...prev,
      {
        key,
        size,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
      },
    ]);
  };

  return (
    <span
      {...props}
      ref={ref}
      onPointerDown={handlePointerDown}
      className={cn('relative inline-flex overflow-hidden', className)}
    >
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {ripples.map((ripple) => (
          <span
            key={ripple.key}
            className="officina-ripple-dot absolute rounded-full opacity-30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              background: color,
            }}
            onAnimationEnd={() => setRipples((prev) => prev.filter((r) => r.key !== ripple.key))}
          />
        ))}
      </span>
    </span>
  );
}
