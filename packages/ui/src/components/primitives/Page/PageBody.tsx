import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

type PageBodyProps = { children: ReactNode; className?: string };

export function PageBody({ children, className }: PageBodyProps) {
  return <div className={cn('animate-fade-in flex flex-col gap-6', className)}>{children}</div>;
}
