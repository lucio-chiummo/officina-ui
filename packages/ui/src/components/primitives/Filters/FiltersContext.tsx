import { createContext, useContext, type ReactNode } from 'react';

import type { UseFiltersReturn } from './useFilters';

const FiltersContext = createContext<UseFiltersReturn<unknown> | null>(null);

export type FiltersProviderProps<TRow> = {
  value: UseFiltersReturn<TRow>;
  children: ReactNode;
};

export function FiltersProvider<TRow>({ value, children }: FiltersProviderProps<TRow>) {
  return (
    <FiltersContext.Provider value={value as UseFiltersReturn<unknown>}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFiltersContext<TRow = unknown>(): UseFiltersReturn<TRow> {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error('useFiltersContext must be used within FiltersProvider');
  }
  return ctx as UseFiltersReturn<TRow>;
}

export function useOptionalFiltersContext<TRow = unknown>(): UseFiltersReturn<TRow> | null {
  return useContext(FiltersContext) as UseFiltersReturn<TRow> | null;
}
