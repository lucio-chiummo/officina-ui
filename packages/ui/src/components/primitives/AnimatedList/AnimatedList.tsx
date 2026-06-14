import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export type AnimatedListProps<T> = {
  /** Items to render; add/remove drives enter/exit animations. */
  items: T[];
  /** Returns a stable key per item so motion can track add/remove/reorder. */
  getKey: (item: T, index: number) => string | number;
  /** Renders a single item. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Extra classes for the list container. */
  className?: string;
  /** Extra classes applied to each item wrapper. */
  itemClassName?: string;
  /** Per-item enter delay for a cascading reveal. */
  stagger?: number;
};

/**
 * List that animates items in and out as the array changes — premium feel for
 * notifications, activity feeds, and search results. Honors reduced motion and
 * relies on the app-level `MotionConfig reducedMotion="user"`.
 */
export function AnimatedList<T>({
  items,
  getKey,
  renderItem,
  className,
  itemClassName,
  stagger = 0.04,
}: AnimatedListProps<T>) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <motion.li
            key={getKey(item, index)}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{
              duration: 0.22,
              delay: reduceMotion ? 0 : index * stagger,
              ease: [0.2, 0, 0, 1],
            }}
            className={cn('min-w-0', itemClassName)}
          >
            {renderItem(item, index)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
