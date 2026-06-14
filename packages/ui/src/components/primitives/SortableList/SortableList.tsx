import type { ReactNode } from 'react';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export type SortableListProps<T extends { id: string }> = {
  /** Items to render; each must have a stable `id`. */
  items: T[];
  /** Called with the reordered array after a drag completes. */
  onChange: (items: T[]) => void;
  /** Renders a single item. */
  renderItem: (item: T) => ReactNode;
};

function SortableRow<T extends { id: string }>({
  item,
  renderItem,
}: {
  item: T;
  renderItem: (item: T) => ReactNode;
}) {
  const sortable = useSortable({ id: item.id });
  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-2"
    >
      <button
        type="button"
        ref={sortable.setActivatorNodeRef}
        {...sortable.attributes}
        {...sortable.listeners}
        className="cursor-grab text-[var(--color-fg-subtle)]"
      >
        <GripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{renderItem(item)}</div>
    </div>
  );
}

export function SortableList<T extends { id: string }>({
  items,
  onChange,
  renderItem,
}: SortableListProps<T>) {
  const end = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    onChange(arrayMove(items, oldIndex, newIndex));
  };
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={end}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableRow key={item.id} item={item} renderItem={renderItem} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
