import type { ReactElement, ReactNode } from 'react';

import { Tooltip } from '../Tooltip';

export type HoverCardProps = {
  /** Element that reveals the card on hover/focus. */
  trigger: ReactElement;
  /** Card content shown on hover. */
  children: ReactNode;
  /** Side of the trigger to position the card. */
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export function HoverCard({ trigger, children, side = 'bottom' }: HoverCardProps) {
  return (
    <Tooltip content={<div className="w-72 p-1 text-sm">{children}</div>} side={side} delayMs={120}>
      {trigger}
    </Tooltip>
  );
}
