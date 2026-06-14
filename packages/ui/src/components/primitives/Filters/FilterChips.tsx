import type { FilterChip } from './useFilters';

import { Button } from '../Button';
import { Chip } from '../Chip';

export type FilterChipsProps = {
  /** Active filter chips to display, each removable. */
  chips: FilterChip[];
  /** Called when the user clears all chips at once. */
  onClearAll?: () => void;
  /** Label for the clear-all control. */
  clearAllLabel?: string;
};

export function FilterChips({ chips, onClearAll, clearAllLabel = 'Clear all' }: FilterChipsProps) {
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip key={chip.id} onRemove={chip.onRemove} removeLabel={`Remove filter: ${chip.label}`}>
          {chip.label}
        </Chip>
      ))}
      {onClearAll ? (
        <Button variant="ghost" size="xs" onClick={onClearAll}>
          {clearAllLabel}
        </Button>
      ) : null}
    </div>
  );
}
