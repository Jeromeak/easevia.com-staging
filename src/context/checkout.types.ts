export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface SelectedPlan {
  id: string;
  title: string;
  price: string;
  classLabel: string;
  tripsPerYear: string;
  airlinesLabel: string;
  description: string;
  additionalBenefits: string[];
}

export interface PaymentDetails {
  transactionId?: string;
  paymentMethod: PaymentMethod | null;
  paymentStatus: PaymentStatus;
  clientSecret?: string;
  errorMessage?: string;
  timestamp?: Date;
}

export interface CheckoutState {
  selectedPlan: SelectedPlan | null;
  isAddressComplete: boolean;
  isAddressValidated: boolean;
  validationErrors: string[];
  isLoading: boolean;
  paymentDetails: PaymentDetails;
}

export interface CheckoutContextType {
  state: CheckoutState;
  setSelectedPlan: (plan: SelectedPlan | null) => void;
  setAddressComplete: (complete: boolean) => void;
  setAddressValidated: (validated: boolean) => void;
  addValidationError: (error: string) => void;
  clearValidationErrors: () => void;
  setLoading: (loading: boolean) => void;
  resetCheckout: () => void;
  // Payment methods
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setTransactionId: (id: string) => void;
  setClientSecret: (secret: string) => void;
  setPaymentError: (error: string) => void;
  clearPaymentError: () => void;
  resetPayment: () => void;
  initiateBankTransfer: () => void;
  clearCheckoutData: () => void;
}

export const initialState: CheckoutState = {
  selectedPlan: null,
  isAddressComplete: false,
  isAddressValidated: false,
  validationErrors: [],
  isLoading: false,
  paymentDetails: {
    paymentMethod: null,
    paymentStatus: PaymentStatus.PENDING,
  },
};
