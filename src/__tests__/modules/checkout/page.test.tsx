import React from 'react';
import { render, screen } from '@testing-library/react';
import Checkout from '@/app/checkout/page';
import { useCheckout } from '@/context/hooks/useCheckout';
import { mockCheckoutContext } from './__mocks__/checkoutComponents';

// Mock Next.js components
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
  Payment: jest.fn(({ isSubmitted, setIsSubmitted }) => (
    <div data-testid="payment">
      <div>Submitted: {String(isSubmitted)}</div>
      <button onClick={() => setIsSubmitted(true)}>Set Submitted</button>
    </div>
  )),
}));

// Mock checkout context
jest.mock('@/context/hooks/useCheckout', () => ({
  useCheckout: jest.fn(),
}));

const mockUseCheckout = useCheckout as jest.MockedFunction<typeof useCheckout>;

describe('Checkout Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      clearPaymentError: jest.fn(),
      clearValidationErrors: jest.fn(),
    } as ReturnType<typeof useCheckout>);
  });

  it('should render all page components', () => {
    render(<Checkout />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('payment')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should display step 1/2 initially', () => {
    render(<Checkout />);

    expect(screen.getByText('Step: Step 1/2')).toBeInTheDocument();
  });

  it('should display step 2/2 when submitted', () => {
    const { rerender } = render(<Checkout />);

    const setSubmittedButton = screen.getByText('Set Submitted');
    setSubmittedButton.click();

    rerender(<Checkout />);

    expect(screen.getByText('Step: Step 2/2')).toBeInTheDocument();
  });

  it('should clear payment errors on mount', () => {
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
});
