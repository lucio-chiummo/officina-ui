import { useSyncExternalStore } from 'react';

/**
 * Standalone replacement for the template's Zustand theme store.
 *
 * The published library must not depend on the commercial app's stores, so the
 * template's Zustand theme-store import is aliased to this shim at build time.
 * Components only read `mode`, which we derive from the `data-theme` attribute
 * (set by the consumer's theme provider) with a `prefers-color-scheme` fallback.
 */
export type ThemeMode = 'light' | 'dark';

type ThemeState = { mode: ThemeMode };

function getMode(): ThemeMode {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);
  return () => {
    observer.disconnect();
    mq.removeEventListener('change', onChange);
  };
}

/** Mirrors the Zustand selector signature used across primitives. */
export function useThemeStore<T>(selector: (state: ThemeState) => T): T {
  const mode = useSyncExternalStore(subscribe, getMode, () => 'light' as const);
  return selector({ mode });
}
