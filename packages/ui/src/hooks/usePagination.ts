import { clamp } from '@lib/utils/clamp';
import { useCallback, useState } from 'react';

interface UsePaginationOptions {
  total: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({ total, pageSize = 10, initialPage = 1 }: UsePaginationOptions) {
  const [rawPage, setPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // `total` shrinks whenever a filter narrows the result set, and the stored
  // page can then point past the end. Clamping on read means offset/isLast stay
  // consistent with what is actually renderable on this pass, not one render later.
  const page = clamp(rawPage, 1, totalPages);
  const clampPage = useCallback((p: number) => clamp(p, 1, totalPages), [totalPages]);

  const goTo = useCallback((p: number) => setPage(clampPage(p)), [clampPage]);
  const next = useCallback(() => setPage((p) => clampPage(p + 1)), [clampPage]);
  const prev = useCallback(() => setPage((p) => clampPage(p - 1)), [clampPage]);
  const first = useCallback(() => setPage(1), []);
  const last = useCallback(() => setPage(totalPages), [totalPages]);

  const offset = (page - 1) * pageSize;
  const isFirst = page === 1;
  const isLast = page === totalPages;

  return { page, totalPages, pageSize, offset, isFirst, isLast, goTo, next, prev, first, last };
}
