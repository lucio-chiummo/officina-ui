import { useCallback, useState } from 'react';

interface UseRadioGroupOptions<T extends string> {
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
}

export function useRadioGroup<T extends string = string>(options: UseRadioGroupOptions<T> = {}) {
  const { defaultValue, value: controlledValue, onChange } = options;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const select = useCallback(
    (next: T) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const getItemProps = useCallback(
    (itemValue: T) => ({
      checked: value === itemValue,
      onChange: () => select(itemValue),
    }),
    [value, select],
  );

  return { value, select, getItemProps };
}
