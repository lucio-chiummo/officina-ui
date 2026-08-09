import { type RefObject, useEffect, useRef } from 'react';

type Target = Window | Document | HTMLElement | null;

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  target?: RefObject<HTMLElement> | null,
  options?: AddEventListenerOptions,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  // `options` is nearly always an inline object literal, so memoising it against
  // itself stabilised nothing: the subscription was torn down and rebuilt on
  // every render. Only the three flags change behaviour, so depend on those.
  const { capture, once, passive } = options ?? {};
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el: Target = target && 'current' in target ? target.current : window;
    if (!el) return;
    const listenerOptions = optionsRef.current;
    const listener = (e: Event) => handlerRef.current(e as WindowEventMap[K]);
    el.addEventListener(event, listener, listenerOptions);
    return () => el.removeEventListener(event, listener, listenerOptions);
  }, [event, target, capture, once, passive]);
}
