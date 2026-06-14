import { cn } from '@lib/utils/cn';
import { SearchInput } from '@primitives/SearchInput';
import { useEffect, useRef } from 'react';

export interface SpotlightProps {
  /** Whether the spotlight overlay is open. */
  open: boolean;
  /** Called when the open state changes (Esc, overlay click). */
  onOpenChange: (open: boolean) => void;
  /** Current search query. */
  value: string;
  /** Called with the new query on input. */
  onChange: (value: string) => void;
  /** Result list rendered below the input. */
  children?: React.ReactNode;
  /** Placeholder text for the search input. */
  placeholder?: string;
}

export function Spotlight({
  open,
  onOpenChange,
  value,
  onChange,
  children,
  placeholder = 'Search',
}: SpotlightProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onOpenChange(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4" role="dialog" aria-modal="true">
      <button
        aria-label="Close search"
        className="absolute inset-0 cursor-default"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'relative mx-auto mt-[10vh] max-w-2xl rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3 shadow-[var(--shadow-xl)]',
        )}
      >
        <SearchInput ref={inputRef} value={value} onChange={onChange} placeholder={placeholder} />
        <div className="mt-3 max-h-[55vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
