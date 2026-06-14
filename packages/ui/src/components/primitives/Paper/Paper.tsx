import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef } from 'react';

const paperVariants = cva(
  'rounded-lg bg-[var(--color-bg-base)] transition-[background-color,border-color,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-standard)]',
  {
    variants: {
      elevation: {
        0: 'shadow-none',
        1: 'shadow-[var(--shadow-xs)]',
        2: 'shadow-[var(--shadow-sm)]',
        3: 'shadow-[var(--shadow-md)]',
      },
      variant: {
        elevated: 'border border-transparent',
        outlined: 'border border-[var(--color-border)]',
        subtle: 'border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]',
      },
    },
    defaultVariants: {
      elevation: 1,
      variant: 'outlined',
    },
  },
);

export type PaperProps = ComponentPropsWithoutRef<'div'> & VariantProps<typeof paperVariants>;

export function Paper({ className, elevation, variant, ...props }: PaperProps) {
  return <div {...props} className={cn(paperVariants({ elevation, variant }), className)} />;
}
