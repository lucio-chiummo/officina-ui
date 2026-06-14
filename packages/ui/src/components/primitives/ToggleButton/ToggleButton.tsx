import { cn } from '@lib/utils/cn';

import { Button, type ButtonProps } from '../Button';

export type ToggleButtonProps = Omit<ButtonProps, 'onClick'> & {
  /** Whether the toggle is currently pressed/active. */
  pressed: boolean;
  /** Called with the next pressed state when toggled. */
  onPressedChange: (pressed: boolean) => void;
};

export function ToggleButton({
  pressed,
  onPressedChange,
  className,
  variant = 'ghost',
  ...props
}: ToggleButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        pressed &&
          'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)]',
        className,
      )}
    />
  );
}
