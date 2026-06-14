import { Dialog as HeadlessDialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Command } from 'cmdk';
import { useEffect, type ReactNode } from 'react';
import { create } from 'zustand';

export type CommandAction = {
  id: string;
  label: string;
  section: 'navigation' | 'actions' | 'recent';
  icon?: ReactNode;
  keywords?: string[];
  perform: () => void;
};

type CommandStore = {
  actions: CommandAction[];
  open: boolean;
  setOpen: (open: boolean) => void;
  register: (actions: CommandAction[]) => () => void;
};

export const useCommandStore = create<CommandStore>((set) => ({
  actions: [],
  open: false,
  setOpen: (open) => set({ open }),
  register: (actions) => {
    set((state) => ({
      actions: [
        ...state.actions.filter((item) => !actions.some((next) => next.id === item.id)),
        ...actions,
      ],
    }));
    return () =>
      set((state) => ({
        actions: state.actions.filter((item) => !actions.some((next) => next.id === item.id)),
      }));
  },
}));

export function registerCommands(actions: CommandAction[]) {
  return useCommandStore.getState().register(actions);
}

export function CommandPalette({
  label = 'Command palette',
  placeholder = 'Search commands',
}: {
  label?: string;
  placeholder?: string;
}) {
  const { actions, open, setOpen } = useCommandStore();
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!useCommandStore.getState().open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setOpen]);
  const sections = actions.reduce<Record<string, CommandAction[]>>((acc, action) => {
    (acc[action.section] ??= []).push(action);
    return acc;
  }, {});
  return (
    <HeadlessDialog open={open} onClose={() => setOpen(false)} className="relative z-[9996]">
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-[var(--motion-base)] ease-[var(--ease-standard)]"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-start justify-center p-3 pt-4 sm:p-4 sm:pt-24">
        <DialogPanel className="w-full max-w-lg overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] shadow-[var(--shadow-xl)] transition-opacity duration-[var(--motion-base)] ease-[var(--ease-standard)]">
          <DialogTitle className="sr-only">{label}</DialogTitle>
          <Command label={label}>
            <Command.Input
              placeholder={placeholder}
              className="w-full border-b border-[var(--color-border)] bg-transparent px-3 py-3 text-sm outline-none"
            />
            <Command.List className="max-h-80 overflow-y-auto p-2">
              {Object.entries(sections).map(([section, items]) => (
                <Command.Group
                  key={section}
                  heading={section}
                  className="px-2 pb-2 text-xs text-[var(--color-fg-subtle)] uppercase"
                >
                  {items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.keywords?.join(' ') ?? ''}`}
                      onSelect={() => {
                        item.perform();
                        setOpen(false);
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm aria-selected:bg-[var(--color-bg-muted)]"
                    >
                      {item.icon}
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
}
