// Mock Stripe.js
export const mockStripe = {
  createPaymentMethod: jest.fn(),
  confirmCardPayment: jest.fn(),
  confirmPayment: jest.fn(),
  retrievePaymentIntent: jest.fn(),
  elements: jest.fn(() => ({
    create: jest.fn(),
    getElement: jest.fn(),
  })),
};

// Mock Stripe Elements
export const mockElements = {
  create: jest.fn(),
  getElement: jest.fn(),
  update: jest.fn(),
};

// Mock CardElement
export const mockCardElement = {
  mount: jest.fn(),
  unmount: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  update: jest.fn(),
  clear: jest.fn(),
  blur: jest.fn(),
  focus: jest.fn(),
  destroy: jest.fn(),
};

// Mock PaymentElement
export const mockPaymentElement = {
  mount: jest.fn(),
  unmount: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  update: jest.fn(),
  clear: jest.fn(),
  blur: jest.fn(),
  focus: jest.fn(),
  destroy: jest.fn(),
};

// Mock successful payment method creation
export const mockPaymentMethod = {
  id: 'pm_test_1234567890',
  type: 'card',
  card: {
    brand: 'visa',
    last4: '4242',
    exp_month: 12,
    exp_year: 2025,
  },
};

// Mock successful payment intent
export const mockPaymentIntent = {
  id: 'pi_test_1234567890',
  status: 'succeeded',
  client_secret: 'pi_test_1234567890_secret_abcdefghijklmnopqrstuvwxyz',
  amount: 50000,
  currency: 'inr',
  payment_method: 'pm_test_1234567890',
};

// Mock Stripe errors
export const mockStripeError = {
  type: 'card_error',
  code: 'card_declined',
  message: 'Your card was declined.',
  decline_code: 'generic_decline',
};

export const mockStripeProcessingError = {
  type: 'validation_error',
  message: 'Invalid card number',
};

// Mock loadStripe function
export const mockLoadStripe = jest.fn(() => Promise.resolve(mockStripe));
