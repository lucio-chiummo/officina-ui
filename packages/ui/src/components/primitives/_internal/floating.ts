import type { Ref } from 'react';

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating as useFloatingBase,
  type Placement,
  type UseFloatingReturn,
} from '@floating-ui/react';

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlign = 'start' | 'center' | 'end';

export function toPlacement(side: FloatingSide = 'bottom', align: FloatingAlign = 'center') {
  return `${side}${align === 'center' ? '' : `-${align}`}` as Placement;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
}

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

export function useOfficinaFloating({
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
}: {
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
}): UseFloatingReturn {
  return useFloatingBase({
    whileElementsMounted: autoUpdate,
    placement: toPlacement(side, align),
    middleware: [offset(sideOffset), flip(), shift({ padding: 8 })],
  });
}
