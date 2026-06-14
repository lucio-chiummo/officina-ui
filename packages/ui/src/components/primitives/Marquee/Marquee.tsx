import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

export type MarqueeProps = {
  children: ReactNode;
  speedSeconds?: number;
  className?: string;
};

export function Marquee({ children, speedSeconds = 24, className }: MarqueeProps) {
  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      <div
        className="inline-flex min-w-full animate-[marquee_var(--marquee-speed)_linear_infinite] gap-6"
        style={{ '--marquee-speed': `${speedSeconds}s` } as CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
