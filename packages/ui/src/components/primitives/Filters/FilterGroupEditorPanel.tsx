import { nanoid } from 'nanoid';

import {
  DEFAULT_OPERATOR,
  isGroup,
  type FilterCondition,
  type FilterCombinator,
  type FilterFieldDef,
  type FilterGroup,
} from '@/lib/filters';

import { Button } from '../Button';
import { Select } from '../Select';
import { defaultValueForOperator, FilterBuilder } from './FilterBuilder';
import { useFiltersContext } from './FiltersContext';

export type FilterGroupEditorProps<TRow = unknown> = {
  fields?: FilterFieldDef<TRow>[];
  maxDepth?: number;
};

const makeCondition = <TRow,>(fields: FilterFieldDef<TRow>[]): FilterCondition | null => {
  const field = fields[0];
  if (!field) return null;
  const op = field.operators?.[0] ?? DEFAULT_OPERATOR[field.type];
  return {
    id: nanoid(),
    field: field.id,
    op,
    value: defaultValueForOperator(op, field),
  };
};

const updateGroupById = (
  group: FilterGroup,
  id: string,
  update: (group: FilterGroup) => FilterGroup,
): FilterGroup => {
  if (group.id === id) return update(group);
  return {
    ...group,
    conditions: group.conditions.map((node) =>
      isGroup(node) ? updateGroupById(node, id, update) : node,
    ),
  };
};

function GroupNode<TRow>({
  group,
  fields,
  depth,
  maxDepth,
  root,
}: {
  group: FilterGroup;
  fields: FilterFieldDef<TRow>[];
  depth: number;
  maxDepth: number;
  root: boolean;
}) {
  const filters = useFiltersContext<TRow>();
  const canNest = depth + 1 < maxDepth;

  const updateGroup = (update: (group: FilterGroup) => FilterGroup) => {
    filters.setState((state) => ({
      root: updateGroupById(state.root, group.id, update),
    }));
  };

  const addCondition = () => {
    const condition = makeCondition(fields);
    if (!condition) return;
    updateGroup((current) => ({
      ...current,
      conditions: [...current.conditions, condition],
    }));
  };

  const addGroup = () => {
    const condition = makeCondition(fields);
    const nested: FilterGroup = {
      id: nanoid(),
      combinator: group.combinator === 'AND' ? 'OR' : 'AND',
      conditions: condition ? [condition] : [],
    };
    updateGroup((current) => ({
      ...current,
      conditions: [...current.conditions, nested],
    }));
  };

  return (
    <div
      className={
        root
          ? 'space-y-3'
          : 'space-y-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3'
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={group.combinator}
          onChange={(event) =>
            updateGroup((current) => ({
              ...current,
              combinator: event.target.value as FilterCombinator,
            }))
          }
          aria-label={root ? 'Root filter combinator' : 'Group filter combinator'}
          className="h-8 w-24 text-xs"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </Select>
        <Button variant="secondary" size="xs" onClick={addCondition} disabled={fields.length === 0}>
          Add rule
        </Button>
        {canNest ? (
          <Button variant="ghost" size="xs" onClick={addGroup} disabled={fields.length === 0}>
            Add group
          </Button>
        ) : null}
        {!root ? (
          <Button variant="ghost" size="xs" onClick={() => filters.removeCondition(group.id)}>
            Remove group
          </Button>
        ) : null}
      </div>

      {group.conditions.length === 0 ? (
        <p className="rounded-md border border-dashed border-[var(--color-border)] px-3 py-4 text-sm text-[var(--color-fg-subtle)]">
          No rules in this group
        </p>
      ) : (
        <div className="space-y-2">
          {group.conditions.map((node) =>
            isGroup(node) ? (
              <GroupNode
                key={node.id}
                group={node}
                fields={fields}
                depth={depth + 1}
                maxDepth={maxDepth}
                root={false}
              />
            ) : (
              <FilterBuilder
                key={node.id}
                condition={node}
                fields={fields}
                onChange={filters.updateCondition}
                onRemove={filters.removeCondition}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function FilterGroupEditorPanel<TRow = unknown>({
  fields,
  maxDepth = 2,
}: FilterGroupEditorProps<TRow>) {
  const filters = useFiltersContext<TRow>();
  const actualFields = fields ?? filters.fields;

  return (
    <GroupNode
      group={filters.state.root}
      fields={actualFields}
      depth={0}
      maxDepth={maxDepth}
      root
    />
  );
}
