import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCopyToClipboardResult {
  copied: boolean;
  /** Writes `text` to the clipboard. Resolves to whether the copy succeeded. */
  copy: (text: string) => Promise<boolean>;
}

export function useCopyToClipboard(resetAfter = 2000): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResetTimer = useCallback(() => {
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
  }, []);

  useEffect(() => clearResetTimer, [clearResetTimer]);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        clearResetTimer();
        resetTimer.current = setTimeout(() => setCopied(false), resetAfter);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [clearResetTimer, resetAfter],
  );

  return { copied, copy };
}
