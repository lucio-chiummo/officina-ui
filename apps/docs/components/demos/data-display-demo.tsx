'use client';

import {
  ActivityFeed,
  AvatarStack,
  Card,
  Carousel,
  Chat,
  CodeBlock,
  Collapsible,
  CopyField,
  CountdownTimer,
  DescriptionList,
  DiffViewer,
  InfiniteScroll,
  JSONViewer,
  Kbd,
  KanbanBoard,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  ListSubheader,
  Markdown,
  MetadataList,
  OrgChart,
  PropertyList,
  Scheduler,
  Shortcut,
  SortableList,
  StatCard,
  Timeline,
  TransferList,
  TreeList,
  VirtualList,
} from '@officina/ui';
import { Home, KeyRound, Mail, Settings } from 'lucide-react';
import { type ComponentProps, useState } from 'react';

export function ListDemo() {
  return (
    <List variant="outlined">
      <ListSubheader>Navigation</ListSubheader>
      <ListItem>
        <ListItemButton selected>
          <ListItemDecorator>
            <Home className="size-4" />
          </ListItemDecorator>
          <ListItemContent title="Dashboard" description="Overview and KPIs" />
        </ListItemButton>
      </ListItem>
      <ListDivider />
      <ListItem>
        <ListItemButton>
          <ListItemDecorator>
            <Settings className="size-4" />
          </ListItemDecorator>
          <ListItemContent title="Settings" description="Workspace controls" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export function DescriptionListDemo() {
  return (
    <DescriptionList
      items={[
        { term: 'Plan', detail: 'Pro' },
        { term: 'Seats', detail: '24 / 50' },
        { term: 'Renewal', detail: 'May 11, 2026' },
      ]}
    />
  );
}

export function StatCardDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      <StatCard
        label="MRR"
        value="$24.8k"
        delta={12.4}
        deltaLabel="vs last month"
        sparkline={[12, 18, 14, 22, 28, 34, 42]}
      />
      <StatCard label="Active users" value="1,284" delta={4.1} deltaLabel="vs last week" />
      <StatCard label="Churn" value="2.3%" delta={-0.8} deltaLabel="vs last month" />
    </div>
  );
}

export function PropertyListDemo() {
  return (
    <PropertyList
      items={[
        { label: 'Workspace', value: 'Acme Operations' },
        { label: 'Plan', value: 'Growth' },
        { label: 'Owner', value: 'ada@acme.test' },
      ]}
    />
  );
}

export function MetadataListDemo() {
  return (
    <MetadataList
      columns={1}
      items={[
        { label: 'Workspace ID', value: 'ws_8f21', icon: <KeyRound />, copyValue: 'ws_8f21' },
        { label: 'Created', value: 'May 11, 2026', icon: <Settings /> },
        { label: 'Primary contact', value: 'ada@acme.test', icon: <Mail /> },
      ]}
    />
  );
}

export function AvatarStackDemo() {
  return (
    <AvatarStack
      max={3}
      avatars={[
        { name: 'Ada Lovelace' },
        { name: 'Alan Turing' },
        { name: 'Grace Hopper' },
        { name: 'Katherine Johnson' },
        { name: 'Edsger Dijkstra' },
      ]}
    />
  );
}

export function CardDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <Card>
        <div className="space-y-1">
          <p className="text-fd-foreground text-sm font-semibold">Revenue</p>
          <p className="text-fd-foreground text-2xl font-semibold tracking-tight">$24.8k</p>
          <p className="text-fd-muted-foreground text-xs">Card surface primitive.</p>
        </div>
      </Card>
      <Card>
        <div className="space-y-1">
          <p className="text-fd-foreground text-sm font-semibold">Active users</p>
          <p className="text-fd-foreground text-2xl font-semibold tracking-tight">1,284</p>
          <p className="text-fd-muted-foreground text-xs">Compose any content inside.</p>
        </div>
      </Card>
    </div>
  );
}

export function JSONViewerDemo() {
  return <JSONViewer value={{ plan: 'commercial', ready: false, primitives: 116 }} />;
}

export function ActivityFeedDemo() {
  return (
    <ActivityFeed
      items={[
        {
          id: '1',
          actor: 'Lucio',
          action: 'added primitive demos',
          timestamp: 'Now',
          target: 'Primitive Lab',
        },
      ]}
    />
  );
}

export function MarkdownDemo() {
  return <Markdown>{'**Markdown** supports tables, links, and safe formatted content.'}</Markdown>;
}

export function TimelineDemo() {
  return (
    <Timeline
      items={[
        { id: 'planned', title: 'Planned', description: 'Primitive plan created' },
        { id: 'built', title: 'Built', description: 'Primitive lab route added' },
      ]}
    />
  );
}

export function KanbanBoardDemo() {
  const [cards, setCards] = useState([
    { id: 'task-1', columnId: 'todo', content: 'Polish primitive lab' },
    { id: 'task-2', columnId: 'done', content: 'Ship v3 primitives' },
  ]);
  return (
    <KanbanBoard
      columns={[
        { id: 'todo', title: 'Todo' },
        { id: 'done', title: 'Done' },
      ]}
      cards={cards}
      onMoveCard={(cardId, columnId) =>
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, columnId } : c)))
      }
    />
  );
}

export function SortableListDemo() {
  const [items, setItems] = useState([
    { id: 'one', label: 'Inbox' },
    { id: 'two', label: 'Review' },
    { id: 'three', label: 'Ship' },
  ]);
  return <SortableList items={items} onChange={setItems} renderItem={(item) => item.label} />;
}

export function TransferListDemo() {
  const [value, setValue] = useState<string[]>(['read']);
  return (
    <TransferList
      items={[
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' },
        { value: 'delete', label: 'Delete' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

export function InfiniteScrollDemo() {
  return (
    <InfiniteScroll hasMore onLoadMore={() => {}} loader="Waiting for next page">
      <div className="border-fd-border rounded-md border p-3 text-sm">Feed item</div>
    </InfiniteScroll>
  );
}

export function VirtualListDemo() {
  return (
    <VirtualList
      items={Array.from({ length: 100 }, (_, i) => `Virtual row ${i + 1}`)}
      height={180}
      renderItem={(item) => (
        <div className="border-fd-border border-b px-3 py-2 text-sm">{item}</div>
      )}
    />
  );
}

export function CarouselDemo() {
  return (
    <Carousel>
      {[
        <div
          key="one"
          className="bg-fd-primary/15 grid h-32 place-items-center rounded-lg text-sm font-semibold"
        >
          Slide one
        </div>,
        <div
          key="two"
          className="bg-fd-primary/15 grid h-32 place-items-center rounded-lg text-sm font-semibold"
        >
          Slide two
        </div>,
      ]}
    </Carousel>
  );
}

export function ChatDemo() {
  const [messages, setMessages] = useState<ComponentProps<typeof Chat>['messages']>([
    {
      id: 'welcome',
      content: 'This is a real interactive Chat primitive.',
      sender: 'other',
      senderName: 'Officina Bot',
      timestamp: new Date(),
    },
  ]);
  return (
    <Chat
      messages={messages}
      onSend={(content) =>
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            content,
            sender: 'user',
            senderName: 'You',
            timestamp: new Date(),
            status: 'sent',
          },
        ])
      }
    />
  );
}

export function CountdownTimerDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <CountdownTimer target={new Date(Date.now() + 86_400_000)} />
      <CountdownTimer target={new Date(Date.now() + 3_600_000)} doneLabel="Starting now" />
    </div>
  );
}

export function DiffViewerDemo() {
  return <DiffViewer oldValue={'status: draft\nprice: 99'} newValue={'status: live\nprice: 129'} />;
}

export function CodeBlockDemo() {
  return (
    <CodeBlock code={'<Button variant="secondary">Save</Button>'} language="tsx" showLineNumbers />
  );
}

export function CollapsibleDemo() {
  return (
    <div className="grid w-full gap-2">
      <Collapsible title="Usage notes">
        Use controlled props for inputs and compose layout primitives freely.
      </Collapsible>
      <Collapsible title="Accessibility" defaultOpen>
        Disclosure state and focus management come from Headless UI.
      </Collapsible>
    </div>
  );
}

export function SchedulerDemo() {
  const base = new Date();
  const [events, setEvents] = useState<ComponentProps<typeof Scheduler>['events']>([
    {
      id: 'evt-1',
      title: 'Design review',
      start: new Date(base.getFullYear(), base.getMonth(), base.getDate(), 10),
      end: new Date(base.getFullYear(), base.getMonth(), base.getDate(), 11),
    },
  ]);
  return (
    <Scheduler
      events={events}
      onEventsChange={setEvents}
      defaultView="week"
      minHeight={420}
      onSlotSelect={({ start, end }) =>
        setEvents((prev) => [...prev, { id: `evt-${Date.now()}`, title: 'New event', start, end }])
      }
    />
  );
}

export function KbdDemo() {
  return (
    <div className="text-fd-muted-foreground flex items-center gap-2 text-sm">
      Open command menu with <Kbd>Cmd</Kbd> <Kbd>K</Kbd>
    </div>
  );
}

export function ShortcutDemo() {
  return (
    <div className="text-fd-muted-foreground flex flex-col gap-2 text-sm">
      <span className="flex items-center gap-2">
        Command menu <Shortcut keys="mod+k" />
      </span>
      <span className="flex items-center gap-2">
        Save <Shortcut keys="mod+s" />
      </span>
      <span className="flex items-center gap-2">
        Submit <Shortcut keys="shift+enter" withPlus />
      </span>
    </div>
  );
}

export function OrgChartDemo() {
  return (
    <OrgChart
      node={{
        id: 'ceo',
        label: 'Owner',
        description: 'Workspace',
        children: [
          { id: 'ops', label: 'Ops', description: 'Admin' },
          { id: 'sales', label: 'Sales', description: 'Member' },
        ],
      }}
    />
  );
}

export function TreeListDemo() {
  return (
    <TreeList
      defaultExpandAll
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'owner', header: 'Owner' },
        { key: 'size', header: 'Size', align: 'right' },
      ]}
      rows={[
        {
          id: 'src',
          name: 'src',
          owner: 'platform',
          size: '—',
          children: [
            { id: 'components', name: 'components', owner: 'design', size: '1.2 MB' },
            { id: 'lib', name: 'lib', owner: 'platform', size: '420 KB' },
          ],
        },
        { id: 'package', name: 'package.json', owner: 'platform', size: '4 KB' },
      ]}
    />
  );
}

export function CopyFieldDemo() {
  return (
    <div className="grid w-full gap-3">
      <CopyField label="API key" value="sk_live_8f21c0de4b71" />
      <CopyField
        label="Webhook URL"
        value="https://api.officina.dev/hooks/8f21"
        truncate
        monospace
      />
    </div>
  );
}
