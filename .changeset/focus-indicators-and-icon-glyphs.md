---
'@officina/ui': patch
---

Add missing keyboard focus indicators, and replace text glyphs used as icons.

Eighteen components render a raw `<button>` and never opted into the focus ring
the rest of the library uses, so keyboard users had no indication of where focus
was — a WCAG 2.4.7 failure. `RadioGroup` was worse: it cleared the browser
default with `outline-none` and styled only the checked state, leaving nothing
at all. Affected: Pagination, Chip, Alert, Banner, Wizard, Stepper, Carousel,
NotificationCenter, DataTable, DataGrid, FacetedFilter, SortableList, TreeView,
DateRangePicker, and RadioGroup.

Stepper drew completed steps with a `✓` character and TreeView drew its expander
with `▾`/`▸`. Text glyphs render differently per font, ignore the icon size
tokens, and are read aloud by screen readers; both now use the bundled lucide
icons the rest of the library uses.
