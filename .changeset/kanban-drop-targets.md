---
'@officina/ui': patch
---

Fix KanbanBoard reporting card ids as column ids, and make empty columns
droppable.

Columns carried their `column-<id>` only as an HTML `id` attribute and were
never registered with dnd-kit, so `event.over.id` could only ever be one of the
cards. `onMoveCard` therefore fired with another card's id in the column
argument, and a column with no cards in it had no drop target at all. Columns
are now real droppables, the drop target resolves through the card underneath
when a card is landed on, and a drag that ends outside the board or back on its
own column no longer fires the callback.
