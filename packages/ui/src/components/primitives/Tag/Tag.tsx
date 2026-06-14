import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const tagVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        default:
          'border-[var(--color-border-strong)] bg-[var(--color-bg-muted)] text-[var(--color-fg-base)]',
        success:
          'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-fg)]',
        warning:
          'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]',
        danger:
          'border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export type TagProps = VariantProps<typeof tagVariants> & {
  /** Tag contents (label text or nodes). */
  children: ReactNode;
  className?: string;
};

export function Tag({ children, tone, className }: TagProps) {
  return <span className={cn(tagVariants({ tone }), className)}>{children}</span>;
}
