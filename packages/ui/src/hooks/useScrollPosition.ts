import { useEffect, useState } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollPosition(): ScrollPosition {
  const [pos, setPos] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handler = () => setPos({ x: window.scrollX, y: window.scrollY });
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return pos;
}
