import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlanCard } from '@/app/plans/components/PlanCard';
import { mockTravelPackages, mockTravelPackage } from '../__mocks__/planApi';
import { mockPlanCardProps } from '../__mocks__/planComponents';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/hooks/useCheckout';
import type { TravelPackage } from '@/lib/types/api/package';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
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
  })),
}));

// Mock GSAP
jest.mock('gsap', () => {
  const mockGsap = {
    set: jest.fn(),
    fromTo: jest.fn(),
    to: jest.fn(),
    registerPlugin: jest.fn(),
  };

  return mockGsap;
});

jest.mock('gsap/ScrollTrigger', () => ({
  default: {
    create: jest.fn(),
  },
}));

// Mock the checkout context
jest.mock('@/context/hooks/useCheckout', () => ({
  useCheckout: jest.fn(() => ({
    setSelectedPlan: jest.fn(),
  })),
}));

// Mock the plan view model service
jest.mock('@/services/planViewModel', () => ({
  toPlanViewModel: (plan: TravelPackage) => ({
    id: plan.id,
    title: plan.title,
    price: plan.price,
    classLabel: plan.classes?.[0]?.name || 'ECONOMY',
    tripsPerYear: `${plan.trip_count} trips/year`,
    airlinesLabel: plan.airlines?.map((a) => a.business_name || a.common_name).join(', ') || 'N/A',
    description: plan.description || '',
    additionalBenefits: plan.additional_benefits || [],
    isActive: true,
    isPopularBadge: false,
  }),
}));

// Mock the CustomCheckbox component
jest.mock('@/common/components/CustomCheckBox', () => ({
  CustomCheckbox: ({
    children,
    checked,
    onChange,
    disabled,
  }: {
    children: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        data-testid="custom-checkbox"
      />
      {children}
    </label>
  ),
}));

// Mock the PlansButton component
jest.mock('@/app/plans/components/PlansButton', () => ({
  PlansButton: ({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={className}
      data-testid={`plans-button-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {label}
    </button>
  ),
}));

// Mock the FilterPannel component
jest.mock('@/app/plans/components/FilterPannel', () => ({
  FilterPannel: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="filter-panel">
      <button onClick={onClose}>Close Filter</button>
    </div>
  ),
}));

// Mock the PlanCardSkeleton component
jest.mock('@/app/plans/components/PlanCradSkeleton', () => ({
  PlanCardSkeleton: () => <div data-testid="plan-card-skeleton">Loading...</div>,
}));

describe('PlanCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', () => {
    render(<PlanCard {...mockPlanCardProps} packages={mockTravelPackages} />);

    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Premium Travel Plan')).toBeInTheDocument();
    expect(screen.getByText('Standard Travel Plan')).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    render(<PlanCard {...mockPlanCardProps} isLoading={true} />);

    expect(screen.getAllByTestId('plan-card-skeleton')).toHaveLength(5); // Default limit
  });

  it('should show loading state with custom limit', () => {
    render(<PlanCard {...mockPlanCardProps} isLoading={true} limit={3} />);

    expect(screen.getAllByTestId('plan-card-skeleton')).toHaveLength(3);
  });

  it('should display packages when loaded', () => {
    render(<PlanCard {...mockPlanCardProps} packages={mockTravelPackages} />);

    expect(screen.getByText('Premium Travel Plan')).toBeInTheDocument();
    expect(screen.getByText('Standard Travel Plan')).toBeInTheDocument();
    expect(screen.getByText('₹50,000')).toBeInTheDocument();
    expect(screen.getByText('₹25,000')).toBeInTheDocument();
  });

  it('should render no cards when packages array is empty', () => {
    render(<PlanCard {...mockPlanCardProps} packages={[]} />);

    // No plan titles should appear
    expect(screen.queryByText('Premium Travel Plan')).not.toBeInTheDocument();
    expect(screen.queryByText('Standard Travel Plan')).not.toBeInTheDocument();
  });

  it('should handle checkbox selection', async () => {
    const user = userEvent.setup();
    const setSelectedPlans = jest.fn();

    render(
      <PlanCard
        {...mockPlanCardProps}
        packages={[mockTravelPackage]}
        setSelectedPlans={setSelectedPlans}
        selectedPlans={[]}
      />
    );

    const checkbox = screen.getByTestId('custom-checkbox');
    await user.click(checkbox);

    expect(setSelectedPlans).toHaveBeenCalledWith(['1']);
  });

  it('should handle checkbox deselection', async () => {
    const user = userEvent.setup();
    const setSelectedPlans = jest.fn();

    render(
      <PlanCard
        {...mockPlanCardProps}
        packages={[mockTravelPackage]}
        setSelectedPlans={setSelectedPlans}
        selectedPlans={['1']}
      />
    );

    const checkbox = screen.getByTestId('custom-checkbox');
    await user.click(checkbox);

    expect(setSelectedPlans).toHaveBeenCalledWith([]);
  });

  it('should disable checkbox when max selections reached', () => {
    render(
      <PlanCard
        {...mockPlanCardProps}
        packages={[mockTravelPackage]}
        selectedPlans={['2', '3', '4']} // Max 3 selections
      />
    );

    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should not disable checkbox for already selected plans when max reached', () => {
    render(
      <PlanCard
        {...mockPlanCardProps}
        packages={[mockTravelPackage]}
        selectedPlans={['1', '2', '3']} // Max 3 selections, but plan 1 is selected
      />
    );

    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).not.toBeDisabled();
  });

  it('should handle plan details button click', async () => {
    const user = userEvent.setup();
    const mockPush = jest.fn();

    // Mock useRouter with a different approach
    const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);

    render(<PlanCard {...mockPlanCardProps} packages={[mockTravelPackage]} />);

    const detailsButton = screen.getByText('Plan Details');
    await user.click(detailsButton);

    expect(mockPush).toHaveBeenCalledWith('/details/1');
  });

  it('should handle subscribe button click', async () => {
    const user = userEvent.setup();
    const mockPush = jest.fn();
    const mockSetSelectedPlan = jest.fn();

    // Mock useRouter and useCheckout with a different approach
    const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
    const mockUseCheckout = useCheckout as jest.MockedFunction<typeof useCheckout>;

    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);

    mockUseCheckout.mockReturnValue({
      setSelectedPlan: mockSetSelectedPlan,
    } as unknown as ReturnType<typeof useCheckout>);

    render(<PlanCard {...mockPlanCardProps} packages={[mockTravelPackage]} />);

    const subscribeButton = screen.getByText('Subscribe');
    await user.click(subscribeButton);

    expect(mockSetSelectedPlan).toHaveBeenCalledWith({
      id: '1',
      title: 'Premium Travel Plan',
      price: '₹50,000',
      classLabel: 'ECONOMY',
      tripsPerYear: '12 trips/year',
      airlinesLabel: 'Air India',
      description: 'Premium travel package with luxury amenities',
      additionalBenefits: ['Priority boarding', 'Extra baggage allowance', 'Lounge access', '24/7 customer support'],
    });
    expect(mockPush).toHaveBeenCalledWith('/checkout?packageId=1');
  });

  it('should toggle filter panel on mobile', async () => {
    const user = userEvent.setup();

    render(<PlanCard {...mockPlanCardProps} packages={mockTravelPackages} />);

    const filterButton = screen.getByText('Filter');
    await user.click(filterButton);

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
  });

  it('should close filter panel', async () => {
    const user = userEvent.setup();

    render(<PlanCard {...mockPlanCardProps} packages={mockTravelPackages} />);

    // Open filter panel
    const filterButton = screen.getByText('Filter');
    await user.click(filterButton);

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();

    // Close filter panel
    const closeButton = screen.getByText('Close Filter');
    await user.click(closeButton);

    // Filter panel should be closed (not in document)
    expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
  });

  it('should deduplicate packages with same ID', () => {
    const duplicatePackages = [mockTravelPackage, { ...mockTravelPackage, id: '1' }];

    render(<PlanCard {...mockPlanCardProps} packages={duplicatePackages} />);

    // Should only show one plan with ID '1'
    expect(screen.getAllByText('Premium Travel Plan')).toHaveLength(1);
  });

  it('should handle packages with undefined ID', () => {
    const packagesWithUndefinedId = [{ ...mockTravelPackage, id: undefined as unknown as string }];

    render(<PlanCard {...mockPlanCardProps} packages={packagesWithUndefinedId} />);

    // Should still render the plan
    expect(screen.getByText('Premium Travel Plan')).toBeInTheDocument();
  });

  it('should handle external loading state changes', async () => {
    const { rerender } = render(<PlanCard {...mockPlanCardProps} isLoading={true} />);

    expect(screen.getAllByTestId('plan-card-skeleton')).toHaveLength(5);

    // Change to not loading
    rerender(<PlanCard {...mockPlanCardProps} isLoading={false} packages={mockTravelPackages} />);

    await waitFor(() => {
      expect(screen.queryByTestId('plan-card-skeleton')).not.toBeInTheDocument();
      expect(screen.getByText('Premium Travel Plan')).toBeInTheDocument();
    });
  });

  it('should handle undefined packages prop by rendering no cards', () => {
    render(<PlanCard {...mockPlanCardProps} packages={undefined as unknown as TravelPackage[]} />);

    expect(screen.queryByText('Premium Travel Plan')).not.toBeInTheDocument();
  });

  it('should handle non-array packages prop by rendering no cards', () => {
    render(<PlanCard {...mockPlanCardProps} packages={null as unknown as TravelPackage[]} />);

    expect(screen.queryByText('Premium Travel Plan')).not.toBeInTheDocument();
  });
});
