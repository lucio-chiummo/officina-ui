import { useEffect, useRef, useState } from 'react';

interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
}

const defaultRect: Rect = { width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0 };

export function useMeasure<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<Rect>(defaultRect);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const r = entry.target.getBoundingClientRect();
      setRect({
        width: r.width,
        height: r.height,
        top: r.top,
        left: r.left,
        bottom: r.bottom,
        right: r.right,
        x: r.x,
        y: r.y,
      });
    });
    observer.observe(el);
    setRect(el.getBoundingClientRect());
    return () => observer.disconnect();
  }, []);

  return [ref, rect] as const;
}
