'use client';

import {
  AppBar,
  AppBarSection,
  AppBarTitle,
  AsyncSelect,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CodeEditor,
  Editor,
  ExportToolbar,
  FilterBar,
  FilterBuilder,
  FilterGroupEditor,
  FiltersProvider,
  FormError,
  FormHelperText,
  FormLabel,
  ImageCropper,
  ImageList,
  ImageListItem,
  Input,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  ListSubheader,
  Masonry,
  MasonryItem,
  PageBody,
  PageHeader,
  PageSection,
  PhoneInput,
  PropertyItem,
  PropertyList,
  SearchFilter,
  SkeletonRow,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  useFilters,
} from '@officina/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home, Settings } from 'lucide-react';
import { type ComponentProps, type ReactNode, useState } from 'react';

// --- shared highlight wrapper ----------------------------------------------
// Several primitives only make sense rendered together (CardHeader needs a
// Card, TableCell needs a TableRow, ...), so their docs pages share one
// composed example. HighlightTarget rings + labels the slice of that example
// each page is actually documenting, so siblings read as distinct pages.
function HighlightTarget({
  active,
  label,
  children,
}: {
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  if (!active) return children;
  return (
    <div className="relative rounded-[var(--radius-md)] ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg-base)]">
      <span className="absolute bottom-full left-2 mb-1 rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-[var(--color-accent-contrast)]">
        {label}
      </span>
      {children}
    </div>
  );
}

// --- shared sample data ----------------------------------------------------

const customers = [
  { id: 'c-1', name: 'Ada Lovelace', plan: 'Enterprise', seats: 42 },
  { id: 'c-2', name: 'Grace Hopper', plan: 'Pro', seats: 18 },
  { id: 'c-3', name: 'Radia Perlman', plan: 'Pro', seats: 27 },
];

const filterFields = [
  { id: 'name', label: 'Name', type: 'string' as const },
  {
    id: 'plan',
    label: 'Plan',
    type: 'enum' as const,
    options: [
      { label: 'Pro', value: 'Pro' },
      { label: 'Enterprise', value: 'Enterprise' },
    ],
  },
  { id: 'seats', label: 'Seats', type: 'number' as const },
];

// --- Card parts ------------------------------------------------------------

function ComposedCard({
  highlight,
}: {
  highlight?: 'header' | 'title' | 'description' | 'content' | 'footer';
}) {
  return (
    <Card>
      <HighlightTarget active={highlight === 'header'} label="CardHeader">
        <CardHeader>
          <HighlightTarget active={highlight === 'title'} label="CardTitle">
            <CardTitle>Acme Operations</CardTitle>
          </HighlightTarget>
          <HighlightTarget active={highlight === 'description'} label="CardDescription">
            <CardDescription>Growth plan — renews May 11, 2026.</CardDescription>
          </HighlightTarget>
        </CardHeader>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'content'} label="CardContent">
        <CardContent>
          <p className="text-fd-muted-foreground text-sm">
            Compose header, title, description, content, and footer to build a card surface.
          </p>
        </CardContent>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'footer'} label="CardFooter">
        <CardFooter>
          <Button size="sm" variant="soft">
            Manage
          </Button>
        </CardFooter>
      </HighlightTarget>
    </Card>
  );
}

export const CardHeaderDemo = () => <ComposedCard highlight="header" />;
export const CardTitleDemo = () => <ComposedCard highlight="title" />;
export const CardDescriptionDemo = () => <ComposedCard highlight="description" />;
export const CardContentDemo = () => <ComposedCard highlight="content" />;
export const CardFooterDemo = () => <ComposedCard highlight="footer" />;

// --- List parts ------------------------------------------------------------

function ComposedList({
  highlight,
}: {
  highlight?: 'item' | 'button' | 'content' | 'decorator' | 'subheader' | 'divider';
}) {
  return (
    <List variant="outlined">
      <HighlightTarget active={highlight === 'subheader'} label="ListSubheader">
        <ListSubheader>Navigation</ListSubheader>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'item'} label="ListItem">
        <ListItem>
          <HighlightTarget active={highlight === 'button'} label="ListItemButton">
            <ListItemButton selected>
              <HighlightTarget active={highlight === 'decorator'} label="ListItemDecorator">
                <ListItemDecorator>
                  <Home className="size-4" />
                </ListItemDecorator>
              </HighlightTarget>
              <HighlightTarget active={highlight === 'content'} label="ListItemContent">
                <ListItemContent title="Dashboard" description="Overview and KPIs" />
              </HighlightTarget>
            </ListItemButton>
          </HighlightTarget>
        </ListItem>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'divider'} label="ListDivider">
        <ListDivider />
      </HighlightTarget>
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

export const ListItemDemo = () => <ComposedList highlight="item" />;
export const ListItemButtonDemo = () => <ComposedList highlight="button" />;
export const ListItemContentDemo = () => <ComposedList highlight="content" />;
export const ListItemDecoratorDemo = () => <ComposedList highlight="decorator" />;
export const ListSubheaderDemo = () => <ComposedList highlight="subheader" />;
export const ListDividerDemo = () => <ComposedList highlight="divider" />;

export function ImageListItemDemo() {
  return (
    <ImageList cols={3} gap={8}>
      {['Aurora', 'Harbor', 'Skyline'].map((label, index) => (
        <ImageListItem key={label} caption={label}>
          <div
            className="aspect-video w-full rounded-md"
            style={{ background: `hsl(${index * 60 + 200} 60% 55%)` }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

// --- Table parts -----------------------------------------------------------

function ComposedTable({
  highlight,
}: {
  highlight?: 'body' | 'caption' | 'cell' | 'footer' | 'head' | 'header' | 'row';
}) {
  return (
    <Table>
      <HighlightTarget active={highlight === 'caption'} label="TableCaption">
        <TableCaption>Active customers this cycle.</TableCaption>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'header'} label="TableHeader">
        <TableHeader>
          <TableRow>
            <HighlightTarget active={highlight === 'head'} label="TableHead">
              <TableHead>Customer</TableHead>
            </HighlightTarget>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Seats</TableHead>
          </TableRow>
        </TableHeader>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'body'} label="TableBody">
        <TableBody>
          {customers.map((row, index) => (
            <HighlightTarget
              key={row.id}
              active={index === 0 && highlight === 'row'}
              label="TableRow"
            >
              <TableRow>
                <HighlightTarget active={index === 0 && highlight === 'cell'} label="TableCell">
                  <TableCell>{row.name}</TableCell>
                </HighlightTarget>
                <TableCell>{row.plan}</TableCell>
                <TableCell className="text-right">{row.seats}</TableCell>
              </TableRow>
            </HighlightTarget>
          ))}
        </TableBody>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'footer'} label="TableFooter">
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {customers.reduce((sum, row) => sum + row.seats, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </HighlightTarget>
    </Table>
  );
}

export const TableBodyDemo = () => <ComposedTable highlight="body" />;
export const TableCaptionDemo = () => <ComposedTable highlight="caption" />;
export const TableCellDemo = () => <ComposedTable highlight="cell" />;
export const TableFooterDemo = () => <ComposedTable highlight="footer" />;
export const TableHeadDemo = () => <ComposedTable highlight="head" />;
export const TableHeaderDemo = () => <ComposedTable highlight="header" />;
export const TableRowDemo = () => <ComposedTable highlight="row" />;

export function SkeletonRowDemo() {
  return <SkeletonRow rows={4} className="w-full" />;
}

// --- Page parts ------------------------------------------------------------

function ComposedPage({ highlight }: { highlight?: 'header' | 'body' | 'section' }) {
  return (
    <div className="w-full">
      <HighlightTarget active={highlight === 'header'} label="PageHeader">
        <PageHeader
          title="Customers"
          description="Manage workspaces and their plans."
          breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Customers' }]}
          actions={<Button size="sm">New customer</Button>}
        />
      </HighlightTarget>
      <HighlightTarget active={highlight === 'body'} label="PageBody">
        <PageBody>
          <HighlightTarget active={highlight === 'section'} label="PageSection">
            <PageSection title="Overview" description="Key metrics for the current cycle.">
              <p className="text-fd-muted-foreground text-sm">Section content goes here.</p>
            </PageSection>
          </HighlightTarget>
        </PageBody>
      </HighlightTarget>
    </div>
  );
}

export const PageHeaderDemo = () => <ComposedPage highlight="header" />;
export const PageBodyDemo = () => <ComposedPage highlight="body" />;
export const PageSectionDemo = () => <ComposedPage highlight="section" />;

// --- AppBar parts ----------------------------------------------------------

function ComposedAppBar({ highlight }: { highlight?: 'section' | 'title' }) {
  return (
    <AppBar>
      <HighlightTarget active={highlight === 'section'} label="AppBarSection">
        <AppBarSection>
          <HighlightTarget active={highlight === 'title'} label="AppBarTitle">
            <AppBarTitle>Officina Admin</AppBarTitle>
          </HighlightTarget>
        </AppBarSection>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'section'} label="AppBarSection">
        <AppBarSection>
          <Button size="sm" variant="soft">
            Settings
          </Button>
        </AppBarSection>
      </HighlightTarget>
    </AppBar>
  );
}

export const AppBarSectionDemo = () => <ComposedAppBar highlight="section" />;
export const AppBarTitleDemo = () => <ComposedAppBar highlight="title" />;

// --- Form parts ------------------------------------------------------------

function ComposedField({ highlight }: { highlight?: 'label' | 'helper' | 'error' }) {
  return (
    <div className="grid w-full gap-1.5">
      <HighlightTarget active={highlight === 'label'} label="FormLabel">
        <FormLabel htmlFor="workspace" required>
          Workspace name
        </FormLabel>
      </HighlightTarget>
      <Input id="workspace" defaultValue="Acme Operations" aria-invalid />
      <HighlightTarget active={highlight === 'helper'} label="FormHelperText">
        <FormHelperText>Shown to everyone on the team.</FormHelperText>
      </HighlightTarget>
      <HighlightTarget active={highlight === 'error'} label="FormError">
        <FormError>Workspace name is already taken.</FormError>
      </HighlightTarget>
    </div>
  );
}

export const FormLabelDemo = () => <ComposedField highlight="label" />;
export const FormHelperTextDemo = () => <ComposedField highlight="helper" />;
export const FormErrorDemo = () => <ComposedField highlight="error" />;

// --- Misc parts ------------------------------------------------------------

export function PropertyItemDemo() {
  return (
    <PropertyList>
      <PropertyItem label="Workspace">Acme Operations</PropertyItem>
      <PropertyItem label="Plan">Growth</PropertyItem>
      <PropertyItem label="Owner">ada@acme.test</PropertyItem>
    </PropertyList>
  );
}

export function MasonryItemDemo() {
  const heights = [80, 130, 100, 160, 90, 120];
  return (
    <Masonry columns={3} gap={8}>
      {heights.map((height, index) => (
        <MasonryItem key={index}>
          <div
            className="rounded-md"
            style={{ height, background: `hsl(${index * 40 + 200} 55% 55%)` }}
          />
        </MasonryItem>
      ))}
    </Masonry>
  );
}

export function AvatarGroupDemo() {
  return (
    <AvatarGroup max={3}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Alan Turing" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Katherine Johnson" />
      <Avatar name="Edsger Dijkstra" />
    </AvatarGroup>
  );
}

// --- Standalone inputs -----------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const directory = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'katherine', label: 'Katherine Johnson' },
  { value: 'radia', label: 'Radia Perlman' },
];

function AsyncSelectInner() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <AsyncSelect
      value={value}
      onChange={setValue}
      placeholder="Search people"
      queryKey={(query) => ['people', query]}
      queryFn={(query) =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                directory.filter((person) =>
                  person.label.toLowerCase().includes(query.toLowerCase()),
                ),
              ),
            300,
          ),
        )
      }
    />
  );
}

export function AsyncSelectDemo() {
  return (
    <QueryClientProvider client={queryClient}>
      <AsyncSelectInner />
    </QueryClientProvider>
  );
}

export function CodeEditorDemo() {
  const [value, setValue] = useState(
    'export function greet(name: string) {\n  return `Hello, ${name}!`;\n}\n',
  );
  return <CodeEditor value={value} onChange={setValue} language="typescript" height="180px" />;
}

export function EditorDemo() {
  const [value, setValue] = useState('<p>Rich text with <strong>formatting</strong>.</p>');
  return <Editor value={value} onChange={setValue} />;
}

export function PhoneInputDemo() {
  const [value, setValue] = useState('');
  return <PhoneInput value={value} onChange={setValue} defaultCountry="us" />;
}

const sampleImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#0ea5e9"/>
      </linearGradient></defs>
      <rect width="480" height="270" fill="url(#g)"/>
      <text x="240" y="145" font-family="sans-serif" font-size="28" fill="white"
        text-anchor="middle">Sample image</text>
    </svg>`,
  );

export function ImageCropperDemo() {
  return (
    <div className="w-full max-w-md">
      <ImageCropper src={sampleImage} aspect={16 / 9} onCrop={() => {}} />
    </div>
  );
}

// --- Filter family ---------------------------------------------------------

export function SearchFilterDemo() {
  const [value, setValue] = useState('');
  const results = customers.filter((row) => row.name.toLowerCase().includes(value.toLowerCase()));
  return (
    <div className="w-full space-y-3">
      <SearchFilter
        value={value}
        onChange={setValue}
        placeholder="Search customers"
        debounceMs={300}
      />
      <List>
        {results.map((row) => (
          <ListItem key={row.id}>
            <ListItemContent title={row.name} description={row.plan} />
          </ListItem>
        ))}
        {results.length === 0 ? (
          <ListItem>
            <ListItemContent title="No matches" />
          </ListItem>
        ) : null}
      </List>
    </div>
  );
}

function FiltersShell({ children }: { children: React.ReactNode }) {
  const filters = useFilters({ fields: filterFields, mode: 'client' });
  return <FiltersProvider value={filters}>{children}</FiltersProvider>;
}

export function FiltersProviderDemo() {
  return (
    <FiltersShell>
      <FilterBar />
    </FiltersShell>
  );
}

export function FilterBarDemo() {
  return (
    <FiltersShell>
      <FilterBar addLabel="Add filter" clearLabel="Clear all" />
    </FiltersShell>
  );
}

export function FilterGroupEditorDemo() {
  return (
    <FiltersShell>
      <FilterGroupEditor fields={filterFields} />
    </FiltersShell>
  );
}

export function FilterBuilderDemo() {
  const [condition, setCondition] = useState<ComponentProps<typeof FilterBuilder>['condition']>({
    id: 'c1',
    field: 'plan',
    op: 'eq',
    value: 'Pro',
  });
  return (
    <FilterBuilder
      condition={condition}
      fields={filterFields}
      onChange={(_id, patch) => setCondition((prev) => ({ ...prev, ...patch }))}
      onRemove={() => {}}
    />
  );
}

export function ExportToolbarDemo() {
  return (
    <ExportToolbar
      data={customers}
      filename="customers"
      formats={['csv', 'json']}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'plan', header: 'Plan' },
        { key: 'seats', header: 'Seats' },
      ]}
    />
  );
}
