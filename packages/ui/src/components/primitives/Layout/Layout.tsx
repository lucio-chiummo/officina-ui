import { cn } from '@lib/utils/cn';
import { Children, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

type BoxProps = ComponentPropsWithoutRef<'div'> & {
  as?: ElementType;
};

export function Box({ as: Component = 'div', className, ...props }: BoxProps) {
  return <Component {...props} className={cn('min-w-0', className)} />;
}

const containerSizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-none',
} as const;

export type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  size?: keyof typeof containerSizes;
};

export function Container({ className, size = 'xl', ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', containerSizes[size], className)}
    />
  );
}

const stackDirections = {
  row: 'flex-row',
  column: 'flex-col',
} as const;

const stackAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

const stackJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

const stackGaps = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
} as const;

export type StackProps = ComponentPropsWithoutRef<'div'> & {
  /** Cross-axis alignment of children. Defaults to `'stretch'`. */
  align?: keyof typeof stackAlign;
  /** Flex direction of the stack. Defaults to `'column'`. */
  direction?: keyof typeof stackDirections;
  /** Element rendered between each child as a separator. */
  divider?: ReactNode;
  /** Spacing scale between children. Defaults to `3`. */
  gap?: keyof typeof stackGaps;
  /** Main-axis distribution of children. Defaults to `'start'`. */
  justify?: keyof typeof stackJustify;
  /** Allow children to wrap onto multiple lines. */
  wrap?: boolean;
};

export function Stack({
  align = 'stretch',
  children,
  className,
  direction = 'column',
  divider,
  gap = 3,
  justify = 'start',
  wrap,
  ...props
}: StackProps) {
  const items = divider ? Children.toArray(children) : [];
  const content =
    divider && items.length > 0
      ? items.flatMap((child, index) =>
          index === 0
            ? [child]
            : [
                <span key={`divider-${String(index)}`} aria-hidden="true">
                  {divider}
                </span>,
                child,
              ],
        )
      : children;

  return (
    <div
      {...props}
      className={cn(
        'flex min-w-0',
        stackDirections[direction],
        stackAlign[align],
        stackJustify[justify],
        stackGaps[gap],
        wrap && 'flex-wrap',
        className,
      )}
    >
      {content}
    </div>
  );
}

export type GridProps = ComponentPropsWithoutRef<'div'> & {
  /** Fixed column count; ignored when `minChildWidth` is set. */
  columns?: number;
  /** Spacing scale between grid cells. */
  gap?: keyof typeof stackGaps;
  /** Min cell width (px) for an auto-responsive grid. Overrides `columns`. */
  minChildWidth?: number;
};

export function Grid({ className, columns, gap = 3, minChildWidth, style, ...props }: GridProps) {
  const gridTemplateColumns = minChildWidth
    ? `repeat(auto-fit, minmax(min(${String(minChildWidth)}px, 100%), 1fr))`
    : `repeat(${String(columns ?? 1)}, minmax(0, 1fr))`;

  return (
    <div
      {...props}
      className={cn('grid min-w-0', stackGaps[gap], className)}
      style={{ gridTemplateColumns, ...style }}
    />
  );
}
