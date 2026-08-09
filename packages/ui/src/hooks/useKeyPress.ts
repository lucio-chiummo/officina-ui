import { useEffect, useState } from 'react';

export function useKeyPress(targetKey: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(false);
    };
    // Releasing a key while another window has focus never reaches us, so
    // without this the hook reports the key as held forever.
    const release = () => setPressed(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', release);
    };
  }, [targetKey]);

  return pressed;
}
