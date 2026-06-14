import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from '@lib/utils/cn';

export type GradientTextProps = ComponentPropsWithoutRef<'span'> & {
  /** Render as a different element (e.g. `h1`, `h2`). */
  as?: ElementType;
  /** Animate the gradient sweep. Disabled automatically under reduced motion. */
  animate?: boolean;
  /** Override the gradient. Defaults to an accent → info token sweep. */
  gradient?: string;
};

const defaultGradient =
  'linear-gradient(90deg, var(--color-accent), var(--color-info), var(--color-accent))';

/**
 * Gradient-filled text for premium headings and accents. Uses background-clip
 * so it inherits font sizing from the surrounding type scale.
 */
export function GradientText({
  as,
  animate = false,
  gradient = defaultGradient,
  className,
  style,
  children,
  ...props
}: GradientTextProps) {
  const Component = as ?? 'span';
  return (
    <Component
      {...props}
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        ...style,
      }}
      className={cn(
        'inline-block bg-clip-text font-semibold',
        animate && 'animate-gradient-x',
        className,
      )}
    >
      {children}
    </Component>
  );
}
