import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@lib/utils/cn';
import { GripVertical } from 'lucide-react';
import { type ReactNode } from 'react';

export interface KanbanCardItem {
  id: string;
  columnId: string;
  content: ReactNode;
}

export interface KanbanColumnItem {
  id: string;
  title: ReactNode;
}

export interface KanbanBoardProps {
  /** Column definitions in display order. */
  columns: KanbanColumnItem[];
  /** Cards, each referencing its column by id. */
  cards: KanbanCardItem[];
  /** Called when a card is dragged to a new column. */
  onMoveCard?: (cardId: string, columnId: string) => void;
  className?: string;
}

export function KanbanBoard({ columns, cards, onMoveCard, className }: KanbanBoardProps) {
  function handleDragEnd(event: DragEndEvent) {
    const cardId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : undefined;
    if (cardId && overId) onMoveCard?.(cardId, overId.replace('column-', ''));
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div
        className={cn(
          'flex gap-4 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4',
          className,
        )}
      >
        {columns.map((column) => {
          const columnCards = cards.filter((card) => card.columnId === column.id);
          return (
            <div
              key={column.id}
              id={`column-${column.id}`}
              className="w-72 shrink-0 rounded-lg bg-[var(--color-bg-muted)] p-3"
            >
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-fg-base)]">
                {column.title}
              </h3>
              <SortableContext
                items={columnCards.map((card) => card.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {columnCards.map((card) => (
                    <KanbanCard key={card.id} card={card} />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}

function KanbanCard({ card }: { card: KanbanCardItem }) {
  const sortable = useSortable({ id: card.id });
  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
      className="flex cursor-grab items-start gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3 text-sm text-[var(--color-fg-base)] shadow-[var(--shadow-sm)]"
    >
      <GripVertical className="mt-0.5 size-4 text-[var(--color-fg-subtle)]" aria-hidden />
      <div className="min-w-0 flex-1">{card.content}</div>
    </div>
  );
}
