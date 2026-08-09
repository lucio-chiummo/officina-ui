import { useEffect, useState } from 'react';
import { getI18n } from 'react-i18next';

/**
 * Translates through react-i18next when the host app has initialised an
 * instance, and returns the supplied fallback when it has not.
 *
 * `useTranslation` logs a NO_I18NEXT_INSTANCE warning on every render in apps
 * that do not use i18next — which is most of them, since a component library
 * should not impose an i18n framework. Reading the instance directly keeps the
 * opt-in behaviour without the noise.
 */
export function useOptionalTranslation(): (key: string, fallback: string) => string {
  const i18n = getI18n() as ReturnType<typeof getI18n> | undefined;
  const [, forceUpdate] = useState(0);

  // Without useTranslation's subscription, a language switch would leave stale
  // labels on screen.
  useEffect(() => {
    if (!i18n) return;
    const rerender = () => forceUpdate((n) => n + 1);
    i18n.on('languageChanged', rerender);
    return () => i18n.off('languageChanged', rerender);
  }, [i18n]);

  return (key, fallback) => (i18n ? i18n.t(key, fallback) : fallback);
}
