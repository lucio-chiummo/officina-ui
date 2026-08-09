import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

export const Table = forwardRef<HTMLTableElement, ComponentPropsWithoutRef<'table'>>(function Table(
  { className, ...props },
  ref,
) {
  return (
    <table
      ref={ref}
      {...props}
      className={cn(
        'w-full caption-bottom border-collapse text-sm text-[var(--color-fg-base)]',
        className,
      )}
    />
  );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'thead'>>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <thead
        ref={ref}
        {...props}
        className={cn('border-b border-[var(--color-border)]', className)}
      />
    );
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'tbody'>>(
  function TableBody({ className, ...props }, ref) {
    return (
      <tbody
        ref={ref}
        {...props}
        className={cn('divide-y divide-[var(--color-border)]', className)}
      />
    );
  },
);

export const TableFooter = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'tfoot'>>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <tfoot
        ref={ref}
        {...props}
        className={cn(
          'border-t border-[var(--color-border)] bg-[var(--color-bg-muted)] font-medium',
          className,
        )}
      />
    );
  },
);

export const TableRow = forwardRef<HTMLTableRowElement, ComponentPropsWithoutRef<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        ref={ref}
        {...props}
        className={cn('transition-colors hover:bg-[var(--color-bg-muted)]', className)}
      />
    );
  },
);

export const TableHead = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<'th'>>(
  function TableHead({ className, ...props }, ref) {
    return (
      <th
        ref={ref}
        {...props}
        className={cn(
          'h-10 px-3 text-left align-middle text-xs font-semibold uppercase tracking-normal text-[var(--color-fg-muted)]',
          className,
        )}
      />
    );
  },
);

export const TableCell = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<'td'>>(
  function TableCell({ className, ...props }, ref) {
    return <td ref={ref} {...props} className={cn('px-3 py-3 align-middle', className)} />;
  },
);

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  ComponentPropsWithoutRef<'caption'>
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      {...props}
      className={cn('mt-3 text-xs text-[var(--color-fg-subtle)]', className)}
    />
  );
});
