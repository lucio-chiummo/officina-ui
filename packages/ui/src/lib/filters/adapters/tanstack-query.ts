import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { UseFiltersReturn } from '@/components/primitives/Filters';

export type UseFilteredQueryOptions<TData, TRow = unknown> = {
  queryKey: readonly unknown[];
  endpoint: string;
  filters: UseFiltersReturn<TRow>;
  requestInit?: RequestInit;
  select?: (json: unknown) => TData;
};

const withQueryString = (endpoint: string, queryString: string): string => {
  if (!queryString) return endpoint;
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}${queryString}`;
};

export function useFilteredQuery<TData, TRow = unknown>({
  queryKey,
  endpoint,
  filters,
  requestInit,
  select,
}: UseFilteredQueryOptions<TData, TRow>) {
  const queryString = filters.queryString;
  return useQuery({
    queryKey: [...queryKey, queryString],
    queryFn: async () => {
      const response = await fetch(withQueryString(endpoint, queryString), requestInit);
      if (!response.ok) {
        throw new Error(`Filtered query failed: ${response.status}`);
      }
      const json = (await response.json()) as unknown;
      return select ? select(json) : (json as TData);
    },
    placeholderData: keepPreviousData,
  });
}
