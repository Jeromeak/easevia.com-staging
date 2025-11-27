import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionPlans } from '@/app/plans/components/SubscriptionPlans';
import { fetchPackages } from '@/lib/api/package';
import { mockTravelPackages } from '../__mocks__/planApi';
import { mockSubscriptionPlansProps } from '../__mocks__/planComponents';
import type { TravelPackage } from '@/lib/types/api/package';

// Mock the package API
jest.mock('@/lib/api/package', () => ({
  fetchPackages: jest.fn(),
}));

// Mock the language currency context
jest.mock('@/context/hooks/useLanguageCurrency', () => ({
  useLanguageCurrency: () => ({
    currency: { id: '1', code: 'INR', symbol: '₹' },
  }),
}));

// Mock the FilterPannel component
jest.mock('@/app/plans/components/FilterPannel', () => ({
  FilterPannel: ({
    onTravelClassChange,
    onAirlinesChange,
    onOriginChange,
    onDestinationChange,
  }: {
    onTravelClassChange: (value: string) => void;
    onAirlinesChange: (value: string) => void;
    onOriginChange: (value: string) => void;
    onDestinationChange: (value: string) => void;
  }) => (
    <div data-testid="filter-panel">
      <button onClick={() => onTravelClassChange('ECONOMY')}>Set Economy Class</button>
      <button onClick={() => onAirlinesChange('AI')}>Set Air India</button>
      <button onClick={() => onOriginChange('DEL')}>Set Delhi</button>
      <button onClick={() => onDestinationChange('BOM')}>Set Mumbai</button>
    </div>
  ),
}));

// Mock the PlanCard component
jest.mock('@/app/plans/components/PlanCard', () => ({
  PlanCard: ({
    packages,
    isLoading,
    setSelectedPlans,
    selectedPlans,
  }: {
    packages: TravelPackage[];
    isLoading: boolean;
    setSelectedPlans: (plans: string[]) => void;
    selectedPlans: string[];
  }) => (
    <div data-testid="plan-card">
      {isLoading ? (
        <div>Loading plans...</div>
      ) : (
        <div>
          {packages.map((pkg: TravelPackage) => (
            <div key={pkg.id} data-testid={`plan-${pkg.id}`}>
              {pkg.title}
              <button onClick={() => setSelectedPlans([...selectedPlans, pkg.id])}>Select Plan</button>
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

const mockFetchPackages = fetchPackages as jest.MockedFunction<typeof fetchPackages>;

describe('SubscriptionPlans Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', () => {
    mockFetchPackages.mockResolvedValueOnce(mockTravelPackages);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('plan-card')).toBeInTheDocument();
  });

  it('should fetch packages on mount', async () => {
    mockFetchPackages.mockResolvedValueOnce(mockTravelPackages);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledWith({
        currency_id: '1',
      });
    });
  });

  it('should show loading state initially', () => {
    mockFetchPackages.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    expect(screen.getByText('Loading plans...')).toBeInTheDocument();
  });

  it('should display packages when loaded', async () => {
    mockFetchPackages.mockResolvedValueOnce(mockTravelPackages);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('plan-1')).toBeInTheDocument();
      expect(screen.getByText('Premium Travel Plan')).toBeInTheDocument();
    });
  });

  it('should handle filter changes and refetch packages', async () => {
    const user = userEvent.setup();
    mockFetchPackages
      .mockResolvedValueOnce(mockTravelPackages) // Initial load
      .mockResolvedValueOnce(mockTravelPackages); // After filter change

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledTimes(1);
    });

    // Change travel class filter
    const economyButton = screen.getByText('Set Economy Class');
    await user.click(economyButton);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledTimes(2);
      expect(mockFetchPackages).toHaveBeenLastCalledWith({
        currency_id: '1',
        class_type: 'ECONOMY',
      });
    });
  });

  it('should handle airline filter changes', async () => {
    const user = userEvent.setup();
    mockFetchPackages.mockResolvedValueOnce(mockTravelPackages).mockResolvedValueOnce(mockTravelPackages);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledTimes(1);
    });

    const airlineButton = screen.getByText('Set Air India');
    await user.click(airlineButton);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledWith({
        currency_id: '1',
        airline: 'AI',
      });
    });
  });

  it('should handle origin and destination filter changes', async () => {
    const user = userEvent.setup();
    mockFetchPackages.mockResolvedValueOnce(mockTravelPackages).mockResolvedValueOnce(mockTravelPackages);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledTimes(1);
    });

    const originButton = screen.getByText('Set Delhi');
    await user.click(originButton);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledWith({
        currency_id: '1',
        origin: 'DEL',
      });
    });

    const destinationButton = screen.getByText('Set Mumbai');
    await user.click(destinationButton);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledWith({
        currency_id: '1',
        origin: 'DEL',
        destination: 'BOM',
      });
    });
  });

  it('should handle multiple filter combinations', async () => {
    const user = userEvent.setup();
    mockFetchPackages
      .mockResolvedValueOnce(mockTravelPackages)
      .mockResolvedValueOnce(mockTravelPackages)
      .mockResolvedValueOnce(mockTravelPackages);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledTimes(1);
    });

    // Set multiple filters
    await user.click(screen.getByText('Set Economy Class'));
    await user.click(screen.getByText('Set Air India'));
    await user.click(screen.getByText('Set Delhi'));

    await waitFor(() => {
      expect(mockFetchPackages).toHaveBeenCalledWith({
        currency_id: '1',
        class_type: 'ECONOMY',
        airline: 'AI',
        origin: 'DEL',
      });
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchPackages.mockRejectedValueOnce(new Error('API Error'));

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch packages:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should handle empty packages response', async () => {
    mockFetchPackages.mockResolvedValueOnce([]);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('plan-card')).toBeInTheDocument();
      expect(screen.queryByTestId('plan-1')).not.toBeInTheDocument();
    });
  });

  it('should pass selectedPlans to PlanCard', async () => {
    const selectedPlans = ['1', '2'];
    mockFetchPackages.mockResolvedValueOnce(mockTravelPackages);

    render(<SubscriptionPlans {...mockSubscriptionPlansProps} selectedPlans={selectedPlans} />);

    await waitFor(() => {
      expect(screen.getByTestId('plan-card')).toBeInTheDocument();
    });
  });

  it('should handle component unmount during API call', async () => {
    let resolvePromise: (value: TravelPackage[]) => void;
    const promise = new Promise<TravelPackage[]>((resolve) => {
      resolvePromise = resolve;
    });
    mockFetchPackages.mockReturnValueOnce(promise);

    const { unmount } = render(<SubscriptionPlans {...mockSubscriptionPlansProps} />);

    // Unmount before API call completes
    unmount();

    // Resolve the promise after unmount
    resolvePromise!(mockTravelPackages);

    // Should not cause any errors
    expect(true).toBe(true);
  });
});
