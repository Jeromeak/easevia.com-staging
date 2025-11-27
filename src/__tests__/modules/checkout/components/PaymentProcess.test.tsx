import type React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { PaymentProcess, navigateOnCancel } from '@/app/checkout/components/PaymentProcess';
import type { Stripe } from '@stripe/stripe-js';
import type {
  CreatePaymentIntentResponse,
  PaymentStatusResponse,
  CreatePaymentIntentRequest,
} from '@/lib/types/api/payment';
import { AuthContext } from '@/context/contexts/AuthContext';
import { CheckoutContext } from '@/context/contexts/CheckoutContext';
import type { CheckoutContextType } from '@/context/checkout.types';
import {
  mockCheckoutState,
  mockCheckoutStateWithCard,
  mockCheckoutContext,
  mockRouter,
} from '../__mocks__/checkoutComponents';
import { mockCreatePaymentIntentResponse, mockPaymentStatusResponse } from '../__mocks__/checkoutApi';
import {
  mockStripe,
  mockElements,
  mockCardElement,
  mockPaymentElement,
  mockPaymentMethod,
  mockPaymentIntent,
  mockStripeError,
} from '../__mocks__/stripeMocks';
import { PaymentMethod, PaymentStatus } from '@/context/checkout.types';

// Mock Next.js navigation
const mockUseSearchParamsFn = jest.fn(() => ({
  get: jest.fn((key: string) => {
    const params: Record<string, string | null> = {
      packageId: 'rgRqJ5Y0V4',
    };

    return params[key] || null;
  }),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockUseSearchParamsFn(),
}));

// Mock payment API
const mockCreatePaymentIntentFn = jest.fn() as jest.MockedFunction<
  (packageId: string, data: CreatePaymentIntentRequest) => Promise<CreatePaymentIntentResponse>
>;
const mockGetPaymentStatusFn = jest.fn() as jest.MockedFunction<(paymentId: string) => Promise<PaymentStatusResponse>>;
jest.mock('@/lib/api/payment', () => ({
  createPaymentIntent: (packageId: string, data: CreatePaymentIntentRequest) =>
    mockCreatePaymentIntentFn(packageId, data),
  getPaymentStatus: (paymentId: string) => mockGetPaymentStatusFn(paymentId),
}));

// Mock Stripe
const mockLoadStripeFn = jest.fn();
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: mockLoadStripeFn,
}));

// Mock Stripe React
const mockUseStripeFn = jest.fn();
const mockUseElementsFn = jest.fn();
jest.mock('@stripe/react-stripe-js', () => {
  return {
    Elements: ({ children, options }: { children: React.ReactNode; options: { clientSecret: string } }) => (
      <div data-testid="stripe-elements" data-client-secret={options.clientSecret}>
        {children}
      </div>
    ),
    CardElement: () => <div data-testid="card-element">Card Element</div>,
    PaymentElement: () => <div data-testid="payment-element">Payment Element</div>,
    useStripe: () => mockUseStripeFn(),
    useElements: () => mockUseElementsFn(),
  };
});

// Mock icons
jest.mock('@/icons/icon', () => ({
  ArrowLeft: ({ className }: { className?: string }) => <svg data-testid="arrow-left" className={className} />,
  CardIcon: () => <svg data-testid="card-icon" />,
}));

const createMockAuthContextValue = () => ({
  user: {
    id: 123,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+919876543210',
    customer_id: 'CUST123',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    is_verified: true,
    auth_provider: 'email',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  logout: jest.fn(),
  setUser: jest.fn(),
  accessToken: 'mock-access-token',
});

const createMockCheckoutContextValue = (overrides?: Partial<CheckoutContextType>): CheckoutContextType => {
  const mergedState = {
    ...mockCheckoutContext.state,
    ...(overrides?.state ?? {}),
  };

  return {
    ...mockCheckoutContext,
    ...overrides,
    state: {
      ...mergedState,
      paymentDetails: {
        ...mockCheckoutContext.state.paymentDetails,
        ...(overrides?.state?.paymentDetails ?? {}),
      },
    },
  };
};

const renderWithContexts = (
  ui: React.ReactElement,
  {
    authValue = createMockAuthContextValue(),
    checkoutValue = createMockCheckoutContextValue(),
  }: {
    authValue?: ReturnType<typeof createMockAuthContextValue>;
    checkoutValue?: CheckoutContextType;
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={authValue}>
      <CheckoutContext.Provider value={checkoutValue}>{children}</CheckoutContext.Provider>
    </AuthContext.Provider>
  );

  return render(ui, { wrapper: Wrapper });
};

// Use the mock functions directly
const mockCreatePaymentIntent = mockCreatePaymentIntentFn as jest.MockedFunction<typeof mockCreatePaymentIntentFn>;
const mockGetPaymentStatus = mockGetPaymentStatusFn as jest.MockedFunction<typeof mockGetPaymentStatusFn>;
const mockUseStripe = mockUseStripeFn as jest.MockedFunction<typeof mockUseStripeFn>;
const mockUseElements = mockUseElementsFn as jest.MockedFunction<typeof mockUseElementsFn>;
const mockUseSearchParams = mockUseSearchParamsFn as jest.MockedFunction<typeof mockUseSearchParamsFn>;

describe('PaymentProcess Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.back.mockReset();
    mockRouter.push.mockReset();
    (mockLoadStripeFn as unknown as jest.Mock<() => Promise<Stripe | null>>).mockResolvedValue(
      mockStripe as unknown as Stripe
    );
    mockUseStripe.mockReturnValue(mockStripe as unknown as Stripe);
    mockUseElements.mockReturnValue(mockElements as unknown as ReturnType<typeof mockUseElementsFn>);
    mockElements.getElement.mockImplementation((type: string) => {
      if (type === 'card') return mockCardElement;
      if (type === 'payment') return mockPaymentElement;

      return null;
    });
    mockCreatePaymentIntent.mockResolvedValue(mockCreatePaymentIntentResponse);
    mockGetPaymentStatus.mockResolvedValue(mockPaymentStatusResponse);
  });

  describe('Initial Render', () => {
    it('should render payment section', () => {
      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />);

      expect(screen.getByText('Payment')).toBeInTheDocument();
      expect(screen.getByText('Payment method')).toBeInTheDocument();
    });

    it('should render card tab', () => {
      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />);

      // Tabs are rendered but text might be hidden on mobile, so check by button label
      const cardTab = screen.getByRole('button', { name: /card/i });

      expect(cardTab).toBeInTheDocument();
    });

    it('should show "Please select a payment method" when no method selected', () => {
      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />);

      expect(screen.getByText('Please select a payment method')).toBeInTheDocument();
    });
  });

  describe.skip('Card Payment Flow', () => {
    it('should create payment intent when card tab is clicked', async () => {
      const user = userEvent.setup();
      mockCreatePaymentIntent.mockResolvedValueOnce(mockCreatePaymentIntentResponse);

      const setClientSecret = jest.fn();
      const setPaymentMethod = jest.fn();

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutState,
        setClientSecret,
        setPaymentMethod,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      const cardTab = screen.getByRole('button', { name: /card/i });
      await user.click(cardTab);

      await waitFor(() => {
        expect(mockCreatePaymentIntent).toHaveBeenCalledWith('rgRqJ5Y0V4', {
          payment_method: 'card',
        });
      });

      await waitFor(() => {
        expect(setClientSecret).toHaveBeenCalledWith(mockCreatePaymentIntentResponse.client_secret);
        expect(setPaymentMethod).toHaveBeenCalledWith(PaymentMethod.CARD);
      });
    });

    it('should render Stripe card form when client secret is available', async () => {
      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
      });
      expect(checkoutValue.state.paymentDetails?.paymentMethod).toBe(PaymentMethod.CARD);
      expect(checkoutValue.state.paymentDetails?.clientSecret).toContain('_secret_');

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      expect(await screen.findByTestId('stripe-elements')).toBeInTheDocument();
    });

    it('should handle successful card payment', async () => {
      const user = userEvent.setup();
      const setTransactionId = jest.fn();
      const setPaymentStatus = jest.fn();
      const setIsSubmitted = jest.fn();

      mockStripe.createPaymentMethod.mockResolvedValueOnce({
        paymentMethod: mockPaymentMethod,
        error: null,
      });
      mockStripe.confirmCardPayment.mockResolvedValueOnce({
        paymentIntent: mockPaymentIntent,
        error: null,
      });

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
        setTransactionId,
        setPaymentStatus,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={setIsSubmitted} />, {
        checkoutValue,
      });

      // Find and click submit button (button text is "Subscribe")
      const submitButton = (await screen.findByRole('button', { name: /subscribe/i })) as HTMLButtonElement;

      if (!submitButton.disabled) {
        await user.click(submitButton);
      }

      await waitFor(() => {
        expect(mockStripe.createPaymentMethod).toHaveBeenCalled();
        expect(mockStripe.confirmCardPayment).toHaveBeenCalled();
        expect(setTransactionId).toHaveBeenCalledWith(mockPaymentIntent.id);
        expect(setPaymentStatus).toHaveBeenCalledWith(PaymentStatus.SUCCESS);
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/success');
    });

    it('should handle card payment error', async () => {
      const user = userEvent.setup();
      const setPaymentError = jest.fn();

      mockStripe.createPaymentMethod.mockResolvedValueOnce({
        paymentMethod: null,
        error: mockStripeError,
      });

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
        setPaymentError,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      const submitButton = (await screen.findByRole('button', { name: /subscribe/i })) as HTMLButtonElement;

      if (!submitButton.disabled) {
        await user.click(submitButton);
      }

      await waitFor(() => {
        expect(setPaymentError).toHaveBeenCalled();
      });
    });

    it('should handle card payment confirmation error', async () => {
      const user = userEvent.setup();
      const setPaymentError = jest.fn();

      mockStripe.createPaymentMethod.mockResolvedValueOnce({
        paymentMethod: mockPaymentMethod,
        error: null,
      });
      mockStripe.confirmCardPayment.mockResolvedValueOnce({
        paymentIntent: null,
        error: mockStripeError,
      });

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
        setPaymentError,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      const submitButton = (await screen.findByRole('button', { name: /subscribe/i })) as HTMLButtonElement;

      if (!submitButton.disabled) {
        await user.click(submitButton);
      }

      await waitFor(() => {
        expect(setPaymentError).toHaveBeenCalled();
      });
    });

    it('should disable submit button when address is not complete', async () => {
      const checkoutValue = createMockCheckoutContextValue({
        state: {
          ...mockCheckoutStateWithCard,
          isAddressComplete: false,
        },
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      const submitButton = (await screen.findByRole('button', { name: /subscribe/i })) as HTMLButtonElement;

      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when address is not validated', async () => {
      const checkoutValue = createMockCheckoutContextValue({
        state: {
          ...mockCheckoutStateWithCard,
          isAddressValidated: false,
        },
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      const submitButton = screen.getByRole('button', { name: /subscribe/i }) as HTMLButtonElement;

      if (submitButton) {
        expect(submitButton).toBeDisabled();
      }
    });
  });

  describe('navigateOnCancel helper', () => {
    it('navigates back when history length is greater than 1', () => {
      const routerMock = {
        ...mockRouter,
        back: jest.fn(),
        push: jest.fn(),
      };

      navigateOnCancel(routerMock, 3);

      expect(routerMock.back).toHaveBeenCalledTimes(1);
      expect(routerMock.push).not.toHaveBeenCalled();
    });

    it('redirects to /plans when no history is available', () => {
      const routerMock = {
        ...mockRouter,
        back: jest.fn(),
        push: jest.fn(),
      };

      navigateOnCancel(routerMock, 1);

      expect(routerMock.back).not.toHaveBeenCalled();
      expect(routerMock.push).toHaveBeenCalledWith('/plans');
    });
  });

  describe('Cancel button interactions', () => {
    it('renders cancel button when card payment is active', async () => {
      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      expect(await screen.findByTestId('payment-cancel-button')).toBeInTheDocument();
    });

    it('does not render cancel button when no payment method is selected', () => {
      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />);

      expect(screen.queryByTestId('payment-cancel-button')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle payment intent creation error', async () => {
      const user = userEvent.setup();
      const setPaymentError = jest.fn();

      mockCreatePaymentIntent.mockRejectedValueOnce(new Error('Failed to create payment intent'));

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutState,
        setPaymentError,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      const cardTab = screen.getByRole('button', { name: /card/i });
      await user.click(cardTab);

      await waitFor(() => {
        expect(setPaymentError).toHaveBeenCalled();
      });
    });

    it('should display payment error message', () => {
      const checkoutValue = createMockCheckoutContextValue({
        state: {
          ...mockCheckoutStateWithCard,
          validationErrors: ['Payment failed. Please try again.'],
        },
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });

  describe.skip('Edge Cases', () => {
    it('should handle missing package ID', () => {
      mockUseSearchParams.mockReturnValueOnce({
        get: jest.fn(() => null),
      } as unknown as ReturnType<typeof mockUseSearchParamsFn>);

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutState,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      expect(screen.getByText('Please select a payment method')).toBeInTheDocument();
    });

    it('should handle missing Stripe instance', () => {
      mockUseStripe.mockReturnValueOnce(null);

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      // Component should still render but payment won't work
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });

    it('should handle missing Elements instance', () => {
      mockUseElements.mockReturnValueOnce(null);

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });

    it('should handle invalid client secret format', () => {
      const checkoutValue = createMockCheckoutContextValue({
        state: {
          ...mockCheckoutStateWithCard,
          paymentDetails: {
            ...mockCheckoutStateWithCard.paymentDetails,
            clientSecret: 'invalid_secret',
          },
        },
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      expect(screen.getByText(/click card tab to initialize payment/i)).toBeInTheDocument();
    });

    it('should handle payment intent without ID', async () => {
      const user = userEvent.setup();

      mockStripe.createPaymentMethod.mockResolvedValueOnce({
        paymentMethod: mockPaymentMethod,
        error: null,
      });
      mockStripe.confirmCardPayment.mockResolvedValueOnce({
        paymentIntent: {
          ...mockPaymentIntent,
          id: undefined as unknown as string,
        },
        error: null,
      });

      const checkoutValue = createMockCheckoutContextValue({
        state: mockCheckoutStateWithCard,
      });

      renderWithContexts(<PaymentProcess isSubmitted={false} setIsSubmitted={jest.fn()} />, {
        checkoutValue,
      });

      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /subscribe/i }) as HTMLButtonElement;

      if (!submitButton.disabled) {
        await user.click(submitButton);
      }

      // Error message should appear in the card error display (cardError state)
      await waitFor(
        () => {
          expect(
            screen.getByText(/payment successful but transaction id not received|an unexpected error occurred/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
