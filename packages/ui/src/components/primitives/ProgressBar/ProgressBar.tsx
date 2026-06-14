import { cn } from '@lib/utils/cn';
/**
 * ProgressBar (top-of-page) — driven by router state via TanStack Router events.
 * Why: PLAN-MINIMAL §1.6.
 */
import { useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function TopProgressBar() {
  const status = useRouterState({ select: (s) => s.status });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'pending') {
      setVisible(true);
      setProgress(20);
      const ramp = setInterval(() => {
        setProgress((p) => (p < 80 ? p + 5 : p));
      }, 120);
      return () => clearInterval(ramp);
    }
    if (status === 'idle' && visible) {
      setProgress(100);
      const t = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [status, visible]);

  if (!visible) return null;
  const complete = progress === 100;
  return (
    <div
      role={complete ? undefined : 'progressbar'}
      aria-hidden={complete ? true : undefined}
      aria-label={complete ? undefined : 'Page loading'}
      aria-valuenow={complete ? undefined : progress}
      aria-valuemin={complete ? undefined : 0}
      aria-valuemax={complete ? undefined : 100}
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-0.5 bg-[var(--color-accent)] transition-all duration-200',
      )}
      style={{ width: `${String(progress)}%`, opacity: complete ? 0 : 1 }}
    />
  );
}
