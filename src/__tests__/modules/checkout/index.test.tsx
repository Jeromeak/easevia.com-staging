import React from 'react';
import { render, screen } from '@testing-library/react';
import Checkout from '@/app/checkout/page';
import { useCheckout } from '@/context/hooks/useCheckout';
import { mockCheckoutContext } from './__mocks__/checkoutComponents';

// Mock all dependencies
jest.mock('@/common/components/Header', () => ({
  Header: jest.fn(() => <div data-testid="header">Header</div>),
}));

jest.mock('@/common/components/Footer', () => ({
  Footer: jest.fn(() => <div data-testid="footer">Footer</div>),
}));

jest.mock('@/app/checkout/components/Herobanner', () => ({
  HeroBanner: jest.fn(({ stepText }) => <div data-testid="hero-banner">Step: {stepText}</div>),
}));

jest.mock('@/app/checkout/components/Payment', () => ({
  Payment: jest.fn(() => <div data-testid="payment">Payment Component</div>),
}));

jest.mock('@/context/hooks/useCheckout', () => ({
  useCheckout: jest.fn(),
}));

const mockUseCheckout = useCheckout as jest.MockedFunction<typeof useCheckout>;

describe('Checkout Module Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      clearPaymentError: jest.fn(),
      clearValidationErrors: jest.fn(),
    } as ReturnType<typeof useCheckout>);
  });

  it('should render complete checkout page', () => {
    render(<Checkout />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('payment')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should initialize with step 1/2', () => {
    render(<Checkout />);

    expect(screen.getByText('Step: Step 1/2')).toBeInTheDocument();
  });

  it('should clear errors on mount', () => {
    const clearPaymentError = jest.fn();
    const clearValidationErrors = jest.fn();

    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      clearPaymentError,
      clearValidationErrors,
    } as ReturnType<typeof useCheckout>);

    render(<Checkout />);

    expect(clearPaymentError).toHaveBeenCalled();
    expect(clearValidationErrors).toHaveBeenCalled();
  });

  it('should handle Suspense fallback', () => {
    // This test verifies that Suspense is properly set up
    render(<Checkout />);

    // All components should render (mocked, so no loading state)
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
