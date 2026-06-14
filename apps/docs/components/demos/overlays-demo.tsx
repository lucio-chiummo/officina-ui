'use client';

import {
  ActionSheet,
  Avatar,
  Backdrop,
  Badge,
  Button,
  ClickAwayListener,
  ConfirmDialog,
  ContextMenu,
  Drawer,
  HoverCard,
  Modal,
  Paper,
  Popover,
  Popper,
  Portal,
  Sheet,
  Spotlight,
  Tooltip,
  Typography,
  Window,
} from '@officina/ui';
import { Settings, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Composable modal"
        description="Built from Portal and Backdrop primitives."
      >
        <p className="text-fd-muted-foreground text-sm">
          Use Modal for low-level overlay composition. Use Dialog, Drawer, or Sheet for product
          workflows.
        </p>
      </Modal>
    </>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Drawer"
        description="Large editing surface."
      >
        <p className="text-fd-muted-foreground text-sm">A wide side panel for editing workflows.</p>
      </Drawer>
    </>
  );
}

export function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open sheet
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Sheet">
        <p className="text-fd-muted-foreground text-sm">Compact side action panel.</p>
      </Sheet>
    </>
  );
}

export function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete item
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete item"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export function PopoverDemo() {
  return (
    <Popover trigger={<Button variant="secondary">Open popover</Button>}>
      <p>Popover content accepts render props too.</p>
    </Popover>
  );
}

export function PopperDemo() {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button ref={ref} variant="secondary" onClick={() => setOpen((o) => !o)}>
        Toggle popper
      </Button>
      <Popper anchor={ref.current} open={open} placement="bottom-start">
        Floating utility positioned with Floating UI.
      </Popper>
    </>
  );
}

export function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="Tooltip on top" side="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on the right" side="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" side="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
    </div>
  );
}

export function HoverCardDemo() {
  return (
    <HoverCard trigger={<Button variant="secondary">Hover card</Button>}>
      <Avatar initials="AA" alt="Officina Admin" />
      <p className="mt-2 text-sm">Rich hover preview.</p>
    </HoverCard>
  );
}

export function ContextMenuDemo() {
  return (
    <ContextMenu
      items={[
        { label: 'Settings', icon: <Settings className="size-4" /> },
        { label: 'Delete', icon: <Trash2 className="size-4" />, danger: true },
      ]}
    >
      <div className="border-fd-border rounded-md border border-dashed p-6 text-sm">
        Right click here
      </div>
    </ContextMenu>
  );
}

export function BackdropDemo() {
  return (
    <div className="border-fd-border relative h-24 w-full overflow-hidden rounded-lg border">
      <div className="bg-fd-primary/20 absolute inset-0" />
      <Backdrop className="absolute z-0 rounded-lg" blur />
      <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-white">
        Backdrop layer
      </div>
    </div>
  );
}

export function ActionSheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open action sheet
      </Button>
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Share report"
        actions={[
          { label: 'Copy link', onSelect: () => setOpen(false) },
          { label: 'Download PDF', onSelect: () => setOpen(false) },
          { label: 'Delete report', tone: 'danger', onSelect: () => setOpen(false) },
        ]}
      />
    </>
  );
}

export function WindowDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open window
      </Button>
      <Window
        open={open}
        onClose={() => setOpen(false)}
        title="Inspector"
        initialPosition={{ x: 120, y: 120 }}
      >
        <p className="text-fd-muted-foreground text-sm">
          Drag the title bar to move. Drag the bottom-right corner to resize. Double-click the title
          bar to maximize.
        </p>
      </Window>
    </>
  );
}

export function SpotlightDemo() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open search overlay
      </Button>
      <Spotlight
        open={open}
        onOpenChange={setOpen}
        value={search}
        onChange={setSearch}
        placeholder="Search everything"
      >
        <div className="text-fd-muted-foreground rounded-md p-3 text-sm">
          Results for {search || 'anything'}
        </div>
      </Spotlight>
    </>
  );
}

export function PortalDemo() {
  return (
    <Portal disabled>
      <Badge tone="info">Portal disabled for inline preview</Badge>
    </Portal>
  );
}

export function ClickAwayListenerDemo() {
  const [count, setCount] = useState(0);
  return (
    <ClickAwayListener onClickAway={() => setCount((c) => c + 1)}>
      <Paper className="p-3">
        <Typography variant="body">Click outside this box.</Typography>
        <Typography variant="caption" tone="muted">
          Away clicks: {count}
        </Typography>
      </Paper>
    </ClickAwayListener>
  );
}
