import { cn } from '@lib/utils/cn';

import { Kbd } from './Kbd';

export type ShortcutProps = {
  /** Combo like `"mod+k"`, `"shift+enter"`, or an array of keys. */
  keys: string | string[];
  /** Render `+` separators between keys. */
  withPlus?: boolean;
  className?: string;
};

function isApple(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
}

const APPLE: Record<string, string> = {
  mod: '⌘',
  cmd: '⌘',
  meta: '⌘',
  ctrl: '⌃',
  control: '⌃',
  alt: '⌥',
  option: '⌥',
  shift: '⇧',
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  delete: '⌦',
  escape: 'esc',
  esc: 'esc',
  tab: '⇥',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

const OTHER: Record<string, string> = {
  mod: 'Ctrl',
  cmd: 'Win',
  meta: 'Win',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  option: 'Alt',
  shift: 'Shift',
  enter: 'Enter',
  return: 'Enter',
  backspace: 'Backspace',
  delete: 'Del',
  escape: 'Esc',
  esc: 'Esc',
  tab: 'Tab',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

function format(token: string, apple: boolean): string {
  const key = token.trim().toLowerCase();
  const map = apple ? APPLE : OTHER;
  if (map[key]) return map[key];
  return key.length === 1 ? key.toUpperCase() : token.trim();
}

/**
 * Platform-aware keyboard shortcut display built on {@link Kbd}. Renders
 * `"mod+k"` as ⌘K on Apple platforms and Ctrl+K elsewhere.
 */
export function Shortcut({ keys, withPlus = false, className }: ShortcutProps) {
  const apple = isApple();
  const tokens = Array.isArray(keys) ? keys : keys.split('+');
  const label = tokens.map((token) => format(token, apple)).join(apple ? '' : '+');

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={label}>
      {tokens.map((token, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key -- key combos are short and positional
          key={`${token}-${index}`}
          className="inline-flex items-center gap-0.5"
        >
          {withPlus && index > 0 ? (
            <span aria-hidden="true" className="text-[10px] text-[var(--color-fg-subtle)]">
              +
            </span>
          ) : null}
          <Kbd>{format(token, apple)}</Kbd>
        </span>
      ))}
    </span>
  );
}
