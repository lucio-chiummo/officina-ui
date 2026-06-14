import { cn } from '@lib/utils/cn';
import { type ComponentPropsWithoutRef } from 'react';

export type BackdropProps = ComponentPropsWithoutRef<'div'> & {
  /** Apply a backdrop blur to content behind the overlay. */
  blur?: boolean;
  /** Whether the backdrop is shown. */
  open?: boolean;
};

export function Backdrop({ blur, className, open = true, ...props }: BackdropProps) {
  if (!open) return null;
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn('fixed inset-0 z-40 bg-black/45', blur && 'backdrop-blur-sm', className)}
    />
  );
}
