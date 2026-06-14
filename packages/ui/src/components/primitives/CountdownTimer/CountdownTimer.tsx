import { useEffect, useState } from 'react';

export type CountdownTimerProps = {
  target: Date;
  doneLabel?: string;
};

export function CountdownTimer({ target, doneLabel = 'Done' }: CountdownTimerProps) {
  // `now` (and a time-based `target`) differ between server and client, so the
  // first client render must match the server: render a stable placeholder
  // until mounted, then start ticking. Avoids a hydration mismatch under SSR.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (now === null) return <span className="font-mono tabular-nums">—</span>;
  const diff = Math.max(0, target.getTime() - now);
  if (!diff) return <span>{doneLabel}</span>;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  const minutes = Math.floor((diff / 60_000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return (
    <span className="font-mono tabular-nums">
      {days}d {hours}h {minutes}m {seconds}s
    </span>
  );
}
