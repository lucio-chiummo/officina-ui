import { cn } from '@lib/utils/cn';
import { animate, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';

export type AnimatedNumberProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  value: number;
  /** Format the displayed number. Defaults to locale integer formatting. */
  format?: (value: number) => string;
  /** Animation duration in seconds. */
  duration?: number;
};

/**
 * Count-up number that animates from its previous value to the next. Snaps
 * instantly when the user prefers reduced motion. Drives premium stat displays.
 */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString(),
  duration = 0.8,
  className,
  ...props
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, duration, reduceMotion]);

  return (
    <span
      {...props}
      className={cn('tabular-nums', className)}
      aria-label={format(value)}
      role="status"
    >
      {format(display)}
    </span>
  );
}
