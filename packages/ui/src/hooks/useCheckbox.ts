import { type ChangeEvent, useCallback, useState } from 'react';

interface UseCheckboxOptions {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

export function useCheckbox(options: UseCheckboxOptions = {}) {
  const {
    defaultChecked = false,
    checked: controlledChecked,
    onChange,
    indeterminate = false,
  } = options;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | boolean) => {
      const next = typeof e === 'boolean' ? e : e.target.checked;
      if (!isControlled) setInternalChecked(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return { checked, indeterminate, onChange: handleChange };
}
