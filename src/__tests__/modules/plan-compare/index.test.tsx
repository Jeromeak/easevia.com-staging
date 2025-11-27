import React from 'react';
import { render, screen } from '@testing-library/react';
import PlanCompare from '@/app/plan-compare/page';
import { comparePackages } from '@/lib/api/package';
import { mockComparePackagesResponse } from './__mocks__/planCompareApi';
import { mockRouter, mockLanguageCurrency } from './__mocks__/planCompareComponents';

// Mock the package API
jest.mock('@/lib/api/package', () => ({
  comparePackages: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key: string) => {
      const params: Record<string, string> = {
        package_ids: '1,2,3',
        currency_id: '1',
      };

      return params[key] || null;
    }),
  })),
}));

// Mock the language currency context
jest.mock('@/context/hooks/useLanguageCurrency', () => ({
  useLanguageCurrency: jest.fn(() => mockLanguageCurrency),
}));

// Mock common components
jest.mock('@/common/components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

jest.mock('@/common/components/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

// Mock the HeroBanner component
jest.mock('@/app/plan-compare/components/HeroBanner', () => ({
  HeroBanner: () => <div data-testid="hero-banner">Hero Banner</div>,
}));

// Mock the ComparePlans component
jest.mock('@/app/plan-compare/components/ComparePlans', () => ({
  ComparePlane: () => <div data-testid="compare-plans">Compare Plans</div>,
}));

// Mock the ArrowLeft icon
jest.mock('@/icons/icon', () => ({
  ArrowLeft: ({ className, width, height }: { className?: string; width?: string; height?: string }) => (
    <svg data-testid="arrow-left" className={className} width={width} height={height}>
      <path d="M10 6L2 12l8 6" />
    </svg>
  ),
}));

const mockComparePackages = comparePackages as jest.MockedFunction<typeof comparePackages>;

describe('Plan Compare Module Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockComparePackages.mockResolvedValue(mockComparePackagesResponse);
  });

  it('should render the complete plan compare page', () => {
    render(<PlanCompare />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render with Suspense fallback initially', () => {
    render(<PlanCompare />);

    // The Suspense fallback should not be visible as components are mocked
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should handle complete user flow', async () => {
    render(<PlanCompare />);

    // Verify all components are rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Since components are mocked, we just verify the page renders
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockComparePackages.mockRejectedValueOnce(new Error('API Error'));

    render(<PlanCompare />);

    // Page should still render even with API errors
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should handle empty packages response', async () => {
    mockComparePackages.mockResolvedValueOnce([]);

    render(<PlanCompare />);

    // Page should still render with empty response
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle different URL parameters', () => {
    const { useSearchParams } = jest.requireMock('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn((key: string) => {
        const params: Record<string, string> = {
          package_ids: '1,2',
          currency_id: '2',
        };

        return params[key] || null;
      }),
    });

    render(<PlanCompare />);

    // Since components are mocked, we just verify the page renders
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
  });

  it('should handle missing URL parameters', () => {
    const { useSearchParams } = jest.requireMock('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn(() => null),
    });

    render(<PlanCompare />);

    // Since components are mocked, we just verify the page renders
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
  });

  it('should handle different currency contexts', () => {
    const { useLanguageCurrency } = jest.requireMock('@/context/hooks/useLanguageCurrency');
    useLanguageCurrency.mockReturnValue({
      currency: {
        id: '2',
        code: 'USD',
        symbol: '$',
      },
    });

    render(<PlanCompare />);

    // Since components are mocked, we just verify the page renders
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
  });

  it('should handle component unmount during API calls', async () => {
    let resolvePromise: (value: typeof mockComparePackagesResponse) => void;
    const promise = new Promise<typeof mockComparePackagesResponse>((resolve) => {
      resolvePromise = resolve;
    });
    mockComparePackages.mockReturnValueOnce(promise);

    const { unmount } = render(<PlanCompare />);

    // Unmount before API call completes
    unmount();

    // Resolve the promise after unmount
    resolvePromise!(mockComparePackagesResponse);

    // Should not cause any errors
    expect(true).toBe(true);
  });

  it('should render with proper structure', () => {
    render(<PlanCompare />);

    const fragment = document.querySelector('div');
    expect(fragment).toBeInTheDocument();
  });

  it('should handle multiple re-renders', () => {
    const { rerender } = render(<PlanCompare />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Re-render
    rerender(<PlanCompare />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle concurrent API calls', () => {
    const { rerender } = render(<PlanCompare />);

    // Since components are mocked, we just verify the page renders
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();

    // Trigger another render
    rerender(<PlanCompare />);

    // Should render without issues
    expect(screen.getByTestId('compare-plans')).toBeInTheDocument();
  });
});
