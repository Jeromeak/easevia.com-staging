//* Payment API Types

//* Request payload for creating payment intent (package_id is passed in URL)
export interface CreatePaymentIntentRequest {
  payment_method: 'card' | 'bank_transfer';
}

//* Response for payment intent creation
export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  status: 'success' | 'failed';
  message?: string;
}

//* Payment confirmation request
export interface ConfirmPaymentRequest {
  payment_intent_id: string;
  payment_method_id: string;
}

//* Payment confirmation response
export interface ConfirmPaymentResponse {
  status: 'success' | 'failed';
  payment_id: string;
  message: string;
  redirect_url?: string;
}

//* Payment status response
export interface PaymentStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_id: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

//* Common API error response for payments
export interface PaymentApiErrorResponse {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  status_code?: number;
}
