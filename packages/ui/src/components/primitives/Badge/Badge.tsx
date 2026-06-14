import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef } from 'react';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full font-semibold', {
  variants: {
    variant: {
      neutral: 'bg-[var(--color-bg-muted)] text-[var(--color-fg-base)]',
      success:
        'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)] dark:bg-[var(--color-success-subtle)] dark:text-[var(--color-success-fg)]',
      warning:
        'bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)] dark:bg-[var(--color-warning-subtle)] dark:text-[var(--color-warning-fg)]',
      danger:
        'bg-[var(--color-danger-subtle)] text-[var(--color-danger-fg)] dark:bg-[var(--color-danger-subtle)] dark:text-[var(--color-danger-fg)]',
      info: 'bg-[var(--color-info-subtle)] text-[var(--color-info-fg)] dark:bg-[var(--color-info-subtle)] dark:text-[var(--color-info-fg)]',
      accent: 'bg-[var(--color-accent-muted)] text-[var(--color-accent-fg)]',
    },
    size: {
      sm: 'px-2 py-0.5 text-[10px]',
      md: 'px-2.5 py-0.5 text-xs',
    },
  },
  defaultVariants: { variant: 'neutral', size: 'md' },
});

export type BadgeProps = ComponentPropsWithoutRef<'span'> &
  Omit<VariantProps<typeof badgeVariants>, 'variant'> & {
    /** Semantic colour. `error` is accepted as an alias of `danger`. */
    variant?: VariantProps<typeof badgeVariants>['variant'] | 'error';
    /** Render a leading status dot in the current colour. */
    dot?: boolean;
    /** Alias of `variant`, kept for ergonomic status labelling. */
    tone?: VariantProps<typeof badgeVariants>['variant'] | 'error';
  };

export function Badge({ className, variant, tone, size, dot, children, ...props }: BadgeProps) {
  const requestedVariant = variant ?? tone;
  const resolvedVariant = requestedVariant === 'error' ? 'danger' : requestedVariant;
  return (
    <span {...props} className={cn(badgeVariants({ variant: resolvedVariant, size }), className)}>
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
