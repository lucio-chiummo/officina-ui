import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Combobox, type ComboboxOption, type ComboboxProps } from '../Combobox';

export type AsyncSelectProps<T = string> = Omit<
  ComboboxProps<T>,
  'options' | 'loading' | 'onInputChange'
> & {
  queryKey: (query: string) => unknown[];
  queryFn: (query: string) => Promise<ComboboxOption<T>[]>;
  minChars?: number;
  minCharsMessage?: string;
};

export function AsyncSelect<T = string>({
  queryKey,
  queryFn,
  minChars = 1,
  minCharsMessage,
  ...props
}: AsyncSelectProps<T>) {
  const [query, setQuery] = useState('');
  const belowMin = query.length > 0 && query.length < minChars;
  const result = useQuery({
    queryKey: queryKey(query),
    queryFn: () => queryFn(query),
    enabled: query.length >= minChars,
  });
  const nextEmptyMessage = belowMin
    ? (minCharsMessage ?? `Type at least ${String(minChars)} characters`)
    : props.emptyMessage;
  return (
    <Combobox<T>
      {...props}
      options={query.length >= minChars ? (result.data ?? []) : []}
      loading={query.length >= minChars ? result.isFetching : false}
      {...(nextEmptyMessage !== undefined ? { emptyMessage: nextEmptyMessage } : {})}
      onInputChange={setQuery}
    />
  );
}
