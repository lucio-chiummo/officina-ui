import { cn } from '@lib/utils/cn';
import { forwardRef, type ReactNode } from 'react';

import { Tooltip } from '../Tooltip';
import { Button, type ButtonProps } from './Button';

export type IconButtonProps = Omit<ButtonProps, 'children' | 'size'> & {
  icon: ReactNode;
  /** Visual + control size. Maps to the Button `icon` / `icon-sm` sizes. */
  size?: 'sm' | 'md';
  /** Optional tooltip; falls back to `aria-label` when omitted. */
  tooltip?: ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Accessible label is mandatory for icon-only buttons. */
  'aria-label': string;
};

/**
 * Icon-only button with an enforced accessible label. Optionally wraps itself
 * in a {@link Tooltip} so hover/focus surfaces the same intent visually.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, size = 'md', tooltip, tooltipSide = 'top', className, ...props },
  ref,
) {
  const button = (
    <Button
      ref={ref}
      size={size === 'sm' ? 'icon-sm' : 'icon'}
      className={cn('shrink-0', className)}
      {...props}
    >
      <span aria-hidden="true" className={size === 'sm' ? '[&>svg]:size-3.5' : '[&>svg]:size-4'}>
        {icon}
      </span>
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} side={tooltipSide}>
        {button}
      </Tooltip>
    );
  }
  return button;
});
