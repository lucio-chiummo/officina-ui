---
'@officina/ui': patch
---

Stop icons overflowing their slot in Dropdown, ActionMenu, Chip, RadioGroup,
SpeedDial, and BottomNavigation.

Each of these renders a caller-supplied icon into a fixed-size `span`, but sized
only the span — not the SVG inside it. Icon libraries render at their own
intrinsic size (lucide defaults to 24px), so an icon handed over without an
explicit size class rendered half again too large, overflowed its 16px slot and
pushed the row's label out of alignment. The slots now size their SVG child, the
same way IconButton, InlineNotice, StatusLabel, FileItem, and MetadataList
already did.
