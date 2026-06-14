import { type RefObject, useEffect, useMemo, useRef } from 'react';

type Target = Window | Document | HTMLElement | null;

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  target?: RefObject<HTMLElement> | null,
  options?: AddEventListenerOptions,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const listenerOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const el: Target = target && 'current' in target ? target.current : window;
    if (!el) return;
    const listener = (e: Event) => handlerRef.current(e as WindowEventMap[K]);
    el.addEventListener(event, listener, listenerOptions);
    return () => el.removeEventListener(event, listener, listenerOptions);
  }, [event, target, listenerOptions]);
}
