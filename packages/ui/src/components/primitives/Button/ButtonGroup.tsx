import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

export type ButtonGroupProps = {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  attached = true,
  className,
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex',
        orientation === 'vertical' && 'flex-col',
        attached &&
          orientation === 'horizontal' &&
          '[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child):not(:last-child)]:rounded-none',
        attached &&
          orientation === 'vertical' &&
          '[&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child):not(:last-child)]:rounded-none',
        className,
      )}
    >
      {children}
    </div>
  );
}
