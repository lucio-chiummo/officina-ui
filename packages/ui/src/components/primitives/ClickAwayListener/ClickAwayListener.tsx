import { useEffect, useRef, type ReactNode } from 'react';

export type ClickAwayListenerProps = {
  children: ReactNode;
  className?: string;
  onClickAway: (event: MouseEvent | TouchEvent) => void;
};

export function ClickAwayListener({ children, className, onClickAway }: ClickAwayListenerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClickAway(event);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
    };
  }, [onClickAway]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
