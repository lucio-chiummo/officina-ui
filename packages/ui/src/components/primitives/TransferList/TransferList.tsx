import { cn } from '@lib/utils/cn';
import { Button } from '@primitives/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface TransferListItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TransferListProps {
  /** All transferable items across both panes. */
  items: TransferListItem[];
  /** Ids of items currently in the selected pane (controlled). */
  value: string[];
  /** Called with the next array of selected ids when items move. */
  onChange: (value: string[]) => void;
  /** Heading for the available (left) pane. */
  availableLabel?: string;
  /** Heading for the selected (right) pane. */
  selectedLabel?: string;
  /** Extra classes for the component wrapper. */
  className?: string;
}

export function TransferList({
  items,
  value,
  onChange,
  availableLabel = 'Available',
  selectedLabel = 'Selected',
  className,
}: TransferListProps) {
  const [pickedAvailable, setPickedAvailable] = useState<string[]>([]);
  const [pickedSelected, setPickedSelected] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(value), [value]);
  const available = items.filter((item) => !selectedSet.has(item.value));
  const selected = items.filter((item) => selectedSet.has(item.value));

  return (
    <div className={cn('grid gap-3 md:grid-cols-[1fr_auto_1fr]', className)}>
      <TransferColumn
        label={availableLabel}
        items={available}
        picked={pickedAvailable}
        onPicked={setPickedAvailable}
      />
      <div className="flex items-center justify-center gap-2 md:flex-col">
        <Button
          size="icon-sm"
          variant="secondary"
          aria-label="Move selected right"
          onClick={() => {
            onChange([...value, ...pickedAvailable]);
            setPickedAvailable([]);
          }}
        >
          <ArrowRight className="size-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="secondary"
          aria-label="Move selected left"
          onClick={() => {
            onChange(value.filter((item) => !pickedSelected.includes(item)));
            setPickedSelected([]);
          }}
        >
          <ArrowLeft className="size-4" />
        </Button>
      </div>
      <TransferColumn
        label={selectedLabel}
        items={selected}
        picked={pickedSelected}
        onPicked={setPickedSelected}
      />
    </div>
  );
}

function TransferColumn({
  label,
  items,
  picked,
  onPicked,
}: {
  label: string;
  items: TransferListItem[];
  picked: string[];
  onPicked: (value: string[]) => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)]">
      <div className="border-b border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-fg-base)]">
        {label}
      </div>
      <div className="max-h-72 overflow-auto p-2" role="group" aria-label={label}>
        {items.map((item) => (
          <label
            key={item.value}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-[var(--color-fg-base)] hover:bg-[var(--color-bg-muted)]"
          >
            <input
              type="checkbox"
              disabled={item.disabled}
              checked={picked.includes(item.value)}
              onChange={(event) =>
                onPicked(
                  event.target.checked
                    ? [...picked, item.value]
                    : picked.filter((value) => value !== item.value),
                )
              }
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}
