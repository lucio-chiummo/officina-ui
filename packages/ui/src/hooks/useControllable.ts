import { useCallback, useRef, useState } from 'react';

/**
 * Manages controlled/uncontrolled state. If `value` prop is provided, component
 * is controlled and reads from parent. Otherwise uses internal state.
 */
export function useControllable<T>(
  controlledValue: T | undefined,
  onChange: ((value: T) => void) | undefined,
  defaultValue: T,
): [T, (value: T) => void] {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const value = isControlled ? controlledValue : internalValue;

  // Keep ref to avoid stale closure in set
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternalValue(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [value, setValue];
}
