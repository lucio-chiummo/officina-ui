'use client';

import { Moon, Sun } from 'lucide-react';
import { type ReactNode, useState } from 'react';

/**
 * Preview frame for live component demos.
 *
 * The preview surface carries the `.officina-ui` base class and renders against
 * the library's own design tokens (`--color-bg-base` etc). A per-demo Light/Dark
 * toggle adds the `.dark` class locally so each component can be inspected in
 * both themes independently of the docs site theme.
 */
export function Demo({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  return (
    <div className="border-fd-border my-4 rounded-lg border">
      <div className="border-fd-border bg-fd-muted/40 flex items-center justify-between rounded-t-lg border-b px-3 py-1.5">
        <span className="text-fd-muted-foreground text-xs font-medium">Preview</span>
        <div className="bg-fd-background inline-flex items-center gap-0.5 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setDark(false)}
            aria-pressed={!dark}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${
              dark ? 'text-fd-muted-foreground' : 'bg-fd-card text-fd-foreground shadow-sm'
            }`}
          >
            <Sun className="size-3" /> Light
          </button>
          <button
            type="button"
            onClick={() => setDark(true)}
            aria-pressed={dark}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${
              dark ? 'bg-fd-card text-fd-foreground shadow-sm' : 'text-fd-muted-foreground'
            }`}
          >
            <Moon className="size-3" /> Dark
          </button>
        </div>
      </div>
      <div
        className={[
          // No `overflow-hidden` on the frame: inline popovers (Combobox,
          // FacetedFilter, MentionInput, …) open downward and must not be
          // clipped. `rounded-b-lg` keeps the corners since the wrapper no
          // longer clips them.
          'officina-ui flex min-h-32 flex-wrap items-center gap-4 rounded-b-lg p-6',
          dark ? 'dark' : '',
        ].join(' ')}
        style={{
          background: 'var(--color-bg-base)',
          color: 'var(--color-fg-base)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
