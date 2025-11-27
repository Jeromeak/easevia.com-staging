import type { SelectedPlan } from '@/context/checkout.types';
import { PaymentMethod, PaymentStatus } from '@/context/checkout.types';

// Mock selected plan
export const mockSelectedPlan: SelectedPlan = {
  id: 'rgRqJ5Y0V4',
  title: 'Premium Plan',
  price: '₹50,000',
  classLabel: 'ECONOMY, BUSINESS class',
  tripsPerYear: '8 trips/year',
  airlinesLabel: 'Air India, IndiGo',
  description: 'Premium travel package with luxury amenities',
  additionalBenefits: ['Priority support', 'Lounge access'],
};

// Mock checkout state
export const mockCheckoutState = {
  selectedPlan: mockSelectedPlan,
  isAddressComplete: true,
  isAddressValidated: true,
  validationErrors: [],
  isLoading: false,
  paymentDetails: {
    paymentMethod: null,
    paymentStatus: PaymentStatus.PENDING,
  },
};

// Mock checkout state with card payment
export const mockCheckoutStateWithCard = {
  ...mockCheckoutState,
  paymentDetails: {
    paymentMethod: PaymentMethod.CARD,
    paymentStatus: PaymentStatus.PENDING,
    clientSecret: 'pi_test_1234567890_secret_abcdefghijklmnopqrstuvwxyz',
  },
};

// Mock checkout state with bank transfer
export const mockCheckoutStateWithBank = {
  ...mockCheckoutState,
  paymentDetails: {
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentStatus: PaymentStatus.PENDING,
    clientSecret: 'pi_test_bank_1234567890_secret_abcdefghijklmnopqrstuvwxyz',
  },
};

// Mock checkout context functions
export const mockCheckoutContext = {
  state: mockCheckoutState,
  setSelectedPlan: jest.fn(),
  setAddressComplete: jest.fn(),
  setAddressValidated: jest.fn(),
  addValidationError: jest.fn(),
  clearValidationErrors: jest.fn(),
  setLoading: jest.fn(),
  resetCheckout: jest.fn(),
  setPaymentMethod: jest.fn(),
  setPaymentStatus: jest.fn(),
  setTransactionId: jest.fn(),
  setClientSecret: jest.fn(),
  setPaymentError: jest.fn(),
  clearPaymentError: jest.fn(),
  resetPayment: jest.fn(),
  initiateBankTransfer: jest.fn(),
  clearCheckoutData: jest.fn(),
};

// Mock user data
export const mockUser = {
  id: 'user_123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+919876543210',
  customer_id: 'CUST123',
  address: '123 Main Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  pincode: '400001',
};

// Mock router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
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

// Mock search params
export const mockSearchParams = {
  get: jest.fn((key: string) => {
    const params: Record<string, string | null> = {
      packageId: 'rgRqJ5Y0V4',
    };

    return params[key] || null;
  }),
};
