import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import i18n from 'i18next';
import { toHaveNoViolations } from 'jest-axe';
import { initReactI18next } from 'react-i18next';
import { afterEach, expect, vi } from 'vitest';

expect.extend(toHaveNoViolations);

configure({ asyncUtilTimeout: 10_000 });

// ExportToolbar uses react-i18next for its labels. The package ships no
// locale system of its own (that's an app concern), so tests just need the
// keys it actually reads resolved to English strings.
void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        dataTable: {
          export: 'Export',
          exportFormats: { csv: 'CSV', xlsx: 'Excel', json: 'JSON', pdf: 'PDF' },
        },
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// jsdom lacks matchMedia, which the theme system relies on.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class MockResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}
  disconnect = vi.fn();
  observe = vi.fn(() => {
    this.callback(
      [
        {
          contentRect: { height: 400, width: 800 },
        } as ResizeObserverEntry,
      ],
      this,
    );
  });
  unobserve = vi.fn();
}

class MockIntersectionObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  configurable: true,
  value: MockResizeObserver,
  writable: true,
});
Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value: MockResizeObserver,
  writable: true,
});
Object.defineProperty(window, 'IntersectionObserver', {
  configurable: true,
  value: MockIntersectionObserver,
  writable: true,
});
Object.defineProperty(globalThis, 'IntersectionObserver', {
  configurable: true,
  value: MockIntersectionObserver,
  writable: true,
});

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// driver.js can generate malformed selectors from Tailwind decimal classes in jsdom.
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalQuerySelector = Element.prototype.querySelector;
Element.prototype.querySelector = function guardedQuerySelector(selectors: string) {
  try {
    return originalQuerySelector.bind(this)(selectors);
  } catch (error) {
    if (selectors.includes('driver-active-element')) return null;
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalMatches = Element.prototype.matches;
Element.prototype.matches = function guardedMatches(selectors: string) {
  try {
    return originalMatches.bind(this)(selectors);
  } catch (error) {
    if (selectors.includes('driver-active-element')) return false;
    throw error;
  }
};

// ECharts uses Canvas renderer — jsdom stub returns null, override unconditionally.
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  strokeRect: vi.fn(),
  strokeText: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  ellipse: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
  setLineDash: vi.fn(),
  getLineDash: vi.fn(() => []),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
});

afterEach(() => {
  cleanup();
});
