import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

export type PropertyListItem = {
  label: ReactNode;
  value: ReactNode;
};

export type PropertyListProps = Omit<ComponentPropsWithoutRef<'dl'>, 'children'> & {
  /** Data-driven rows; alternative to passing `PropertyItem` children. */
  items?: PropertyListItem[];
  /** `PropertyItem` children; alternative to `items`. */
  children?: ReactNode;
  /** `horizontal` puts label and value side by side; `vertical` stacks them. */
  orientation?: 'horizontal' | 'vertical';
  /** Add dividing lines between rows. */
  divided?: boolean;
  /** Width of the label column when horizontal. */
  labelWidth?: string;
};

/**
 * Dense label/value rows for detail panels and settings summaries.
 * Domain-neutral — labels and values are caller-supplied nodes.
 */
export function PropertyList({
  items,
  children,
  orientation = 'horizontal',
  divided = true,
  labelWidth = '10rem',
  className,
  ...props
}: PropertyListProps) {
  return (
    <dl
      {...props}
      className={cn(
        'text-sm',
        divided ? 'divide-y divide-[var(--color-border)]' : 'space-y-2',
        className,
      )}
    >
      {items?.map((item, index) => (
        <PropertyItem
          // eslint-disable-next-line react/no-array-index-key -- detail rows are positional and stable
          key={index}
          label={item.label}
          orientation={orientation}
          labelWidth={labelWidth}
          divided={divided}
        >
          {item.value}
        </PropertyItem>
      ))}
      {children}
    </dl>
  );
}

export type PropertyItemProps = {
  /** Row label. */
  label: ReactNode;
  /** Row value. */
  children: ReactNode;
  /** Layout of label vs value; inherited from the list by default. */
  orientation?: 'horizontal' | 'vertical';
  /** Width of the label column when horizontal. */
  labelWidth?: string;
  /** Draw a divider above the row. */
  divided?: boolean;
  className?: string;
};

export function PropertyItem({
  label,
  children,
  orientation = 'horizontal',
  labelWidth = '10rem',
  divided = true,
  className,
}: PropertyItemProps) {
  return (
    <div
      className={cn(
        divided ? 'py-2.5 first:pt-0 last:pb-0' : '',
        orientation === 'horizontal'
          ? 'flex flex-col gap-1 sm:flex-row sm:gap-4'
          : 'flex flex-col gap-0.5',
        className,
      )}
    >
      <dt
        className="shrink-0 font-medium text-[var(--color-fg-muted)]"
        style={orientation === 'horizontal' ? { width: labelWidth } : undefined}
      >
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-[var(--color-fg-base)]">{children}</dd>
    </div>
  );
}
