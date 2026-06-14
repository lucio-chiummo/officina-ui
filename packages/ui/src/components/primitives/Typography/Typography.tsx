import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementType } from 'react';

const typographyVariants = cva('min-w-0 text-[var(--color-fg-base)]', {
  variants: {
    align: {
      center: 'text-center',
      end: 'text-end',
      justify: 'text-justify',
      left: 'text-left',
      right: 'text-right',
      start: 'text-start',
    },
    gutterBottom: {
      true: 'mb-2',
    },
    leading: {
      normal: 'leading-normal',
      relaxed: 'leading-6',
      tight: 'leading-tight',
    },
    noWrap: {
      true: 'truncate',
    },
    tone: {
      muted: 'text-[var(--color-fg-muted)]',
      base: 'text-[var(--color-fg-base)]',
      subtle: 'text-[var(--color-fg-subtle)]',
      accent: 'text-[var(--color-accent-fg)]',
      danger: 'text-[var(--color-danger-fg)]',
      success: 'text-[var(--color-success-fg)]',
      warning: 'text-[var(--color-warning-fg)]',
    },
    transform: {
      capitalize: 'capitalize',
      lowercase: 'lowercase',
      none: 'normal-case',
      uppercase: 'uppercase',
    },
    variant: {
      display: 'text-4xl font-semibold tracking-tight',
      h1: 'text-3xl font-semibold tracking-tight',
      h2: 'text-2xl font-semibold tracking-tight',
      h3: 'text-xl font-semibold tracking-tight',
      h4: 'text-lg font-semibold tracking-tight',
      title: 'text-base font-semibold tracking-tight',
      body: 'text-sm',
      'body-sm': 'text-xs',
      caption: 'text-[11px]',
      overline: 'text-[10px] font-semibold uppercase tracking-wide',
      code: 'font-mono text-xs',
    },
    weight: {
      bold: 'font-bold',
      medium: 'font-medium',
      regular: 'font-normal',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    tone: 'base',
    variant: 'body',
  },
});

const defaultElement = {
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  code: 'code',
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  overline: 'p',
  title: 'p',
} as const;

const lineClampClass = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
} as const;

export type TypographyProps = ComponentPropsWithoutRef<'p'> &
  VariantProps<typeof typographyVariants> & {
    /** Render as a different element/component while keeping the styles. */
    as?: ElementType;
    /** Truncate after N lines with an ellipsis. */
    lineClamp?: keyof typeof lineClampClass;
  };

export function Typography({
  align,
  as,
  className,
  gutterBottom,
  leading,
  lineClamp,
  noWrap,
  tone,
  transform,
  variant = 'body',
  weight,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElement[variant ?? 'body'];
  return (
    <Component
      {...props}
      className={cn(
        typographyVariants({
          align,
          gutterBottom,
          leading,
          noWrap,
          tone,
          transform,
          variant,
          weight,
        }),
        !noWrap && lineClamp ? lineClampClass[lineClamp] : undefined,
        className,
      )}
    />
  );
}
