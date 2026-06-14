import { cn } from '@lib/utils/cn';
import { useReducedMotion } from 'framer-motion';
import { useRef, useState, type ComponentPropsWithoutRef, type PointerEvent } from 'react';

export type TiltProps = ComponentPropsWithoutRef<'div'> & {
  /** Maximum tilt in degrees. */
  max?: number;
  /** Scale applied while hovering. */
  scale?: number;
};

/**
 * 3D pointer-tilt surface for premium feature and pricing cards. Tilt follows
 * the cursor and resets on leave. Disabled under `prefers-reduced-motion`.
 */
export function Tilt({
  max = 10,
  scale = 1.02,
  className,
  style,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>();

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const node = ref.current;
    if (reduceMotion || !node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`,
    );
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    setTransform(undefined);
  };

  return (
    <div
      {...props}
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        ...style,
        transform,
        transition: 'transform var(--motion-base) var(--ease-standard)',
        transformStyle: 'preserve-3d',
      }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </div>
  );
}
