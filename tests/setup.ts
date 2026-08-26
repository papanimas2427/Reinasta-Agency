import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// ---- jsdom polyfills needed by the app (Recharts, browser APIs) ----

// matchMedia is not implemented in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ResizeObserver used by Recharts ResponsiveContainer
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = window.ResizeObserver || (ResizeObserverMock as any);

// scrollIntoView used by chat widget
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || vi.fn();

// URL.createObjectURL used by jsPDF save flows
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => 'blob:mock');
  URL.revokeObjectURL = vi.fn();
}

// IntersectionObserver (used by some UI libs)
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as any;
}

// Clipboard API is stubbed by @testing-library/user-event itself — do not redefine here.

// jsdom CSS.supports sometimes missing
if (!window.CSS) {
  (window as any).CSS = {};
}
if (!window.CSS?.supports) {
  window.CSS.supports = () => true;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});
