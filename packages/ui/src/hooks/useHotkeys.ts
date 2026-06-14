import { useEffect } from 'react';

type Modifier = 'ctrl' | 'meta' | 'alt' | 'shift';

interface HotkeyOptions {
  /** Fire on keydown (default) or keyup */
  event?: 'keydown' | 'keyup';
  /** Element to attach listener to. Defaults to window. */
  target?: HTMLElement | null;
  /** Skip when focus is inside an input/textarea/select */
  ignoreInputs?: boolean;
}

function parseKey(combo: string): { modifiers: Modifier[]; key: string } {
  const parts = combo.toLowerCase().split('+');
  const key = parts.pop()!;
  return { modifiers: parts as Modifier[], key };
}

function matchesCombo(e: KeyboardEvent, modifiers: Modifier[], key: string): boolean {
  const pressed = {
    ctrl: e.ctrlKey,
    meta: e.metaKey,
    alt: e.altKey,
    shift: e.shiftKey,
  };
  return (
    e.key.toLowerCase() === key &&
    modifiers.every((m) => pressed[m]) &&
    (['ctrl', 'meta', 'alt', 'shift'] as Modifier[])
      .filter((m) => !modifiers.includes(m))
      .every((m) => !pressed[m])
  );
}

export function useHotkeys(
  combos: string | string[],
  handler: (e: KeyboardEvent) => void,
  options: HotkeyOptions = {},
) {
  const { event = 'keydown', target = null, ignoreInputs = true } = options;

  useEffect(() => {
    const keys = (Array.isArray(combos) ? combos : [combos]).map(parseKey);
    const el: EventTarget = target ?? window;

    const listener = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ignoreInputs) {
        const tag = (ke.target as HTMLElement)?.tagName;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      }
      if (keys.some(({ modifiers, key }) => matchesCombo(ke, modifiers, key))) {
        handler(ke);
      }
    };

    el.addEventListener(event, listener);
    return () => el.removeEventListener(event, listener);
  }, [combos, handler, event, target, ignoreInputs]);
}
