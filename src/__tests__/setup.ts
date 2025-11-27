import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return React.createElement('img', props);
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000';

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock DataTransfer for clipboard events in tests
global.DataTransfer = class DataTransfer {
  private data: Map<string, string> = new Map();
  dropEffect: 'none' | 'copy' | 'link' | 'move' = 'none';
  effectAllowed: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' =
    'uninitialized';
  files: FileList = [] as unknown as FileList;
  items: DataTransferItemList = [] as unknown as DataTransferItemList;
  types: readonly string[] = [];

  getData(format: string): string {
    return this.data.get(format) || '';
  }

  setData(format: string, data: string): void {
    this.data.set(format, data);
  }

  clearData(): void {
    this.data.clear();
  }

  setDragImage(): void {
    // Mock implementation
  }
} as unknown as typeof DataTransfer;

// Mock ClipboardEvent for clipboard events in tests
global.ClipboardEvent = class ClipboardEvent extends Event {
  clipboardData: DataTransfer;

  constructor(type: string, eventInitDict?: ClipboardEventInit) {
    super(type, eventInitDict);
    this.clipboardData = eventInitDict?.clipboardData || new DataTransfer();
  }
} as typeof ClipboardEvent;
