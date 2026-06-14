import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  children: ReactNode;
  container?: Element | DocumentFragment | null;
  disabled?: boolean;
};

export function Portal({ children, container, disabled }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (disabled || !mounted) return children;
  return createPortal(children, container ?? document.body);
}
