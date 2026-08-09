import { useEffect, useState } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollPosition(): ScrollPosition {
  // Starts at the origin so server and client agree on the first paint; the
  // effect below corrects it before the user can see a stale value, which
  // matters when the page is restored mid-scroll and no scroll event follows.
  const [pos, setPos] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handler = () => setPos({ x: window.scrollX, y: window.scrollY });
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return pos;
}
