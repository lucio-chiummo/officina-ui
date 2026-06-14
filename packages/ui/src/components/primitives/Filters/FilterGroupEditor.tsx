import { lazy, Suspense } from 'react';

import type { FilterGroupEditorProps } from './FilterGroupEditorPanel';

export type { FilterGroupEditorProps } from './FilterGroupEditorPanel';

const LazyFilterGroupEditorPanel = lazy(() =>
  import('./FilterGroupEditorPanel').then((module) => ({ default: module.FilterGroupEditorPanel })),
);

export function FilterGroupEditor(props: FilterGroupEditorProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="h-28 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
        />
      }
    >
      <LazyFilterGroupEditorPanel {...props} />
    </Suspense>
  );
}
