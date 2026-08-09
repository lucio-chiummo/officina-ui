import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
} as const;

const actionAlign = {
  between: 'justify-between',
  center: 'justify-center',
  end: 'justify-end',
  start: 'justify-start',
} as const;

export type FormGridProps = ComponentPropsWithoutRef<'div'> & {
  columns?: keyof typeof gridColumns;
};

export function FormGrid({ children, className, columns = 2, ...props }: FormGridProps) {
  return (
    <div {...props} className={cn('grid gap-4', gridColumns[columns], className)}>
      {children}
    </div>
  );
}

export type FieldsetProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'title'> & {
  /** Fieldset legend / group title. */
  legend?: ReactNode;
  /** Supporting text shown under the legend. */
  description?: ReactNode;
  /** Number of grid columns for the contained fields. */
  columns?: keyof typeof gridColumns;
};

export function Fieldset({
  children,
  className,
  columns = 1,
  description,
  legend,
  ...props
}: FieldsetProps) {
  return (
    <fieldset
      {...props}
      className={cn(
        'min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4',
        className,
      )}
    >
      {legend || description ? (
        <>
          {legend ? (
            <legend className="text-sm font-semibold text-[var(--color-fg-base)]">{legend}</legend>
          ) : null}
          {description ? (
            <p className="mt-1 text-xs leading-5 text-[var(--color-fg-muted)]">{description}</p>
          ) : null}
        </>
      ) : null}
      <FormGrid columns={columns} className={legend || description ? 'mt-4' : undefined}>
        {children}
      </FormGrid>
    </fieldset>
  );
}

export type FormActionsProps = ComponentPropsWithoutRef<'div'> & {
  align?: keyof typeof actionAlign;
  sticky?: boolean;
};

export function FormActions({
  align = 'end',
  children,
  className,
  sticky,
  ...props
}: FormActionsProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4',
        actionAlign[align],
        sticky
          ? 'bg-[var(--color-bg-base)]/95 sticky bottom-0 z-10 -mx-4 px-4 pb-4 backdrop-blur'
          : undefined,
        className,
      )}
    >
      {children}
    </div>
  );
}
