import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrderSummary } from '@/app/checkout/components/OrderSummary';
import { useCheckout } from '@/context/hooks/useCheckout';
import { mockCheckoutState, mockCheckoutContext } from '../__mocks__/checkoutComponents';

// Mock the checkout context
jest.mock('@/context/hooks/useCheckout', () => ({
  useCheckout: jest.fn(),
}));

// Mock icons
jest.mock('@/icons/icon', () => ({
  ThunderIcon: ({ id }: { id?: string }) => <svg data-testid={id || 'thunder-icon'} />,
}));

const mockUseCheckout = useCheckout as jest.MockedFunction<typeof useCheckout>;

describe('OrderSummary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render "No plan selected" when no plan is selected', () => {
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      state: {
        ...mockCheckoutState,
        selectedPlan: null,
      },
    } as ReturnType<typeof useCheckout>);

    render(<OrderSummary />);

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('No plan selected')).toBeInTheDocument();
  });

  it('should render order summary with selected plan', () => {
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      state: mockCheckoutState,
    } as ReturnType<typeof useCheckout>);

    render(<OrderSummary />);

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Premium Plan')).toBeInTheDocument();
    expect(screen.getByText('ECONOMY, BUSINESS class')).toBeInTheDocument();
    // Price appears multiple times, so use getAllByText
    expect(screen.getAllByText('₹50,000').length).toBeGreaterThan(0);
    expect(screen.getByText('/ 1 Year')).toBeInTheDocument();
    expect(screen.getByText('Subscription plan')).toBeInTheDocument();
    expect(screen.getByText('Platform basic')).toBeInTheDocument();
    expect(screen.getByText('Billed yearly')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('should display plan title correctly', () => {
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      state: mockCheckoutState,
    } as ReturnType<typeof useCheckout>);

    render(<OrderSummary />);

    const planTitle = screen.getByText('Premium Plan');
    expect(planTitle).toBeInTheDocument();
    expect(planTitle).toHaveClass('font-Neutra', 'text-41');
  });

  it('should display class label badge', () => {
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      state: mockCheckoutState,
    } as ReturnType<typeof useCheckout>);

    render(<OrderSummary />);

    const classBadge = screen.getByText('ECONOMY, BUSINESS class');
    expect(classBadge).toBeInTheDocument();
    expect(classBadge).toHaveClass('bg-orange-200');
  });

  it('should display price correctly', () => {
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      state: mockCheckoutState,
    } as ReturnType<typeof useCheckout>);

    render(<OrderSummary />);

    const prices = screen.getAllByText('₹50,000');
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach((price) => {
      expect(price).toBeInTheDocument();
    });
  });

  it('should display VAT information', () => {
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      state: mockCheckoutState,
    } as ReturnType<typeof useCheckout>);

    render(<OrderSummary />);

    expect(screen.getByText('Excl. 5% VAT')).toBeInTheDocument();
  });

  it('should render thunder icon', () => {
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      state: mockCheckoutState,
    } as ReturnType<typeof useCheckout>);

    render(<OrderSummary />);

    expect(screen.getByTestId('thunder-icon')).toBeInTheDocument();
  });
});
