import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  onComplete?: () => void;
}

export function useCountdown(initialSeconds: number, options: UseCountdownOptions = {}) {
  const { onComplete } = options;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Keying the interval on `seconds` restarted it after every tick, so each
  // second's delay was measured from the moment React committed the previous
  // tick — the countdown drifted steadily behind real time. One interval per
  // run, with the stop condition handled inside the updater, keeps it honest.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(
    (s = initialSeconds) => {
      setSeconds(s);
      setRunning(false);
    },
    [initialSeconds],
  );

  return { seconds, running, start, pause, reset };
}
