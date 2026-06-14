import { useCallback, useState } from 'react';

export function useSelection<T>(items: T[], getKey: (item: T) => string) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const isSelected = useCallback((item: T) => selected.has(getKey(item)), [selected, getKey]);
  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && !allSelected;

  const select = useCallback(
    (item: T) => {
      setSelected((s) => new Set([...s, getKey(item)]));
    },
    [getKey],
  );

  const deselect = useCallback(
    (item: T) => {
      setSelected((s) => {
        const n = new Set(s);
        n.delete(getKey(item));
        return n;
      });
    },
    [getKey],
  );

  const toggle = useCallback(
    (item: T) => {
      setSelected((s) => {
        const key = getKey(item);
        const n = new Set(s);
        if (n.has(key)) n.delete(key);
        else n.add(key);
        return n;
      });
    },
    [getKey],
  );

  const selectAll = useCallback(() => setSelected(new Set(items.map(getKey))), [items, getKey]);
  const deselectAll = useCallback(() => setSelected(new Set()), []);
  const toggleAll = useCallback(
    () => (allSelected ? deselectAll() : selectAll()),
    [allSelected, selectAll, deselectAll],
  );

  const selectedItems = items.filter((item) => selected.has(getKey(item)));

  return {
    selected,
    selectedItems,
    isSelected,
    allSelected,
    someSelected,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    toggleAll,
  };
}
