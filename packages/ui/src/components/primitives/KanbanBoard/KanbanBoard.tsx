import { closestCenter, DndContext, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@lib/utils/cn';
import { GripVertical } from 'lucide-react';
import { type ReactNode } from 'react';

import { columnDroppableId, resolveDropColumn } from './resolveDropColumn';

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
    const overId = event.over?.id === undefined ? undefined : String(event.over.id);
    const columnId = resolveDropColumn(overId, cards);
    if (!columnId) return;
    const current = cards.find((card) => card.id === cardId);
    if (current?.columnId === columnId) return;
    onMoveCard?.(cardId, columnId);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div
        className={cn(
          'flex gap-4 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4',
          className,
        )}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={cards.filter((card) => card.columnId === column.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}

function KanbanColumn({ column, cards }: { column: KanbanColumnItem; cards: KanbanCardItem[] }) {
  // Without a registered droppable, dnd-kit only ever reports the cards under
  // the pointer — so a column with no cards in it could not be dropped into at
  // all, and the board's own id prefix never appeared in a drag event.
  const { setNodeRef, isOver } = useDroppable({ id: columnDroppableId(column.id) });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-72 shrink-0 rounded-lg bg-[var(--color-bg-muted)] p-3 transition-colors duration-[var(--duration-fast)]',
        isOver && 'bg-[var(--color-bg-subtle)] ring-2 ring-[var(--color-accent)]',
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-[var(--color-fg-base)]">{column.title}</h3>
      <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        {/* Keeps an empty column a large enough drop target to aim at. */}
        <div className="min-h-16 space-y-2">
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
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
