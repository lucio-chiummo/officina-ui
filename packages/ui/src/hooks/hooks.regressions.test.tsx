/**
 * Regression tests for defects found auditing the exported hook surface.
 * Each test names the behaviour a consumer can reasonably expect; several of
 * these hooks are exported from the package root but have no other coverage.
 */
import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCountdown } from './useCountdown';
import { useEventListener } from './useEventListener';
import { useIdleTimeout } from './useIdleTimeout';
import { useInfiniteScroll } from './useInfiniteScroll';
import { useKeyPress } from './useKeyPress';
import { usePagination } from './usePagination';
import { useResizeObserver } from './useResizeObserver';
import { useScrollLock } from './useScrollLock';
import { useScrollPosition } from './useScrollPosition';
import { useSelection } from './useSelection';

describe('hook regressions', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('useResizeObserver', () => {
    it('does not rebuild the observer when the caller passes an inline callback', () => {
      const observe = vi.fn();
      const disconnect = vi.fn();
      const ctor = vi.fn(() => ({ observe, disconnect, unobserve: vi.fn() }));
      vi.stubGlobal('ResizeObserver', ctor);

      const { rerender } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(document.createElement('div'));
        // Simulates the common call site: a fresh closure on every render.
        useResizeObserver(ref, () => undefined);
        return ref;
      });

      expect(ctor).toHaveBeenCalledTimes(1);
      rerender();
      rerender();

      expect(ctor).toHaveBeenCalledTimes(1);
    });
  });

  describe('useInfiniteScroll', () => {
    it('keeps a stable sentinel ref when onLoadMore is an inline closure', () => {
      const { result, rerender } = renderHook(() =>
        useInfiniteScroll({ onLoadMore: () => undefined, hasMore: true }),
      );

      const first = result.current;
      rerender();

      expect(result.current).toBe(first);
    });
  });

  describe('useIdleTimeout', () => {
    it('fires onActive only when returning from idle, not on every input event', () => {
      vi.useFakeTimers();
      const onIdle = vi.fn();
      const onActive = vi.fn();

      renderHook(() => useIdleTimeout({ timeout: 1000, onIdle, onActive }));

      // Mounting is not a transition out of idle.
      expect(onActive).not.toHaveBeenCalled();

      act(() => {
        window.dispatchEvent(new Event('mousemove'));
        window.dispatchEvent(new Event('mousemove'));
      });
      expect(onActive).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onIdle).toHaveBeenCalledTimes(1);

      act(() => {
        window.dispatchEvent(new Event('mousemove'));
      });
      expect(onActive).toHaveBeenCalledTimes(1);
    });
  });

  describe('useCountdown', () => {
    it('runs one interval for the whole countdown instead of restarting each tick', () => {
      vi.useFakeTimers();
      const setInterval = vi.spyOn(globalThis, 'setInterval');

      const { result } = renderHook(() => useCountdown(5));
      act(() => {
        result.current.start();
      });

      const afterStart = setInterval.mock.calls.length;
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.seconds).toBe(2);
      expect(setInterval.mock.calls.length).toBe(afterStart);
    });
  });

  describe('usePagination', () => {
    it('clamps the current page when the total shrinks below it', () => {
      const { result, rerender } = renderHook(
        ({ total }) => usePagination({ total, pageSize: 10 }),
        {
          initialProps: { total: 100 },
        },
      );

      act(() => {
        result.current.goTo(9);
      });
      expect(result.current.page).toBe(9);

      rerender({ total: 20 });

      expect(result.current.totalPages).toBe(2);
      expect(result.current.page).toBe(2);
      expect(result.current.offset).toBe(10);
      expect(result.current.isLast).toBe(true);
    });
  });

  describe('useSelection', () => {
    it('does not report allSelected from keys that are no longer in items', () => {
      const getKey = (n: number) => String(n);
      const { result, rerender } = renderHook(({ items }) => useSelection(items, getKey), {
        initialProps: { items: [1, 2, 3] },
      });

      act(() => {
        result.current.selectAll();
      });
      expect(result.current.allSelected).toBe(true);

      // Items change; previously selected keys 1 and 2 are gone.
      rerender({ items: [3, 4, 5] });

      expect(result.current.selectedItems).toEqual([3]);
      expect(result.current.allSelected).toBe(false);
    });
  });

  describe('useScrollLock', () => {
    it('restores the original body padding rather than clearing it', () => {
      document.body.style.paddingRight = '24px';

      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });
      rerender({ locked: false });

      expect(document.body.style.paddingRight).toBe('24px');
      document.body.style.paddingRight = '';
    });
  });

  describe('useEventListener', () => {
    it('does not resubscribe on every render when options are an inline object', () => {
      const add = vi.spyOn(window, 'addEventListener');

      const { rerender } = renderHook(() => {
        useEventListener('resize', () => undefined, undefined, { passive: true });
      });

      const initial = add.mock.calls.length;
      rerender();
      rerender();

      expect(add.mock.calls.length).toBe(initial);
    });
  });

  describe('useScrollPosition', () => {
    it('reports the scroll offset already present on mount', () => {
      Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 320, configurable: true });

      const { result } = renderHook(() => useScrollPosition());

      expect(result.current.y).toBe(320);
    });
  });

  describe('useKeyPress', () => {
    it('releases the key when the window loses focus mid-press', () => {
      const { result } = renderHook(() => useKeyPress('a'));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });
      expect(result.current).toBe(true);

      act(() => {
        window.dispatchEvent(new Event('blur'));
      });
      expect(result.current).toBe(false);
    });
  });
});
