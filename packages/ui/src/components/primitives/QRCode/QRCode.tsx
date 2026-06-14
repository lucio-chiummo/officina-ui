import { cn } from '@lib/utils/cn';
import { QRCodeSVG } from 'qrcode.react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

export type QRCodeProps = ComponentPropsWithoutRef<'div'> & {
  /** Data encoded into the QR code. */
  value: string;
  /** Module size in pixels. */
  size?: number;
  /** Accessible label describing the code. */
  label?: string;
};

export const QRCode = forwardRef<HTMLDivElement, QRCodeProps>(function QRCode(
  { value, size = 160, label = 'QR code', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        'inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3',
        className,
      )}
    >
      <QRCodeSVG value={value} size={size} role="img" aria-label={label} />
    </div>
  );
});
