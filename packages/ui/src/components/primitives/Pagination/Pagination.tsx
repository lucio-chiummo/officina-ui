import { cn } from '@lib/utils/cn';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export type PaginationProps = {
  /** Current 1-based page number. */
  page: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called with the new page when the user navigates. */
  onPageChange: (page: number) => void;
  /** Page buttons shown either side of the current page. */
  siblingCount?: number;
  className?: string;
};

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(page: number, total: number, siblings: number): (number | 'ellipsis')[] {
  const totalNums = siblings * 2 + 5;
  if (total <= totalNums) return range(1, total);

  const left = Math.max(2, page - siblings);
  const right = Math.min(total - 1, page + siblings);

  const showLeft = left > 2;
  const showRight = right < total - 1;

  if (!showLeft && showRight) return [...range(1, 3 + siblings * 2), 'ellipsis', total];
  if (showLeft && !showRight) return [1, 'ellipsis', ...range(total - 2 - siblings * 2, total)];
  return [1, 'ellipsis', ...range(left, right), 'ellipsis', total];
}

const btnBase =
  'inline-flex size-8 items-center justify-center rounded-md border text-xs font-medium transition-colors duration-[var(--duration-fast)]';
const btnDefault =
  'border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]';
const btnActive =
  'border-[var(--color-fg-base)] bg-[var(--color-fg-base)] text-[var(--color-bg-base)]';
const btnDisabled = 'opacity-35 pointer-events-none';

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = buildPages(page, totalPages, siblingCount);

  return (
    <nav aria-label="Pagination" className={cn('flex flex-wrap items-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(btnBase, btnDefault, page <= 1 && btnDisabled)}
      >
        <ChevronLeft className="size-3.5" />
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${pages.slice(0, i).filter((item) => item === 'ellipsis').length}`}
            className="inline-flex size-8 items-center justify-center text-[var(--color-fg-subtle)]"
          >
            <MoreHorizontal className="size-3.5" />
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(btnBase, p === page ? btnActive : btnDefault)}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(btnBase, btnDefault, page >= totalPages && btnDisabled)}
      >
        <ChevronRight className="size-3.5" />
      </button>
    </nav>
  );
}
