import { cn } from '@lib/utils/cn';
import { Copy, Pin, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { SavedView } from '@/lib/filters';

import { Button } from '../Button';
import { Combobox, type ComboboxOption } from '../Combobox';
import { useOptionalFiltersContext } from './FiltersContext';

export type { SavedView } from '@/lib/filters';

export type SavedViewsStorage = {
  load: () => Promise<SavedView[]>;
  save: (views: SavedView[]) => Promise<void>;
};

export type LegacySavedView = { id: string; label: string; filters: unknown };

type ContextSavedViewsProps = {
  /** Query-string key the active view serializes filters into. */
  urlKey: string;
  /** Storage adapter for persisting saved views. Defaults to localStorage. */
  storage?: SavedViewsStorage;
  /** Label for the save-view action. */
  saveLabel?: string;
  /** Label for the update-current-view action. */
  updateLabel?: string;
  /** Label for the share-view action. */
  shareLabel?: string;
  /** Called with a shareable URL when the user shares a view. */
  onShare?: (url: string) => void;
  /** Extra classes for the container. */
  className?: string;
};

type LegacySavedViewsProps = {
  /** Storage key used to persist views (legacy controlled mode). */
  storageKey: string;
  /** Id of the active saved view, or null (controlled). */
  value: string | null;
  /** Called with the selected view (or null when cleared). */
  onChange: (view: LegacySavedView | null) => void;
  /** Current filter state captured when saving a new view. */
  currentFilters: unknown;
  /** Label for the save-view action. */
  saveLabel?: string;
  /** Placeholder for the view selector. */
  placeholder?: string;
};

export type SavedViewsProps = ContextSavedViewsProps | LegacySavedViewsProps;

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const stableStringify = (value: unknown) => JSON.stringify(value);

const storageKeyFor = (urlKey: string) => `officina.filters.views.${urlKey}`;

const loadLocalViews = (urlKey: string): SavedView[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(storageKeyFor(urlKey));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedView[];
  } catch {
    return [];
  }
};

const saveLocalViews = (urlKey: string, views: SavedView[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKeyFor(urlKey), JSON.stringify(views));
};

const shareUrl = (urlKey: string, encodedUrl: string): string => {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  if (encodedUrl) url.searchParams.set(urlKey, encodedUrl);
  else url.searchParams.delete(urlKey);
  return url.toString();
};

function LegacySavedViews({
  storageKey,
  value,
  onChange,
  currentFilters,
  saveLabel = 'Save',
  placeholder,
}: LegacySavedViewsProps) {
  const [views, setViews] = useState<LegacySavedView[]>([]);

  const encodeFilters = (filters: unknown) => {
    try {
      return btoa(encodeURIComponent(JSON.stringify(filters)));
    } catch {
      return '';
    }
  };
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      setViews(JSON.parse(raw) as LegacySavedView[]);
    } catch {
      setViews([]);
    }
  }, [storageKey]);
  const persist = (next: LegacySavedView[]) => {
    setViews(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  const options = useMemo<ComboboxOption<string>[]>(
    () => views.map((view) => ({ value: view.id, label: view.label })),
    [views],
  );
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Combobox
        className="min-w-48 flex-1"
        options={options}
        value={value}
        onChange={(id) => onChange(views.find((view) => view.id === id) ?? null)}
        {...(placeholder ? { placeholder } : {})}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const id = createId();
          const existing = views.find(
            (view) => JSON.stringify(view.filters) === JSON.stringify(currentFilters),
          );
          if (existing) {
            onChange(existing);
            return;
          }
          const next = [
            ...views,
            { id, label: `${saveLabel} ${views.length + 1}`, filters: currentFilters },
          ];
          persist(next);
          const params = new URLSearchParams(window.location.search);
          params.set('view', id);
          const encoded = encodeFilters(currentFilters);
          if (encoded) params.set('filters', encoded);
          window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
        }}
      >
        <Save className="size-4" />
        {saveLabel}
      </Button>
    </div>
  );
}

function ContextSavedViews({
  urlKey,
  storage,
  saveLabel = 'Save as...',
  updateLabel = 'Update view',
  shareLabel = 'Share view',
  onShare,
  className,
}: ContextSavedViewsProps) {
  const filters = useOptionalFiltersContext();
  const [views, setViews] = useState<SavedView[]>([]);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);

  if (!filters) {
    throw new Error('SavedViews with urlKey must be used within FiltersProvider');
  }

  useEffect(() => {
    let alive = true;
    const load = storage ? storage.load() : Promise.resolve(loadLocalViews(urlKey));
    void load.then((next) => {
      if (alive) setViews(next);
    });
    return () => {
      alive = false;
    };
  }, [storage, urlKey]);

  const persist = (next: SavedView[]) => {
    setViews(next);
    if (storage) void storage.save(next);
    else saveLocalViews(urlKey, next);
  };

  const activeView = views.find((view) => view.id === activeViewId) ?? null;
  const dirty =
    activeView !== null && stableStringify(activeView.state) !== stableStringify(filters.state);
  const pinnedViews = views.filter((view) => view.pinned);

  const saveAs = () => {
    const fallbackName = `View ${views.length + 1}`;
    const name =
      typeof window === 'undefined'
        ? fallbackName
        : (window.prompt('Save view as', fallbackName)?.trim() ?? '');
    if (!name) return;
    const nextView: SavedView = {
      id: createId(),
      name,
      state: filters.state,
      pinned: true,
      createdAt: new Date().toISOString(),
    };
    persist([...views, nextView]);
    setActiveViewId(nextView.id);
  };

  const updateActive = () => {
    if (!activeView) return;
    persist(
      views.map((view) => (view.id === activeView.id ? { ...view, state: filters.state } : view)),
    );
  };

  const togglePin = () => {
    if (!activeView) return;
    persist(
      views.map((view) => (view.id === activeView.id ? { ...view, pinned: !view.pinned } : view)),
    );
  };

  const share = () => {
    const next = shareUrl(urlKey, filters.encodedUrl);
    if (next) onShare?.(next);
    const clipboard = typeof window === 'undefined' ? undefined : window.navigator.clipboard;
    if (!next || !clipboard?.writeText) return;
    void clipboard.writeText(next);
  };

  const options = views.map<ComboboxOption<string>>((view) => ({
    value: view.id,
    label: view.name,
  }));

  return (
    <div className={cn('space-y-2', className)}>
      {pinnedViews.length > 0 ? (
        <div role="tablist" aria-label="Pinned filter views" className="flex flex-wrap gap-1.5">
          {pinnedViews.map((view) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={view.id === activeViewId}
              onClick={() => {
                filters.setState(view.state);
                setActiveViewId(view.id);
              }}
              className={cn(
                'h-8 rounded-md border px-3 text-xs font-semibold transition-colors',
                view.id === activeViewId
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent-fg)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg-base)]',
              )}
            >
              {view.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Combobox
          className="min-w-48 flex-1"
          options={options}
          value={activeViewId}
          onChange={(id) => {
            const view = views.find((item) => item.id === id);
            if (!view) {
              setActiveViewId(null);
              return;
            }
            filters.setState(view.state);
            setActiveViewId(view.id);
          }}
          placeholder="Saved views"
        />
        <Button variant="secondary" size="sm" onClick={saveAs}>
          <Save className="size-4" />
          {saveLabel}
        </Button>
        {activeView ? (
          <Button variant={dirty ? 'soft' : 'ghost'} size="sm" onClick={updateActive}>
            {updateLabel}
          </Button>
        ) : null}
        {activeView ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={activeView.pinned ? 'Unpin view' : 'Pin view'}
            onClick={togglePin}
          >
            <Pin className="size-4" />
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" onClick={share}>
          <Copy className="size-4" />
          {shareLabel}
        </Button>
      </div>
    </div>
  );
}

export function SavedViews(props: SavedViewsProps) {
  if ('urlKey' in props) return <ContextSavedViews {...props} />;
  return <LegacySavedViews {...props} />;
}
