import { cn } from '@lib/utils/cn';
import { Filter, Plus, SlidersHorizontal } from 'lucide-react';
import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';

import { isGroup, type FilterCondition } from '@/lib/filters';

import { Badge } from '../Badge';
import { Button } from '../Button';
import { Popover } from '../Popover';
import { FilterBuilder } from './FilterBuilder';
import { FilterChips } from './FilterChips';
import { useFiltersContext } from './FiltersContext';

const LazyFilterGroupEditor = lazy(() =>
  import('./FilterGroupEditor').then((module) => ({ default: module.FilterGroupEditor })),
);

export type FilterBarProps = {
  /** Extra classes for the filter bar container. */
  className?: string;
  /** Saved-views control rendered in the bar. */
  savedViews?: ReactNode;
  /** Label for the add-filter control. */
  addLabel?: string;
  /** Label for the clear-filters control. */
  clearLabel?: string;
};

export function FilterBar({
  className,
  savedViews,
  addLabel = 'Add filter',
  clearLabel,
}: FilterBarProps) {
  const filters = useFiltersContext();
  const addButtonId = useId();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const hasGroups = useMemo(
    () => filters.state.root.conditions.some((node) => isGroup(node)),
    [filters.state.root.conditions],
  );
  const [advanced, setAdvanced] = useState(hasGroups);

  useEffect(() => {
    if (hasGroups) setAdvanced(true);
  }, [hasGroups]);

  const focusAddButton = () => {
    const focus = () => {
      const button = addButtonRef.current ?? document.getElementById(addButtonId);
      button?.focus();
    };
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      window.requestAnimationFrame(focus);
      return;
    }
    focus();
  };

  const chips = filters.chips.map((chip) => ({
    ...chip,
    onRemove: () => {
      chip.onRemove();
      focusAddButton();
    },
  }));

  const rootConditions = filters.state.root.conditions.filter(
    (node): node is FilterCondition => !isGroup(node),
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Popover
        trigger={
          <Button id={addButtonId} ref={addButtonRef} variant="secondary" size="sm">
            <Plus className="size-4" />
            {addLabel}
            {filters.activeCount > 0 ? <Badge tone="info">{filters.activeCount}</Badge> : null}
          </Button>
        }
        className="w-[min(48rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)]"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)]">
                <Filter className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-fg-base)]">Filters</p>
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  {filters.mode === 'server' ? 'Server query mode' : 'Client row mode'}
                </p>
              </div>
            </div>
            <Button
              variant={advanced ? 'soft' : 'ghost'}
              size="xs"
              onClick={() => setAdvanced((next) => !next)}
            >
              <SlidersHorizontal className="size-3.5" />
              Advanced
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5" aria-label="Add filter field">
            {filters.fields.length > 0 ? (
              filters.fields.map((field) => (
                <Button
                  key={field.id}
                  variant="ghost"
                  size="xs"
                  onClick={() => filters.addCondition(field.id)}
                >
                  {field.label}
                </Button>
              ))
            ) : (
              <p className="text-sm text-[var(--color-fg-subtle)]">No filter fields</p>
            )}
          </div>

          {advanced ? (
            <Suspense
              fallback={
                <div
                  aria-busy="true"
                  className="h-28 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
                />
              }
            >
              <LazyFilterGroupEditor />
            </Suspense>
          ) : rootConditions.length > 0 ? (
            <div className="space-y-2">
              {rootConditions.map((condition) => (
                <FilterBuilder
                  key={condition.id}
                  condition={condition}
                  fields={filters.fields}
                  onChange={filters.updateCondition}
                  onRemove={filters.removeCondition}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-[var(--color-border)] px-3 py-4 text-sm text-[var(--color-fg-subtle)]">
              Choose a field to start
            </p>
          )}
        </div>
      </Popover>

      <FilterChips
        chips={chips}
        {...(filters.activeCount > 0 ? { onClearAll: filters.clear } : {})}
        {...(clearLabel ? { clearAllLabel: clearLabel } : {})}
      />

      {savedViews}
    </div>
  );
}
