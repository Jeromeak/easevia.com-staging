import React from 'react';
import { render, screen } from '@testing-library/react';
import { Payment } from '@/app/checkout/components/Payment';

// Mock child components
jest.mock('@/app/checkout/components/PaymentProcess', () => ({
  PaymentProcess: jest.fn(({ isSubmitted, setIsSubmitted }) => (
    <div data-testid="payment-process">
      <div>Payment Process</div>
      <div>Submitted: {String(isSubmitted)}</div>
      <button onClick={() => setIsSubmitted(true)}>Set Submitted</button>
    </div>
  )),
}));

jest.mock('@/app/checkout/components/OrderSummary', () => ({
  OrderSummary: jest.fn(() => <div data-testid="order-summary">Order Summary</div>),
}));

jest.mock('@/app/checkout/components/BillingAddress', () => ({
  BillingAddress: jest.fn(() => <div data-testid="billing-address">Billing Address</div>),
}));

describe('Payment Component', () => {
  it('should render all child components', () => {
    const setIsSubmitted = jest.fn();
    render(<Payment isSubmitted={false} setIsSubmitted={setIsSubmitted} />);

    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    expect(screen.getByTestId('billing-address')).toBeInTheDocument();
    expect(screen.getByTestId('payment-process')).toBeInTheDocument();
  });

  it('should pass isSubmitted prop to PaymentProcess', () => {
    const setIsSubmitted = jest.fn();
    render(<Payment isSubmitted={true} setIsSubmitted={setIsSubmitted} />);

    expect(screen.getByText('Submitted: true')).toBeInTheDocument();
  });

  it('should pass setIsSubmitted prop to PaymentProcess', () => {
    const setIsSubmitted = jest.fn();
    render(<Payment isSubmitted={false} setIsSubmitted={setIsSubmitted} />);

    const setSubmittedButton = screen.getByText('Set Submitted');
    setSubmittedButton.click();

    expect(setIsSubmitted).toHaveBeenCalledWith(true);
  });

  it('should render with correct layout structure', () => {
    const setIsSubmitted = jest.fn();
    const { container } = render(<Payment isSubmitted={false} setIsSubmitted={setIsSubmitted} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
