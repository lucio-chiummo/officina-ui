const COLUMN_PREFIX = 'column-';

export const columnDroppableId = (columnId: string) => `${COLUMN_PREFIX}${columnId}`;

/**
 * Resolves the column a card was dropped on.
 *
 * dnd-kit reports whichever droppable sits under the pointer, and a board
 * registers two kinds: the columns themselves, and every card inside them. A
 * drop onto an empty area of a column reports the column; a drop onto an
 * occupied slot reports the card already there, and the target column has to be
 * read off that card.
 *
 * Returns undefined when the drop lands on nothing recognisable, so callers can
 * treat it as a cancelled drag rather than moving the card somewhere arbitrary.
 */
export function resolveDropColumn(
  overId: string | undefined,
  cards: readonly { id: string; columnId: string }[],
): string | undefined {
  if (!overId) return undefined;
  if (overId.startsWith(COLUMN_PREFIX)) return overId.slice(COLUMN_PREFIX.length);
  return cards.find((card) => card.id === overId)?.columnId;
}
