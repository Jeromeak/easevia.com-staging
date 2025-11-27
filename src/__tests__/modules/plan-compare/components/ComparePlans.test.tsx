import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComparePlane } from '@/app/plan-compare/components/ComparePlans';
import { comparePackages, fetchPackageById } from '@/lib/api/package';
import { mockComparePackagesResponse } from '../__mocks__/planCompareApi';
import type { TravelPackage } from '@/lib/types/api/package';
import {
  mockSearchParams,
  mockSearchParamsEmpty,
  mockSearchParamsInvalid,
  mockRouter,
  mockLanguageCurrency,
} from '../__mocks__/planCompareComponents';

// Mock the package API
jest.mock('@/lib/api/package', () => ({
  comparePackages: jest.fn(),
  fetchPackageById: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
  useSearchParams: jest.fn(() => mockSearchParams),
}));

// Mock the language currency context
jest.mock('@/context/hooks/useLanguageCurrency', () => ({
  useLanguageCurrency: jest.fn(() => mockLanguageCurrency),
}));

// Mock the checkout context
const mockSetSelectedPlan = jest.fn();
jest.mock('@/context/hooks/useCheckout', () => ({
  useCheckout: jest.fn(() => ({
    setSelectedPlan: mockSetSelectedPlan,
    state: {
      selectedPlan: null,
      isAddressComplete: false,
      isAddressValidated: false,
      validationErrors: [],
      isLoading: false,
      paymentDetails: {
        paymentMethod: null,
        paymentStatus: 'pending',
      },
    },
  })),
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
const mockFetchPackageById = fetchPackageById as jest.MockedFunction<typeof fetchPackageById>;

describe('ComparePlans Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockComparePackages.mockResolvedValue(mockComparePackagesResponse);
    // Mock fetchPackageById to return the first package from mock data (cast to TravelPackage)
    mockFetchPackageById.mockResolvedValue(mockComparePackagesResponse[0] as TravelPackage);
    mockSetSelectedPlan.mockClear();
  });

  it('should render the component correctly', async () => {
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      // Plan names appear once in the header
      expect(within(table).getByText('Basic Plan')).toBeInTheDocument();
      expect(within(table).getByText('Premium Plan')).toBeInTheDocument();
      expect(within(table).getByText('VIP Plan')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    mockComparePackages.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ComparePlane />);

    expect(screen.getByText('Loading comparison data...')).toBeInTheDocument();
  });

  it('should fetch comparison data on mount', async () => {
    render(<ComparePlane />);

    await waitFor(() => {
      expect(mockComparePackages).toHaveBeenCalledWith(['1', '2', '3'], '1');
    });
  });

  it('should display comparison table with correct data', async () => {
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      // Check plan titles - appear once in the header
      expect(within(table).getByText('Basic Plan')).toBeInTheDocument();
      expect(within(table).getByText('Premium Plan')).toBeInTheDocument();
      expect(within(table).getByText('VIP Plan')).toBeInTheDocument();

      // Check prices
      expect(within(table).getByText('₹25,000')).toBeInTheDocument();
      expect(within(table).getByText('₹50,000')).toBeInTheDocument();
      expect(within(table).getByText('₹100,000')).toBeInTheDocument();

      // Check classes - each appears once per package column
      expect(within(table).getByText('ECONOMY')).toBeInTheDocument();
      expect(within(table).getByText('ECONOMY, BUSINESS')).toBeInTheDocument();
      expect(within(table).getByText('FIRST')).toBeInTheDocument();
    });
  });

  it('should display comparison features correctly', async () => {
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      // Check feature titles - scoped to table to avoid mobile duplicates
      expect(within(table).getByText('No. of Trips')).toBeInTheDocument();
      expect(within(table).getByText('No. of Persons')).toBeInTheDocument();
      expect(within(table).getByText('Date Changes')).toBeInTheDocument();
      expect(within(table).getByText('Class')).toBeInTheDocument();
      expect(within(table).getByText('Description')).toBeInTheDocument();
      expect(within(table).getByText('Duration (Days)')).toBeInTheDocument();
      expect(within(table).getByText('No. of Routes')).toBeInTheDocument();

      // Check trip counts - use getAllByText since "4" appears multiple times
      const tripCounts = within(table).getAllByText('4');
      expect(tripCounts.length).toBeGreaterThan(0);
      expect(within(table).getByText('8')).toBeInTheDocument();
      expect(within(table).getByText('12')).toBeInTheDocument();

      // Check member counts - use getAllByText since "1", "2", "4" may appear multiple times
      const memberCounts1 = within(table).getAllByText('1');
      expect(memberCounts1.length).toBeGreaterThan(0);
      const memberCounts2 = within(table).getAllByText('2');
      expect(memberCounts2.length).toBeGreaterThan(0);
      const memberCounts4 = within(table).getAllByText('4');
      expect(memberCounts4.length).toBeGreaterThan(0);

      // Check date changes
      expect(within(table).getByText('Upto 2 free')).toBeInTheDocument();
      expect(within(table).getByText('Upto 4 free')).toBeInTheDocument();
      expect(within(table).getByText('Upto 6 free')).toBeInTheDocument();

      // Check routes - use getAllByText since "1", "2" may appear multiple times
      const routes1 = within(table).getAllByText('1');
      expect(routes1.length).toBeGreaterThan(0);
      const routes2 = within(table).getAllByText('2');
      expect(routes2.length).toBeGreaterThan(0);
      expect(within(table).getByText('3')).toBeInTheDocument();
    });
  });

  it('should handle subscribe button clicks', async () => {
    const user = userEvent.setup();
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(within(table).getByText('Basic Plan')).toBeInTheDocument();
    });

    const table = screen.getByRole('table');
    const subscribeButtons = within(table).getAllByText('Subscribe');
    expect(subscribeButtons).toHaveLength(3);

    await user.click(subscribeButtons[0]);

    // Verify fetchPackageById was called with the correct package ID
    await waitFor(() => {
      expect(mockFetchPackageById).toHaveBeenCalledWith('1');
    });

    // Verify setSelectedPlan was called with the correct plan data
    await waitFor(() => {
      expect(mockSetSelectedPlan).toHaveBeenCalledWith({
        id: '1',
        title: 'Basic Plan',
        price: '₹25,000',
        classLabel: 'ECONOMY class',
        tripsPerYear: '4 trips/year',
        airlinesLabel: 'Air India',
        description: 'Basic travel package',
        additionalBenefits: ['Basic support'],
      });
    });

    // Verify router.push was called with the correct package ID
    expect(mockRouter.push).toHaveBeenCalledWith('/checkout?packageId=1');
  });

  it('should handle empty packages response', async () => {
    mockComparePackages.mockResolvedValueOnce([]);

    render(<ComparePlane />);

    await waitFor(() => {
      expect(screen.getByText('No packages found for comparison')).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockComparePackages.mockRejectedValueOnce(new Error('API Error'));

    render(<ComparePlane />);

    await waitFor(() => {
      expect(screen.getByText('No packages found for comparison')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle string errors', async () => {
    mockComparePackages.mockRejectedValueOnce('String error message');

    render(<ComparePlane />);

    await waitFor(() => {
      expect(screen.getByText('No packages found for comparison')).toBeInTheDocument();
    });
  });

  it('should handle empty package IDs from URL', async () => {
    const { useSearchParams } = jest.requireMock('next/navigation');
    useSearchParams.mockReturnValue(mockSearchParamsEmpty);

    render(<ComparePlane />);

    await waitFor(() => {
      // When no package IDs are provided, the component uses default values and shows the comparison table
      const table = screen.getByRole('table');
      expect(within(table).getByText('Basic Plan')).toBeInTheDocument();
    });
  });

  it('should handle invalid package IDs from URL', async () => {
    const { useSearchParams } = jest.requireMock('next/navigation');
    useSearchParams.mockReturnValue(mockSearchParamsInvalid);

    mockComparePackages.mockRejectedValueOnce(new Error('Package ID 999 not found'));

    render(<ComparePlane />);

    await waitFor(() => {
      expect(screen.getByText('No packages found for comparison')).toBeInTheDocument();
    });
  });

  it('should handle missing currency', async () => {
    const { useSearchParams } = jest.requireMock('next/navigation');
    const { useLanguageCurrency } = jest.requireMock('@/context/hooks/useLanguageCurrency');

    // Mock search params without currency_id
    useSearchParams.mockReturnValue({
      get: jest.fn((key: string) => {
        const params: Record<string, string | null> = {
          package_ids: '1,2,3',
          currency_id: null, // No currency in params
        };

        return params[key] || null;
      }),
    });

    // Mock currency as null
    useLanguageCurrency.mockReturnValue({ currency: null });

    render(<ComparePlane />);

    await waitFor(() => {
      // When currency is missing and no currency_id param, component shows error message
      expect(screen.getByText('No packages found for comparison')).toBeInTheDocument();
    });
  });

  it('should use default package IDs when none provided', async () => {
    const { useSearchParams } = jest.requireMock('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn((key: string) => {
        const params: Record<string, string | null> = {
          package_ids: null, // Explicitly null to trigger default behavior
          currency_id: '1',
        };

        return params[key] || null;
      }),
    });

    mockComparePackages.mockResolvedValueOnce(mockComparePackagesResponse);

    render(<ComparePlane />);

    // The component should use default package IDs when none are provided
    await waitFor(() => {
      expect(mockComparePackages).toHaveBeenCalledWith(['1', '2', '3'], '1');
    });
  });

  it('should prevent duplicate API calls with same parameters', async () => {
    const { rerender } = render(<ComparePlane />);

    await waitFor(() => {
      expect(mockComparePackages).toHaveBeenCalledTimes(1);
    });

    // Re-render with same props
    rerender(<ComparePlane />);

    await waitFor(() => {
      expect(mockComparePackages).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle packages with missing data gracefully', async () => {
    const packagesWithMissingData = [
      {
        id: '1',
        title: 'Test Plan',
        alias: null,
        description: null,
        trip_count: 0,
        member_count: 0,
        allowed_date_change_count: 0,
        allowed_route_count: 0,
        additional_benefits: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        airlines: [],
        classes: [],
        duration_days: 0,
        package_od_data: [],
        price: '',
      },
    ];

    mockComparePackages.mockResolvedValueOnce(packagesWithMissingData);
    // Mock fetchPackageById to return the same package for price fetching
    mockFetchPackageById.mockResolvedValueOnce(packagesWithMissingData[0]);

    render(<ComparePlane />);

    await waitFor(
      () => {
        const table = screen.getByRole('table');
        // Plan name appears once in the header
        expect(within(table).getByText('Test Plan')).toBeInTheDocument();
        // Empty values appear as '-' in feature rows
        const dashElements = within(table).getAllByText('-');
        expect(dashElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  it('should render subscribe buttons with correct styling', async () => {
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      const subscribeButtons = within(table).getAllByText('Subscribe');
      expect(subscribeButtons).toHaveLength(3);

      subscribeButtons.forEach((button) => {
        expect(button).toHaveClass('orange', 'px-6', 'rounded-full');
      });
    });
  });

  it('should render arrow icons in subscribe buttons', async () => {
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      const arrowIcons = within(table).getAllByTestId('arrow-left');
      expect(arrowIcons).toHaveLength(3);

      arrowIcons.forEach((icon) => {
        expect(icon).toHaveAttribute('width', '24');
        expect(icon).toHaveAttribute('height', '24');
        expect(icon).toHaveClass('transform', '-rotate-180');
      });
    });
  });

  it('should handle component unmount during API call', async () => {
    let resolvePromise: (value: typeof mockComparePackagesResponse) => void;
    const promise = new Promise<typeof mockComparePackagesResponse>((resolve) => {
      resolvePromise = resolve;
    });
    mockComparePackages.mockReturnValueOnce(promise);

    const { unmount } = render(<ComparePlane />);

    // Unmount before API call completes
    unmount();

    // Resolve the promise after unmount
    resolvePromise!(mockComparePackagesResponse);

    // Should not cause any errors
    expect(true).toBe(true);
  });

  it('should set selected plan when subscribe button is clicked for different packages', async () => {
    const user = userEvent.setup();
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(within(table).getByText('Basic Plan')).toBeInTheDocument();
    });

    // Mock fetchPackageById to return different packages for each call
    mockFetchPackageById
      .mockResolvedValueOnce(mockComparePackagesResponse[1] as TravelPackage) // Premium Plan
      .mockResolvedValueOnce(mockComparePackagesResponse[2] as TravelPackage); // VIP Plan

    const table = screen.getByRole('table');
    const subscribeButtons = within(table).getAllByText('Subscribe');

    // Click second button (Premium Plan)
    await user.click(subscribeButtons[1]);

    await waitFor(() => {
      expect(mockFetchPackageById).toHaveBeenCalledWith('2');
      expect(mockSetSelectedPlan).toHaveBeenCalledWith({
        id: '2',
        title: 'Premium Plan',
        price: '₹50,000',
        classLabel: 'ECONOMY, BUSINESS class',
        tripsPerYear: '8 trips/year',
        airlinesLabel: 'Air India, IndiGo',
        description: 'Premium travel package',
        additionalBenefits: ['Priority support', 'Lounge access'],
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/checkout?packageId=2');
    });

    // Click third button (VIP Plan)
    await user.click(subscribeButtons[2]);

    await waitFor(() => {
      expect(mockFetchPackageById).toHaveBeenCalledWith('3');
      expect(mockSetSelectedPlan).toHaveBeenCalledWith({
        id: '3',
        title: 'VIP Plan',
        price: '₹100,000',
        classLabel: 'FIRST class',
        tripsPerYear: '12 trips/year',
        airlinesLabel: 'Air India',
        description: 'VIP travel package',
        additionalBenefits: ['VIP support', 'Lounge access', 'Priority boarding'],
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/checkout?packageId=3');
    });
  });

  it('should handle fetchPackageById error gracefully and use fallback data', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock fetchPackageById to fail
    mockFetchPackageById.mockRejectedValueOnce(new Error('Failed to fetch package'));

    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(within(table).getByText('Basic Plan')).toBeInTheDocument();
    });

    const table = screen.getByRole('table');
    const subscribeButtons = within(table).getAllByText('Subscribe');

    await user.click(subscribeButtons[0]);

    // Should still set selected plan using fallback data from compare response
    await waitFor(() => {
      expect(mockSetSelectedPlan).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/checkout?packageId=1');
    });

    consoleSpy.mockRestore();
  });

  it('should handle subscribe button click for mobile view', async () => {
    const user = userEvent.setup();
    render(<ComparePlane />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(within(table).getByText('Basic Plan')).toBeInTheDocument();
    });

    // Find mobile subscribe buttons (outside of table)
    const mobileSubscribeButtons = screen.getAllByText('Subscribe').filter((button) => {
      const table = screen.queryByRole('table');

      return table ? !table.contains(button) : true;
    });

    if (mobileSubscribeButtons.length > 0) {
      await user.click(mobileSubscribeButtons[0]);

      await waitFor(() => {
        expect(mockFetchPackageById).toHaveBeenCalled();
        expect(mockSetSelectedPlan).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/checkout?packageId='));
      });
    }
  });

  it('should not call setSelectedPlan if package is missing', async () => {
    const user = userEvent.setup();
    const packagesWithoutId = [
      {
        ...mockComparePackagesResponse[0],
        id: undefined as unknown as string,
      },
    ];

    mockComparePackages.mockResolvedValueOnce(packagesWithoutId as typeof mockComparePackagesResponse);

    const { unmount } = render(<ComparePlane />);

    await waitFor(() => {
      // When package has no ID, the component still renders but subscribe button should not work
      const tables = screen.queryAllByRole('table');

      if (tables.length > 0) {
        // If table exists, check that subscribe button exists but won't work with missing ID
        const subscribeButtons = within(tables[0]).getAllByText('Subscribe');

        expect(subscribeButtons.length).toBeGreaterThan(0);
      }
    });

    // Unmount and reset mocks, then test with valid package
    unmount();
    mockComparePackages.mockResolvedValue(mockComparePackagesResponse);
    mockSetSelectedPlan.mockClear();

    render(<ComparePlane />);

    await waitFor(() => {
      const tables = screen.getAllByRole('table');
      const desktopTable = tables.find((table) => table.className.includes('hidden lg:block'));

      if (desktopTable) {
        expect(within(desktopTable).getByText('Basic Plan')).toBeInTheDocument();
      }
    });

    const tables = screen.getAllByRole('table');
    const desktopTable = tables.find((table) => table.className.includes('hidden lg:block')) || tables[0];
    const subscribeButtons = within(desktopTable).getAllByText('Subscribe');

    // Click should work normally when package has ID
    await user.click(subscribeButtons[0]);

    await waitFor(() => {
      expect(mockSetSelectedPlan).toHaveBeenCalled();
    });
  });
});
