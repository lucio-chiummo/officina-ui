import { NumberInput } from '../NumberInput';
import { Slider } from '../Slider';
import { FilterPopover } from './FilterPopover';

export type RangeFilterProps = {
  /** Filter label shown on the trigger. */
  label: string;
  /** Selected [min, max] range. */
  value: [number, number];
  /** Called with the new [min, max] tuple. */
  onChange: (value: [number, number]) => void;
  /** Lower bound of the slider. */
  min: number;
  /** Upper bound of the slider. */
  max: number;
  /** Step increment. */
  step?: number;
  /** Render inline instead of inside a popover. */
  inline?: boolean;
};

export function RangeFilter({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  inline = false,
}: RangeFilterProps) {
  const content = (
    <div className="space-y-3">
      <Slider
        value={value}
        onValueChange={(next) => onChange([next[0] ?? min, next[1] ?? max])}
        min={min}
        max={max}
        step={step}
      />
      <div className="grid grid-cols-2 gap-2">
        <NumberInput
          value={value[0]}
          onChange={(next) => onChange([next ?? min, value[1]])}
          min={min}
          max={max}
          step={step}
        />
        <NumberInput
          value={value[1]}
          onChange={(next) => onChange([value[0], next ?? max])}
          min={min}
          max={max}
          step={step}
        />
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <FilterPopover
      label={label}
      activeCount={value[0] !== min || value[1] !== max ? 1 : 0}
      onClear={() => onChange([min, max])}
    >
      {content}
    </FilterPopover>
  );
}
