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

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      onCompleteRef.current?.();
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, seconds]);

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
