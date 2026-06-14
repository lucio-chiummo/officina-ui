import { cn } from '@lib/utils/cn';
import { Button, type ButtonProps } from '@primitives/Button';
import { forwardRef } from 'react';

export type FloatingActionButtonProps = ButtonProps & {
  /** Fixed corner the button is anchored to. */
  placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
};

const placementMap = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'right-6 top-6',
  'top-left': 'left-6 top-6',
};

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  function FloatingActionButton(
    { placement = 'bottom-right', className, size = 'icon', ...props },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        size={size}
        {...props}
        className={cn(
          'fixed z-40 rounded-full shadow-[var(--shadow-lg)]',
          placementMap[placement],
          className,
        )}
      />
    );
  },
);
