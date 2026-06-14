import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold',
    'whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
    'active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] border border-[var(--color-accent-hover)]',
          'hover:bg-[var(--color-accent-hover)]',
        ],
        secondary: [
          'bg-[var(--color-bg-base)] text-[var(--color-fg-base)] border border-[var(--color-border)]',
          'hover:bg-[var(--color-bg-muted)]',
        ],
        outline: [
          'bg-[var(--color-bg-base)] text-[var(--color-fg-base)] border border-[var(--color-border)]',
          'hover:bg-[var(--color-bg-muted)]',
        ],
        ghost: [
          'bg-transparent text-[var(--color-fg-base)] border border-transparent',
          'hover:bg-[var(--color-bg-muted)]',
        ],
        soft: [
          'bg-[var(--color-accent-muted)] text-[var(--color-accent-fg)] border border-transparent',
          'hover:bg-[var(--color-accent-subtle)]',
        ],
        danger: [
          'bg-[var(--color-danger)] text-[var(--color-danger-contrast)] border border-[var(--color-danger-hover)]',
          'hover:bg-[var(--color-danger-hover)]',
        ],
        success: [
          'bg-[var(--color-success)] text-[var(--color-success-contrast)] border border-[var(--color-success-hover)]',
          'hover:bg-[var(--color-success-hover)]',
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-3.5 text-sm',
        lg: 'h-11 px-5 text-sm',
        icon: 'size-9',
        'icon-sm': 'size-7',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Show a loading spinner and disable the button while an action is in flight. */
    isLoading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, isLoading, disabled, children, type = 'button', ...rest },
  ref,
) {
  const resolvedSize = size ?? 'md';
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      data-density-control="button"
      data-density-size={resolvedSize}
      {...rest}
      className={cn(buttonVariants({ variant, size: resolvedSize }), className)}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
});
