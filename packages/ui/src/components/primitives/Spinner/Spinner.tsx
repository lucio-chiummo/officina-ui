import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef } from 'react';

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        xs: 'size-3',
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-7',
        xl: 'size-9',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type SpinnerProps = ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof spinnerVariants> & {
    /** Accessible status label announced to screen readers. Defaults to "Loading…". */
    label?: string;
  };

export function Spinner({ className, size, label = 'Loading…', ...props }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} {...props}>
      <span
        aria-hidden="true"
        className={cn(spinnerVariants({ size }), 'text-[var(--color-accent)]', className)}
      />
    </span>
  );
}
