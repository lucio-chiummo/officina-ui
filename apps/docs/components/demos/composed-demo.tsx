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
import { type ComponentProps, useState } from 'react';

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

function ComposedCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acme Operations</CardTitle>
        <CardDescription>Growth plan — renews May 11, 2026.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-fd-muted-foreground text-sm">
          Compose header, title, description, content, and footer to build a card surface.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="soft">
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
}

export const CardHeaderDemo = ComposedCard;
export const CardTitleDemo = ComposedCard;
export const CardDescriptionDemo = ComposedCard;
export const CardContentDemo = ComposedCard;
export const CardFooterDemo = ComposedCard;

// --- List parts ------------------------------------------------------------

function ComposedList() {
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

export const ListItemDemo = ComposedList;
export const ListItemButtonDemo = ComposedList;
export const ListItemContentDemo = ComposedList;
export const ListItemDecoratorDemo = ComposedList;
export const ListSubheaderDemo = ComposedList;
export const ListDividerDemo = ComposedList;

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

function ComposedTable() {
  return (
    <Table>
      <TableCaption>Active customers this cycle.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead className="text-right">Seats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.plan}</TableCell>
            <TableCell className="text-right">{row.seats}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">
            {customers.reduce((sum, row) => sum + row.seats, 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export const TableBodyDemo = ComposedTable;
export const TableCaptionDemo = ComposedTable;
export const TableCellDemo = ComposedTable;
export const TableFooterDemo = ComposedTable;
export const TableHeadDemo = ComposedTable;
export const TableHeaderDemo = ComposedTable;
export const TableRowDemo = ComposedTable;

export function SkeletonRowDemo() {
  return <SkeletonRow rows={4} />;
}

// --- Page parts ------------------------------------------------------------

function ComposedPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Customers"
        description="Manage workspaces and their plans."
        breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Customers' }]}
        actions={<Button size="sm">New customer</Button>}
      />
      <PageBody>
        <PageSection title="Overview" description="Key metrics for the current cycle.">
          <p className="text-fd-muted-foreground text-sm">Section content goes here.</p>
        </PageSection>
      </PageBody>
    </div>
  );
}

export const PageHeaderDemo = ComposedPage;
export const PageBodyDemo = ComposedPage;
export const PageSectionDemo = ComposedPage;

// --- AppBar parts ----------------------------------------------------------

function ComposedAppBar() {
  return (
    <AppBar>
      <AppBarSection>
        <AppBarTitle>Officina Admin</AppBarTitle>
      </AppBarSection>
      <AppBarSection>
        <Button size="sm" variant="soft">
          Settings
        </Button>
      </AppBarSection>
    </AppBar>
  );
}

export const AppBarSectionDemo = ComposedAppBar;
export const AppBarTitleDemo = ComposedAppBar;

// --- Form parts ------------------------------------------------------------

function ComposedField() {
  return (
    <div className="grid w-full gap-1.5">
      <FormLabel htmlFor="workspace" required>
        Workspace name
      </FormLabel>
      <Input id="workspace" defaultValue="Acme Operations" aria-invalid />
      <FormHelperText>Shown to everyone on the team.</FormHelperText>
      <FormError>Workspace name is already taken.</FormError>
    </div>
  );
}

export const FormLabelDemo = ComposedField;
export const FormHelperTextDemo = ComposedField;
export const FormErrorDemo = ComposedField;

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
  return (
    <SearchFilter
      value={value}
      onChange={setValue}
      placeholder="Search customers"
      debounceMs={300}
    />
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
