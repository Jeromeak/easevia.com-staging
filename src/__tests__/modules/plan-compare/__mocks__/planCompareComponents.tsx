import type { TravelPackage } from '@/lib/types/api/package';

// Mock props for plan compare components
export const mockHeroBannerProps = {};

export const mockComparePlansProps = {
  packages: [] as TravelPackage[],
  loading: false,
  error: null as string | null,
};

export const mockPlanComparePageProps = {};

// Mock search params for testing
export const mockSearchParams = {
  get: jest.fn((key: string) => {
    const params: Record<string, string> = {
      package_ids: '1,2,3',
      currency_id: '1',
    };

    return params[key] || null;
  }),
};

export const mockSearchParamsEmpty = {
  get: jest.fn((key: string) => {
    const params: Record<string, string> = {};

    return params[key] || null;
  }),
};

export const mockSearchParamsInvalid = {
  get: jest.fn((key: string) => {
    const params: Record<string, string> = {
      package_ids: '999,invalid',
      currency_id: '1',
    };

    return params[key] || null;
  }),
};

// Mock router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  refresh: jest.fn(),
};

// Mock language currency context
export const mockLanguageCurrency = {
  currency: {
    id: '1',
    code: 'INR',
    symbol: '₹',
  },
};
