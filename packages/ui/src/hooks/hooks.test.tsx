import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDialogControls } from '@/components/primitives';

import { useAsync } from './useAsync';
import { useClickOutside } from './useClickOutside';
import { useCopyToClipboard } from './useCopyToClipboard';
import { useCountdown } from './useCountdown';
import { useDisclosure } from './useDisclosure';
import { useHotkeys } from './useHotkeys';
import { useIntersection } from './useIntersection';
import { useLocalStorage } from './useLocalStorage';
import { useMeasure } from './useMeasure';
import { usePagination } from './usePagination';
import { useSelection } from './useSelection';
import { useSessionStorage } from './useSessionStorage';

describe('hooks library', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('useAsync executes and stores resolved data', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.resolve('done')));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe('done');
  });

  it('useDisclosure toggles with callbacks', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const { result } = renderHook(() => useDisclosure({ onClose, onOpen }));

    expect(result.current.isOpen).toBe(false);
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(2);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('useDialogControls exposes trigger and dialog props', () => {
    const { result } = renderHook(() => useDialogControls());

    expect(result.current.dialogProps.open).toBe(false);

    act(() => result.current.triggerProps.onClick());

    expect(result.current.dialogProps.open).toBe(true);

    act(() => result.current.dialogProps.onClose());

    expect(result.current.dialogProps.open).toBe(false);
  });

  it('useLocalStorage persists values and falls back on invalid JSON', () => {
    localStorage.setItem('broken-key', '{bad-json');
    const broken = renderHook(() => useLocalStorage('broken-key', 'fallback'));
    const local = renderHook(() => useLocalStorage('local-key', 'fallback'));

    expect(broken.result.current[0]).toBe('fallback');

    act(() => local.result.current[1]((prev) => `${prev}-stored`));
    expect(local.result.current[0]).toBe('fallback-stored');
    expect(localStorage.getItem('local-key')).toBe('"fallback-stored"');

    act(() => local.result.current[2]());
    expect(local.result.current[0]).toBe('fallback');
  });

  it('useSessionStorage persists and removes values', () => {
    const session = renderHook(() => useSessionStorage('session-key', 1));

    act(() => session.result.current[1](2));

    expect(session.result.current[0]).toBe(2);
    expect(sessionStorage.getItem('session-key')).toBe('2');

    act(() => session.result.current[2]());

    expect(session.result.current[0]).toBe(1);
  });

  it('useSelection tracks selected items and bulk actions', () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    const { result } = renderHook(() => useSelection(items, (item) => item.id));

    act(() => result.current.select(items[0]!));
    expect(result.current.someSelected).toBe(true);
    expect(result.current.selectedItems).toEqual([items[0]]);
    expect(result.current.isSelected(items[0]!)).toBe(true);

    act(() => result.current.deselect(items[0]!));
    expect(result.current.selectedItems).toEqual([]);

    act(() => result.current.toggle(items[1]!));
    expect(result.current.selectedItems).toEqual([items[1]]);

    act(() => result.current.selectAll());
    expect(result.current.allSelected).toBe(true);

    act(() => result.current.deselectAll());
    expect(result.current.selectedItems).toEqual([]);
  });

  it('usePagination clamps bounds and reports total pages', () => {
    const { result } = renderHook(() => usePagination({ total: 35, pageSize: 10 }));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(4);
    expect(result.current.isFirst).toBe(true);

    act(() => result.current.prev());
    expect(result.current.page).toBe(1);

    act(() => result.current.goTo(99));
    expect(result.current.page).toBe(4);
    expect(result.current.isLast).toBe(true);

    act(() => result.current.prev());
    expect(result.current.page).toBe(3);
    expect(result.current.offset).toBe(20);

    act(() => result.current.first());
    expect(result.current.page).toBe(1);

    act(() => result.current.last());
    expect(result.current.page).toBe(4);
  });

  it('useHotkeys fires matching shortcuts and ignores inputs', () => {
    const handler = vi.fn();
    renderHook(() => useHotkeys('ctrl+k', handler));

    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' }));
    expect(handler).toHaveBeenCalledTimes(1);

    const input = document.createElement('input');
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, key: 'k' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('useCountdown decrements, stops at zero, and resets', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { result } = renderHook(() => useCountdown(2, { onComplete }));

    act(() => result.current.start());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(result.current.seconds).toBe(1);
    expect(result.current.running).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(result.current.seconds).toBe(0);
    expect(result.current.running).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);

    act(() => result.current.reset(5));
    expect(result.current.seconds).toBe(5);
    expect(result.current.running).toBe(false);
  });

  it('useCopyToClipboard writes text and resets copied state', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { result } = renderHook(() => useCopyToClipboard(500));

    await act(async () => {
      await result.current.copy('hello');
    });

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(result.current.copied).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(result.current.copied).toBe(false);
  });

  it('useCopyToClipboard does not let a stale timer reset a fresher copy', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { result } = renderHook(() => useCopyToClipboard(500));

    await act(async () => {
      await result.current.copy('first');
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    await act(async () => {
      await result.current.copy('second');
    });
    // The first call's timer would have fired here were it not cleared.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(result.current.copied).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    expect(result.current.copied).toBe(false);
  });

  it('useClickOutside fires the handler only for clicks outside the ref', () => {
    const handler = vi.fn();
    function Harness() {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);
      return (
        <div>
          <div data-testid="inside" ref={ref}>
            inside
          </div>
          <div data-testid="outside">outside</div>
        </div>
      );
    }
    render(<Harness />);

    screen.getByTestId('inside').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    screen.getByTestId('outside').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('useIntersection stores observer entries', async () => {
    let callback: IntersectionObserverCallback | null = null;
    class IntersectionObserverMock implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds = [];
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      disconnect() {}
      observe() {}
      takeRecords() {
        return [];
      }
      unobserve() {}
    }
    window.IntersectionObserver = IntersectionObserverMock;

    function Probe() {
      const ref = { current: document.createElement('div') };
      const entry = useIntersection(ref);
      return <span>{entry?.isIntersecting ? 'visible' : 'hidden'}</span>;
    }

    render(<Probe />);

    act(() => {
      callback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(await screen.findByText('visible')).toBeInTheDocument();
  });

  it('useMeasure reads element dimensions', async () => {
    class ResizeObserverMock implements ResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}
      disconnect() {}
      observe(target: Element) {
        this.callback(
          [
            {
              target,
              contentRect: DOMRect.fromRect({ height: 24, width: 120 }),
              borderBoxSize: [],
              contentBoxSize: [],
              devicePixelContentBoxSize: [],
            },
          ],
          this,
        );
      }
      unobserve() {}
    }
    window.ResizeObserver = ResizeObserverMock;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      DOMRect.fromRect({ height: 24, width: 120 }),
    );

    function Probe() {
      const [ref, rect] = useMeasure<HTMLDivElement>();
      return <div ref={ref}>{rect.width}</div>;
    }

    render(<Probe />);

    await waitFor(() => expect(screen.getByText('120')).toBeInTheDocument());
  });
});
