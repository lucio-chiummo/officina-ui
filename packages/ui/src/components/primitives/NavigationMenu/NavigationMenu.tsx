import { cn } from '@lib/utils/cn';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { type ReactNode } from 'react';

export interface NavigationMenuItem {
  label: string;
  href?: string;
  content?: ReactNode;
}

export interface NavigationMenuProps {
  /** Top-level menu entries, optionally with nested children. */
  items: NavigationMenuItem[];
  className?: string;
}

export function NavigationMenu({ items, className }: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
    >
      <NavigationMenuPrimitive.List className="flex items-center gap-1">
        {items.map((item) => (
          <NavigationMenuPrimitive.Item key={item.label}>
            {item.content ? (
              <>
                <NavigationMenuPrimitive.Trigger className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-[var(--color-fg-base)] hover:bg-[var(--color-bg-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none">
                  {item.label}
                  <ChevronDown aria-hidden className="size-3" />
                </NavigationMenuPrimitive.Trigger>
                <NavigationMenuPrimitive.Content className="absolute top-full left-0 mt-2 min-w-72 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3 shadow-[var(--shadow-lg)]">
                  {item.content}
                </NavigationMenuPrimitive.Content>
              </>
            ) : (
              <NavigationMenuPrimitive.Link
                href={item.href}
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-[var(--color-fg-base)] hover:bg-[var(--color-bg-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
              >
                {item.label}
              </NavigationMenuPrimitive.Link>
            )}
          </NavigationMenuPrimitive.Item>
        ))}
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  );
}
