import { cn } from '@lib/utils/cn';
import { differenceInCalendarDays, format, min } from 'date-fns';

export interface GanttItem {
  id: string;
  label: string;
  start: Date;
  end: Date;
  color?: string;
}

export interface GanttChartProps {
  items: GanttItem[];
  className?: string;
}

export function GanttChart({ items, className }: GanttChartProps) {
  if (items.length === 0)
    return (
      <div className="rounded-lg border border-[var(--color-border)] p-4 text-sm text-[var(--color-fg-muted)]">
        No tasks
      </div>
    );
  const start = min(items.map((item) => item.start));
  const totalDays = Math.max(...items.map((item) => differenceInCalendarDays(item.end, start))) + 1;

  return (
    <div
      className={cn(
        'overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4',
        className,
      )}
    >
      <div className="mb-3 text-xs text-[var(--color-fg-muted)]">
        {format(start, 'MMM d')} - {totalDays} days
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const left = (differenceInCalendarDays(item.start, start) / totalDays) * 100;
          const width =
            (Math.max(1, differenceInCalendarDays(item.end, item.start) + 1) / totalDays) * 100;
          return (
            <div key={item.id} className="grid grid-cols-[10rem_1fr] items-center gap-3">
              <span className="truncate text-sm text-[var(--color-fg-base)]">{item.label}</span>
              <div className="h-7 rounded bg-[var(--color-bg-muted)]">
                <div
                  className="h-7 rounded bg-[var(--color-accent)]"
                  style={{ marginLeft: `${left}%`, width: `${width}%`, background: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
