import type { ReactNode } from 'react';

import { Filter } from 'lucide-react';

import { Badge } from '../Badge';
import { Button } from '../Button';
import { Popover } from '../Popover';

export type FilterPopoverProps = {
  /** Trigger button label. */
  label: string;
  /** Number of active filters; shown as a badge on the trigger. */
  activeCount?: number;
  /** Called when the apply button is pressed. */
  onApply?: () => void;
  /** Called when the clear button is pressed. */
  onClear?: () => void;
  /** Filter controls rendered inside the popover. */
  children: ReactNode;
  /** Leading icon on the trigger. */
  icon?: ReactNode;
  /** Label for the apply button. */
  applyLabel?: string;
  /** Label for the clear button. */
  clearLabel?: string;
};

export function FilterPopover({
  label,
  activeCount = 0,
  onApply,
  onClear,
  children,
  icon,
  applyLabel = 'Apply',
  clearLabel = 'Clear',
}: FilterPopoverProps) {
  return (
    <Popover
      trigger={
        <Button variant="secondary" size="sm" className="max-w-60 justify-start">
          {icon ?? <Filter className="size-4" />}
          <span className="truncate">{label}</span>
          {activeCount > 0 ? <Badge tone="info">{activeCount}</Badge> : null}
        </Button>
      }
      className="w-[min(28rem,94vw)]"
    >
      {({ close }) => (
        <div className="space-y-3">
          {children}
          {onApply || onClear ? (
            <div className="flex justify-end gap-2 border-t border-[var(--color-border-subtle)] pt-3">
              {onClear ? (
                <Button variant="ghost" size="sm" onClick={onClear}>
                  {clearLabel}
                </Button>
              ) : null}
              {onApply ? (
                <Button
                  size="sm"
                  onClick={() => {
                    onApply();
                    close();
                  }}
                >
                  {applyLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </Popover>
  );
}
