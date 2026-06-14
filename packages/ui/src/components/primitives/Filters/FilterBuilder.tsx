import type { DateRange } from 'react-day-picker';

import { X } from 'lucide-react';
import { useMemo } from 'react';

import {
  DEFAULT_OPERATOR,
  isMultiValueOp,
  isNullaryOp,
  isRangeOp,
  operatorsFor,
  type FilterCondition,
  type FilterFieldDef,
  type FilterFieldOption,
  type FilterOperator,
} from '@/lib/filters';

import { Button } from '../Button';
import { Combobox, type ComboboxOption } from '../Combobox';
import { Input } from '../Form';
import { NumberInput } from '../NumberInput';
import { Select } from '../Select';
import { TagInput } from '../TagInput';
import { DateRangeFilter } from './DateRangeFilter';
import { FacetedFilter } from './FacetedFilter';

export type FilterBuilderProps<TRow = unknown> = {
  /** The single filter condition being edited. */
  condition: FilterCondition;
  /** Available fields the condition can target, with their operators/types. */
  fields: FilterFieldDef<TRow>[];
  /** Called with the condition id and a partial patch when any part changes. */
  onChange: (id: string, patch: Partial<Omit<FilterCondition, 'id'>>) => void;
  /** Called with the condition id when the user removes it. */
  onRemove: (id: string) => void;
};

const OPERATOR_LABEL: Record<FilterOperator, string> = {
  eq: 'is',
  neq: 'is not',
  contains: 'contains',
  notContains: 'does not contain',
  startsWith: 'starts with',
  endsWith: 'ends with',
  in: 'is any of',
  notIn: 'is none of',
  gt: 'greater than',
  gte: 'greater or equal',
  lt: 'less than',
  lte: 'less or equal',
  between: 'between',
  before: 'before',
  after: 'after',
  relative: 'within',
  is: 'is',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
};

const RELATIVE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' },
];

const toInputDate = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value.slice(0, 10);
  if (typeof value === 'number') return new Date(value).toISOString().slice(0, 10);
  return '';
};

const dateFromInput = (value: unknown): Date | undefined => {
  const input = toInputDate(value);
  if (!input) return undefined;
  const date = new Date(`${input}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown): string[] =>
  asArray(value).filter((item): item is string => typeof item === 'string');

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value !== '') {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
  return null;
};

const valuesEqual = (a: string | number, b: unknown): boolean => Object.is(a, b);

export const defaultValueForOperator = <TRow,>(
  op: FilterOperator,
  field?: FilterFieldDef<TRow>,
): unknown => {
  if (isNullaryOp(op)) return undefined;
  if (isRangeOp(op)) return [];
  if (isMultiValueOp(op)) return [];
  if (field?.type === 'boolean') return '';
  if (field?.type === 'date' && op === 'relative') return '7d';
  return '';
};

const optionsForField = <TRow,>(field: FilterFieldDef<TRow>): FilterFieldOption[] =>
  field.options ?? [];

function EnumValueEditor<TRow>({
  condition,
  field,
  onChange,
}: {
  condition: FilterCondition;
  field: FilterFieldDef<TRow>;
  onChange: (patch: Partial<Omit<FilterCondition, 'id'>>) => void;
}) {
  const options = optionsForField(field);
  if (isMultiValueOp(condition.op)) {
    return (
      <FacetedFilter
        label={field.label}
        options={options}
        value={asArray(condition.value) as Array<string | number>}
        onChange={(value) => onChange({ value })}
        inline
        showSearch={options.length > 8}
      />
    );
  }

  const comboOptions = options.map<ComboboxOption<string | number>>((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <Combobox
      options={comboOptions}
      value={
        comboOptions.find((option) => valuesEqual(option.value, condition.value))?.value ?? null
      }
      onChange={(value) => onChange({ value: value ?? '' })}
      placeholder="Value"
      size="sm"
    />
  );
}

function DateValueEditor<TRow>({
  condition,
  field,
  onChange,
}: {
  condition: FilterCondition;
  field: FilterFieldDef<TRow>;
  onChange: (patch: Partial<Omit<FilterCondition, 'id'>>) => void;
}) {
  if (condition.op === 'relative') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {RELATIVE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={condition.value === option.value ? 'soft' : 'ghost'}
            size="xs"
            onClick={() => onChange({ value: option.value })}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  }

  if (condition.op === 'between') {
    const [from, to] = asArray(condition.value);
    const range: DateRange = {
      from: dateFromInput(from),
      to: dateFromInput(to),
    };
    return (
      <DateRangeFilter
        label={field.label}
        value={range}
        onChange={(next) =>
          onChange({
            value: [toInputDate(next.from), toInputDate(next.to)],
          })
        }
        inline
      />
    );
  }

  return (
    <Input
      type="date"
      value={toInputDate(condition.value)}
      onChange={(event) => onChange({ value: event.target.value })}
      aria-label={`${field.label} value`}
      className="h-8 text-xs"
    />
  );
}

function NumberValueEditor<TRow>({
  condition,
  field,
  onChange,
}: {
  condition: FilterCondition;
  field: FilterFieldDef<TRow>;
  onChange: (patch: Partial<Omit<FilterCondition, 'id'>>) => void;
}) {
  if (condition.op === 'between') {
    const [from, to] = asArray(condition.value);
    return (
      <div className="grid grid-cols-2 gap-2">
        <NumberInput
          value={asNumber(from)}
          onChange={(value) => onChange({ value: [value, to ?? ''] })}
          size="sm"
          showSteppers={false}
          ariaLabel={`${field.label} from`}
        />
        <NumberInput
          value={asNumber(to)}
          onChange={(value) => onChange({ value: [from ?? '', value] })}
          size="sm"
          showSteppers={false}
          ariaLabel={`${field.label} to`}
        />
      </div>
    );
  }

  return (
    <NumberInput
      value={asNumber(condition.value)}
      onChange={(value) => onChange({ value: value ?? '' })}
      size="sm"
      showSteppers={false}
      ariaLabel={`${field.label} value`}
    />
  );
}

function ValueEditor<TRow>({
  condition,
  field,
  onChange,
}: {
  condition: FilterCondition;
  field: FilterFieldDef<TRow>;
  onChange: (patch: Partial<Omit<FilterCondition, 'id'>>) => void;
}) {
  if (isNullaryOp(condition.op)) {
    return (
      <div className="flex h-8 items-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 text-xs text-[var(--color-fg-subtle)]">
        No value
      </div>
    );
  }

  if (field.type === 'enum') {
    return <EnumValueEditor condition={condition} field={field} onChange={onChange} />;
  }

  if (field.type === 'boolean') {
    return (
      <Select
        value={
          typeof condition.value === 'boolean'
            ? String(condition.value)
            : typeof condition.value === 'string'
              ? condition.value
              : ''
        }
        onChange={(event) => {
          const { value } = event.target;
          onChange({ value: value === '' ? '' : value === 'true' });
        }}
        aria-label={`${field.label} value`}
        className="h-8 text-xs"
      >
        <option value="">Any</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </Select>
    );
  }

  if (field.type === 'number') {
    return <NumberValueEditor condition={condition} field={field} onChange={onChange} />;
  }

  if (field.type === 'date') {
    return <DateValueEditor condition={condition} field={field} onChange={onChange} />;
  }

  if (isMultiValueOp(condition.op)) {
    return (
      <TagInput
        value={asStringArray(condition.value)}
        onChange={(value) => onChange({ value })}
        placeholder="Add values"
      />
    );
  }

  return (
    <Input
      value={typeof condition.value === 'string' ? condition.value : ''}
      onChange={(event) => onChange({ value: event.target.value })}
      placeholder="Value"
      aria-label={`${field.label} value`}
      className="h-8 text-xs"
    />
  );
}

export function FilterBuilder<TRow = unknown>({
  condition,
  fields,
  onChange,
  onRemove,
}: FilterBuilderProps<TRow>) {
  const field = fields.find((item) => item.id === condition.field) ?? fields[0];
  const fieldOptions = useMemo<ComboboxOption<string>[]>(
    () => fields.map((item) => ({ value: item.id, label: item.label })),
    [fields],
  );
  const operatorOptions = useMemo<ComboboxOption<FilterOperator>[]>(() => {
    if (!field) return [];
    return operatorsFor(field.type, field.operators).map((op) => ({
      value: op,
      label: OPERATOR_LABEL[op],
    }));
  }, [field]);

  if (!field) return null;

  return (
    <div className="grid min-w-0 gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-2 md:grid-cols-[minmax(9rem,1fr)_minmax(10rem,1fr)_minmax(12rem,1.4fr)_auto]">
      <Combobox
        className="min-w-0"
        options={fieldOptions}
        value={condition.field}
        onChange={(fieldId) => {
          const nextField = fields.find((item) => item.id === fieldId);
          if (!nextField) return;
          const op = nextField.operators?.[0] ?? DEFAULT_OPERATOR[nextField.type];
          onChange(condition.id, {
            field: nextField.id,
            op,
            value: defaultValueForOperator(op, nextField),
          });
        }}
        placeholder="Field"
        size="sm"
        clearable={false}
      />
      <Combobox
        className="min-w-0"
        options={operatorOptions}
        value={
          operatorOptions.some((option) => option.value === condition.op)
            ? condition.op
            : (field.operators?.[0] ?? DEFAULT_OPERATOR[field.type])
        }
        onChange={(op) => {
          if (!op) return;
          onChange(condition.id, { op, value: defaultValueForOperator(op, field) });
        }}
        placeholder="Operator"
        size="sm"
        clearable={false}
      />
      <div className="min-w-0">
        <ValueEditor
          condition={condition}
          field={field}
          onChange={(patch) => onChange(condition.id, patch)}
        />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Remove filter: ${field.label}`}
        onClick={() => onRemove(condition.id)}
        className="self-start"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
