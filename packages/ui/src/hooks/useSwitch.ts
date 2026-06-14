import { useCallback, useState } from 'react';

interface UseSwitchOptions {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function useSwitch(options: UseSwitchOptions = {}) {
  const {
    defaultChecked = false,
    checked: controlledChecked,
    onChange,
    disabled = false,
  } = options;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }, [checked, disabled, isControlled, onChange]);

  const set = useCallback(
    (value: boolean) => {
      if (disabled) return;
      if (!isControlled) setInternalChecked(value);
      onChange?.(value);
    },
    [disabled, isControlled, onChange],
  );

  return { checked, disabled, toggle, set };
}
