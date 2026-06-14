import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button, type ButtonProps } from '../Button';
import { toast } from '../Toast';

export type CopyButtonProps = Omit<ButtonProps, 'onClick'> & {
  /** String written to the clipboard on click. */
  value: string;
  /** Label shown briefly after a successful copy. */
  copiedLabel?: string;
  /** Default button label. */
  copyLabel?: string;
};

export function CopyButton({
  value,
  copiedLabel = 'Copied',
  copyLabel = 'Copy',
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="sm"
      {...props}
      onClick={() => {
        void navigator.clipboard.writeText(value).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          },
          () => toast.error(copyLabel),
        );
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {children ?? (copied ? copiedLabel : copyLabel)}
    </Button>
  );
}
