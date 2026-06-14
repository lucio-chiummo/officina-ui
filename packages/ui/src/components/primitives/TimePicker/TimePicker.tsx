import { Clock } from 'lucide-react';

import { Button } from '../Button';
import { NumberInput } from '../NumberInput';
import { Popover } from '../Popover';

export type TimeValue = { hours: number; minutes: number; seconds?: number };

export type TimePickerProps = {
  /** Selected time ({ hours, minutes, seconds? }). */
  value: TimeValue;
  /** Called with the new time on change. */
  onChange: (value: TimeValue) => void;
  /** Show a seconds field. */
  showSeconds?: boolean;
  /** Use 12-hour format with an AM/PM toggle. */
  hour12?: boolean;
  /** Visible field label. */
  label?: string;
  /** Disable the control. */
  disabled?: boolean;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function TimePicker({
  value,
  onChange,
  showSeconds,
  hour12,
  label = 'Time',
  disabled,
}: TimePickerProps) {
  const display = `${pad(value.hours)}:${pad(value.minutes)}${showSeconds ? `:${pad(value.seconds ?? 0)}` : ''}`;
  return (
    <Popover
      trigger={
        <Button
          variant="secondary"
          className="min-w-40 justify-start font-normal"
          {...(disabled !== undefined ? { disabled } : {})}
        >
          <Clock className="size-4" />
          {display}
        </Button>
      }
      className="w-[min(360px,94vw)]"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-fg-base)]">{label}</p>
        <div className={showSeconds ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}>
          <NumberInput
            value={value.hours}
            onChange={(hours) => onChange({ ...value, hours: hours ?? 0 })}
            min={0}
            max={hour12 ? 12 : 23}
            ariaLabel="Hours"
            showSteppers={false}
            {...(disabled !== undefined ? { disabled } : {})}
          />
          <NumberInput
            value={value.minutes}
            onChange={(minutes) => onChange({ ...value, minutes: minutes ?? 0 })}
            min={0}
            max={59}
            ariaLabel="Minutes"
            showSteppers={false}
            {...(disabled !== undefined ? { disabled } : {})}
          />
          {showSeconds ? (
            <NumberInput
              value={value.seconds ?? 0}
              onChange={(seconds) => onChange({ ...value, seconds: seconds ?? 0 })}
              min={0}
              max={59}
              ariaLabel="Seconds"
              showSteppers={false}
              {...(disabled !== undefined ? { disabled } : {})}
            />
          ) : null}
        </div>
      </div>
    </Popover>
  );
}
