import { useCallback, useEffect, useRef, useState } from 'react';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseAsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useAsync<T>(asyncFn: () => Promise<T>, immediate = false) {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
    loading: false,
  });

  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState({ status: 'loading', data: null, error: null, loading: true });
    try {
      const data = await fnRef.current();
      if (mounted.current) setState({ status: 'success', data, error: null, loading: false });
    } catch (err) {
      if (mounted.current)
        setState({
          status: 'error',
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
          loading: false,
        });
    }
  }, []);

  useEffect(() => {
    if (immediate) void execute();
  }, [execute, immediate]);

  return { ...state, execute };
}
