'use client';

import {
  ActionMenu,
  Button,
  ButtonGroup,
  CopyButton,
  FloatingActionButton,
  IconButton,
  RowActions,
  SpeedDial,
  SplitButton,
  ToggleButton,
  ToggleGroup,
  Toolbar,
} from '@officina/ui';
import {
  Archive,
  Bold,
  Copy,
  Grid2X2,
  Italic,
  List as ListIcon,
  Pencil,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

export function IconButtonDemo() {
  return (
    <div className="flex items-center gap-2">
      <IconButton aria-label="Edit" tooltip="Edit" icon={<Pencil />} />
      <IconButton aria-label="Copy" tooltip="Copy" variant="secondary" icon={<Copy />} />
      <IconButton aria-label="Delete" tooltip="Delete" variant="ghost" icon={<Trash2 />} />
      <IconButton aria-label="Add" size="sm" icon={<Plus />} />
    </div>
  );
}

export function ButtonGroupDemo() {
  return (
    <div className="flex flex-col gap-3">
      <ButtonGroup>
        <Button variant="secondary">Left</Button>
        <Button variant="secondary">Middle</Button>
        <Button variant="secondary">Right</Button>
      </ButtonGroup>
      <ButtonGroup>
        <IconButton aria-label="Bold" icon={<Bold />} variant="secondary" />
        <IconButton aria-label="Italic" icon={<Italic />} variant="secondary" />
      </ButtonGroup>
    </div>
  );
}

export function SplitButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton
        label="Publish"
        actions={[
          { label: 'Schedule', onSelect: () => {} },
          { label: 'Save draft', onSelect: () => {} },
        ]}
        onClick={() => {}}
      />
      <SplitButton
        label="Export"
        variant="secondary"
        actions={[
          { label: 'CSV', onSelect: () => {} },
          { label: 'JSON', onSelect: () => {} },
        ]}
        onClick={() => {}}
      />
    </div>
  );
}

export function ToggleButtonDemo() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <ToggleButton pressed={bold} onPressedChange={setBold} size="icon-sm">
        <Bold className="size-4" />
      </ToggleButton>
      <ToggleButton pressed={italic} onPressedChange={setItalic} size="icon-sm">
        <Italic className="size-4" />
      </ToggleButton>
    </div>
  );
}

export function ToggleGroupDemo() {
  const [value, setValue] = useState('grid');
  return (
    <ToggleGroup
      type="single"
      value={value}
      onChange={setValue}
      options={[
        { value: 'grid', label: 'Grid', icon: <Grid2X2 className="size-4" /> },
        { value: 'list', label: 'List', icon: <ListIcon className="size-4" /> },
      ]}
    />
  );
}

export function FabDemo() {
  return (
    <div className="border-fd-border relative h-24 w-full overflow-hidden rounded-lg border">
      <FloatingActionButton aria-label="Create" placement="bottom-right" className="absolute">
        <Plus className="size-4" />
      </FloatingActionButton>
    </div>
  );
}

export function SpeedDialDemo() {
  return (
    <div className="border-fd-border relative h-36 w-full rounded-lg border border-dashed p-3">
      <SpeedDial
        className="absolute right-3 bottom-3"
        actions={[
          { label: 'Create', icon: <Plus className="size-4" />, onClick: () => {} },
          { label: 'Settings', icon: <Settings className="size-4" />, onClick: () => {} },
        ]}
      />
    </div>
  );
}

export function CopyButtonDemo() {
  return (
    <div className="flex items-center gap-3">
      <CopyButton value="Officina Admin" />
      <CopyButton value="npm i @officina/ui" variant="secondary" />
    </div>
  );
}

export function ActionMenuDemo() {
  return (
    <div className="border-fd-border flex w-full max-w-xs items-center justify-between rounded-md border px-3 py-2">
      <span className="text-sm font-medium">Q3 report.pdf</span>
      <ActionMenu
        label="Record actions"
        sections={[
          {
            items: [
              { label: 'Edit', icon: <Pencil /> },
              { label: 'Duplicate', icon: <Copy /> },
            ],
          },
          { items: [{ label: 'Delete', icon: <Trash2 />, danger: true }] },
        ]}
      />
    </div>
  );
}

export function RowActionsDemo() {
  return (
    <div className="border-fd-border flex w-full max-w-xs items-center justify-between rounded-md border px-3 py-2">
      <span className="text-sm font-medium">Ada Lovelace</span>
      <RowActions
        max={2}
        actions={[
          { label: 'Edit', icon: <Pencil />, onClick: () => {} },
          { label: 'Archive', icon: <Archive />, onClick: () => {} },
          { label: 'Delete', icon: <Trash2 />, danger: true },
        ]}
      />
    </div>
  );
}

export function ToolbarDemo() {
  return (
    <Toolbar
      groups={[
        [
          <Button key="b" variant="ghost" size="icon-sm">
            <Bold className="size-4" />
          </Button>,
          <Button key="i" variant="ghost" size="icon-sm">
            <Italic className="size-4" />
          </Button>,
        ],
      ]}
    />
  );
}
