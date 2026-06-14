'use client';

import {
  Accordion,
  AppBar,
  AppBarSection,
  AppBarTitle,
  Badge,
  BottomNavigation,
  Button,
  CommandPalette,
  Dropdown,
  Kbd,
  Megamenu,
  Menu,
  NavigationMenu,
  OnboardingTour,
  Pagination,
  ScrollSpy,
  Stepper,
  TreeView,
  Wizard,
} from '@officina/ui';
import { Bell, Home, Mail, Plus, Settings } from 'lucide-react';
import { useState } from 'react';

export function AccordionDemo() {
  return (
    <Accordion
      items={[
        {
          id: 'tokens',
          title: 'Token-aware styling',
          content: 'Panels use shared color, border, radius, and focus tokens.',
        },
        {
          id: 'keyboard',
          title: 'Keyboard friendly',
          content: 'Disclosure behavior comes from Headless UI.',
        },
      ]}
    />
  );
}

export function NavigationMenuDemo() {
  return (
    <NavigationMenu
      items={[
        { label: 'Dashboard', href: '/dashboard' },
        {
          label: 'Products',
          content: (
            <div className="grid gap-2 text-sm">
              <a className="hover:bg-fd-muted rounded-md p-2" href="/products">
                Catalog
              </a>
              <a className="hover:bg-fd-muted rounded-md p-2" href="/products/new">
                New product
              </a>
            </div>
          ),
        },
      ]}
    />
  );
}

export function MenuDemo() {
  return (
    <Menu
      sections={[
        {
          heading: 'Workspace',
          items: [
            { label: 'Settings', icon: <Settings className="size-4" /> },
            { label: 'Invite member', icon: <Plus className="size-4" /> },
          ],
        },
      ]}
    >
      <Button variant="secondary">Open menu</Button>
    </Menu>
  );
}

export function MegamenuDemo() {
  return (
    <Megamenu
      trigger="Products"
      columns={[
        {
          heading: 'Commerce',
          items: [
            { label: 'Catalog', description: 'Products and variants', href: '/products' },
            { label: 'Orders', description: 'Fulfillment workflow', href: '/orders' },
          ],
        },
      ]}
    />
  );
}

export function DropdownDemo() {
  return (
    <Dropdown
      trigger={<Button variant="secondary">Actions</Button>}
      sections={[
        {
          heading: 'Content',
          items: [
            { label: 'Duplicate', onClick: () => {} },
            { label: 'Archive', onClick: () => {} },
          ],
        },
      ]}
    />
  );
}

export function BottomNavigationDemo() {
  const [value, setValue] = useState('home');
  return (
    <BottomNavigation
      value={value}
      onChange={setValue}
      items={[
        { value: 'home', label: 'Home', icon: <Home className="size-4" /> },
        { value: 'mail', label: 'Inbox', icon: <Mail className="size-4" /> },
        { value: 'alerts', label: 'Alerts', icon: <Bell className="size-4" /> },
      ]}
    />
  );
}

export function AppBarDemo() {
  return (
    <AppBar tone="subtle" className="w-full rounded-lg">
      <AppBarTitle>Officina workspace</AppBarTitle>
      <AppBarSection>
        <Badge tone="success">Live</Badge>
        <Button size="xs" variant="secondary">
          Action
        </Button>
      </AppBarSection>
    </AppBar>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(2);
  const [wide, setWide] = useState(7);
  return (
    <div className="flex flex-col gap-3">
      <Pagination page={page} totalPages={5} onPageChange={setPage} />
      <Pagination page={wide} totalPages={20} onPageChange={setWide} />
    </div>
  );
}

export function StepperDemo() {
  const [step, setStep] = useState(1);
  return (
    <Stepper
      steps={[
        { id: 'setup', label: 'Setup', description: 'Project created' },
        { id: 'brand', label: 'Brand', description: 'Tokens selected' },
        { id: 'ship', label: 'Ship', description: 'Ready for QA' },
      ]}
      current={step}
      onStepClick={setStep}
    />
  );
}

export function WizardDemo() {
  return (
    <Wizard
      steps={[
        {
          id: 'account',
          label: 'Account',
          content: <p className="text-fd-muted-foreground text-sm">Create workspace.</p>,
        },
        {
          id: 'theme',
          label: 'Theme',
          content: <p className="text-fd-muted-foreground text-sm">Pick tokens.</p>,
        },
      ]}
      onComplete={() => {}}
    />
  );
}

export function OnboardingTourDemo() {
  return (
    <div className="w-full space-y-2">
      <OnboardingTour run={false} steps={[]} />
      <div className="border-fd-border text-fd-muted-foreground rounded-md border border-dashed p-4 text-sm">
        Tour primitive configured. Enable <Kbd>run</Kbd> in product flows.
      </div>
    </div>
  );
}

export function CommandPaletteDemo() {
  return (
    <div className="space-y-2">
      <Button
        onClick={() =>
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
        }
      >
        Press Cmd/Ctrl K
      </Button>
      <CommandPalette />
    </div>
  );
}

export function ScrollSpyDemo() {
  return (
    <ScrollSpy
      items={[
        { id: 'atoms', label: 'Primitive Basics' },
        { id: 'forms', label: 'Form Inputs' },
        { id: 'overlays', label: 'Overlays' },
        { id: 'charts', label: 'Charts' },
      ]}
    />
  );
}

export function TreeViewDemo() {
  return (
    <TreeView
      nodes={[
        {
          id: 'forms',
          label: 'Forms',
          children: [{ id: 'combobox', label: 'Combobox' }],
        },
      ]}
    />
  );
}
