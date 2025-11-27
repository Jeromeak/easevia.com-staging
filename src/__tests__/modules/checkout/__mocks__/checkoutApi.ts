import type {
  CreatePaymentIntentResponse,
  PaymentStatusResponse,
  ConfirmPaymentResponse,
} from '@/lib/types/api/payment';

// Mock payment API responses
export const mockCreatePaymentIntentResponse: CreatePaymentIntentResponse = {
  client_secret: 'pi_test_1234567890_secret_abcdefghijklmnopqrstuvwxyz',
  payment_intent_id: 'pi_test_1234567890',
  status: 'success',
  message: 'Payment intent created successfully',
};

export const mockCreatePaymentIntentResponseBank: CreatePaymentIntentResponse = {
  client_secret: 'pi_test_bank_1234567890_secret_abcdefghijklmnopqrstuvwxyz',
  payment_intent_id: 'pi_test_bank_1234567890',
  status: 'success',
  message: 'Bank transfer payment intent created successfully',
};

export const mockPaymentStatusResponse: PaymentStatusResponse = {
  status: 'completed',
  payment_id: 'pay_test_1234567890',
  amount: 50000,
  currency: 'INR',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockPaymentStatusResponsePending: PaymentStatusResponse = {
  status: 'pending',
  payment_id: 'pay_test_1234567890',
  amount: 50000,
  currency: 'INR',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockPaymentStatusResponseFailed: PaymentStatusResponse = {
  status: 'failed',
  payment_id: 'pay_test_1234567890',
  amount: 50000,
  currency: 'INR',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockConfirmPaymentResponse: ConfirmPaymentResponse = {
  status: 'success',
  payment_id: 'pay_test_1234567890',
  message: 'Payment confirmed successfully',
  redirect_url: '/success',
};

export const mockPaymentApiError = {
  response: {
    status: 400,
    data: {
      message: 'Invalid payment request',
      error: 'Bad Request',
    },
  },
  message: 'Request failed with status code 400',
  isAxiosError: true,
};

export const mockPaymentApiUnauthorizedError = {
  response: {
    status: 401,
    data: {
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  },
  message: 'Request failed with status code 401',
  isAxiosError: true,
};

export const mockPaymentApiServerError = {
  response: {
    status: 500,
    data: {
      message: 'Server error',
      error: 'Internal Server Error',
    },
  },
  message: 'Request failed with status code 500',
  isAxiosError: true,
};
