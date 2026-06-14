import { useCallback, useState } from 'react';

export function useList<T>(initial: T[] = []) {
  const [list, setList] = useState<T[]>(initial);

  const push = useCallback((...items: T[]) => setList((l) => [...l, ...items]), []);
  const pop = useCallback(() => setList((l) => l.slice(0, -1)), []);
  const remove = useCallback(
    (index: number) => setList((l) => l.filter((_, i) => i !== index)),
    [],
  );
  const insert = useCallback(
    (index: number, item: T) => setList((l) => [...l.slice(0, index), item, ...l.slice(index)]),
    [],
  );
  const update = useCallback(
    (index: number, item: T) => setList((l) => l.map((v, i) => (i === index ? item : v))),
    [],
  );
  const move = useCallback(
    (from: number, to: number) =>
      setList((l) => {
        const next = [...l];
        const [item] = next.splice(from, 1);
        if (item === undefined) return l;
        next.splice(to, 0, item);
        return next;
      }),
    [],
  );
  const clear = useCallback(() => setList([]), []);
  const reset = useCallback(() => setList(initial), [initial]);

  return { list, setList, push, pop, remove, insert, update, move, clear, reset };
}
