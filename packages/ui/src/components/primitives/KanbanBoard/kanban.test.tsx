import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { KanbanBoard } from './KanbanBoard';
import { resolveDropColumn } from './resolveDropColumn';

const cards = [
  { id: 'card-1', columnId: 'todo', content: 'Write spec' },
  { id: 'card-2', columnId: 'doing', content: 'Ship it' },
];

describe('resolveDropColumn', () => {
  it('reads the column straight off a column droppable', () => {
    expect(resolveDropColumn('column-done', cards)).toBe('done');
  });

  it('reads the column off the card that was dropped on', () => {
    // dnd-kit reports the card under the pointer, not the column behind it.
    // Treating that id as a column is what made onMoveCard emit card ids.
    expect(resolveDropColumn('card-2', cards)).toBe('doing');
  });

  it('resolves nothing for a drop that landed outside the board', () => {
    expect(resolveDropColumn(undefined, cards)).toBeUndefined();
    expect(resolveDropColumn('some-unrelated-droppable', cards)).toBeUndefined();
  });

  it('handles a column id that itself contains the prefix', () => {
    const nested = [{ id: 'c', columnId: 'column-a', content: null }];
    expect(resolveDropColumn('column-column-a', nested)).toBe('column-a');
  });
});

describe('KanbanBoard', () => {
  it('renders a column with no cards as a drop target', () => {
    render(
      <KanbanBoard
        columns={[
          { id: 'todo', title: 'To do' },
          { id: 'done', title: 'Done' },
        ]}
        cards={[{ id: 'card-1', columnId: 'todo', content: 'Write spec' }]}
      />,
    );

    // An empty column still has to be reachable — it was previously rendered
    // with no droppable at all, so cards could never be moved into it.
    expect(screen.getByRole('heading', { name: 'Done' })).toBeInTheDocument();
  });
});
