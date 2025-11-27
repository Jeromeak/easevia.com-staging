'use client';
import { ArrowLeft, CardIcon, BankIcon } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState, useEffect } from 'react';
import { CardPin } from './CardPin';
import { PaymentMethod, PaymentStatus } from '@/context/checkout.types';
import clsx from 'clsx';
import { useAuth } from '@/context/hooks/useAuth';
import { useCheckout } from '@/context/hooks/useCheckout';
import { ValidationErrors } from './ValidationErrors';
import { createPaymentIntent, getPaymentStatus } from '@/lib/api/payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { stripeAppearance } from '@/lib/stripe/appearance';
import type { PaymentProcessProps } from '@/lib/types/common.types';

// Initialize Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

// Custom CardElement styling to match your design
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Mada, sans-serif',
      '::placeholder': {
        color: '#7C797E',
      },
      backgroundColor: 'transparent',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true, // Since you have a separate billing address form
};

// Stripe Card Form Component
const StripeCardForm = ({
  onSubmit,
  isDisabled,
  clientSecret,
  onCancel,
}: {
  onSubmit: (paymentMethodId: string) => void;
  isDisabled: boolean;
  clientSecret: string;
  onCancel?: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    setCardError('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    // Clear previous errors
    setCardError('');
    setIsProcessing(true);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        setCardError(paymentMethodError.message || 'An error occurred with your card');
        setIsProcessing(false);

        return;
      }

      if (!paymentMethod) {
        setCardError('Failed to create payment method');
        setIsProcessing(false);

        return;
      }

      // Confirm the payment with the client secret
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setCardError(confirmError.message || 'Payment failed');
        setIsProcessing(false);

        return;
      }

      // Payment successful - pass payment intent ID
      if (paymentIntent?.id) {
        onSubmit(paymentIntent.id);
      } else {
        setCardError('Payment successful but transaction ID not received');
        setIsProcessing(false);
      }
    } catch {
      setCardError('An unexpected error occurred');
      setIsProcessing(false);
    }
  }, [stripe, elements, onSubmit, clientSecret]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="text-[#ccc] text-base font-medium mb-3">Card details</div>
        <div className="border border-[#343434] rounded-[7px] p-3 bg-black">
          {clientSecret && clientSecret.length > 0 ? (
            <CardElement options={cardElementOptions} />
          ) : (
            <div className="text-red-400 text-sm">⚠ Client secret not available</div>
          )}
        </div>
        {cardError && <div className="text-red-400 text-sm mt-2">⚠ {cardError}</div>}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || isDisabled || isProcessing}
          className={clsx(
            'bg-Teal-500 w-full Teal cursor-pointer gap-2 text-white px-6 py-4 font-medium flex items-center justify-center rounded-full',
            {
              'opacity-50 cursor-not-allowed': !stripe || isDisabled || isProcessing,
              'hover:bg-Teal-600': stripe && !isDisabled && !isProcessing,
            }
          )}
        >
          {isProcessing ? 'Processing Payment...' : 'Subscribe'}
          <ArrowLeft width="24" height="24" className="transform rotate-180 mt-1" />
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-testid="payment-cancel-button"
          className="bg-transparent text-center text-Teal-500 cursor-pointer TealTransparent border border-Teal-500 w-full rounded-full px-5 py-4 hover:bg-Teal-500 hover:text-white transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Stripe Bank Transfer Form Component
const StripeBankTransferForm = ({
  onSubmit,
  isDisabled,
  clientSecret,
  userEmail,
  onCancel,
}: {
  onSubmit: (paymentMethodId: string) => void;
  isDisabled: boolean;
  clientSecret: string;
  userEmail?: string;
  onCancel?: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [transferError, setTransferError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    setTransferError('');
  }, []);

  // Dark theme is now handled by Stripe's built-in appearance system

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) {
      return;
    }

    const paymentElement = elements.getElement(PaymentElement);

    if (!paymentElement) {
      return;
    }

    // Clear previous errors
    setTransferError('');
    setIsProcessing(true);

    try {
      // Confirm the payment with the client secret
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setTransferError(confirmError.message || 'Bank transfer failed');
        setIsProcessing(false);

        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Payment successful immediately
        onSubmit(paymentIntent.id);
      } else if (paymentIntent?.status === 'requires_action') {
        // Handle 3D Secure or other actions
        setTransferError('Additional authentication required');
        setIsProcessing(false);
      } else if (paymentIntent?.status === 'processing' || paymentIntent?.status === 'requires_payment_method') {
        // Bank transfer is being processed - start polling
        setTransferError('Bank transfer initiated. Checking payment status...');

        // Start polling for payment status
        const pollPaymentStatus = async () => {
          try {
            const statusResponse = await getPaymentStatus(paymentIntent.id);

            if (statusResponse.status === 'completed') {
              // Payment successful
              setTransferError('');
              onSubmit(paymentIntent.id);
            } else if (statusResponse.status === 'failed') {
              // Payment failed
              setTransferError('Payment failed. Please try again.');
              setIsProcessing(false);
            } else {
              // Still processing (pending/processing), continue polling
              setTimeout(pollPaymentStatus, 3000); // Poll every 3 seconds
            }
          } catch {
            setTransferError('Failed to check payment status. Please contact support.');
            setIsProcessing(false);
          }
        };

        // Start polling after 5 seconds to allow bank transfer to process
        setTimeout(pollPaymentStatus, 5000);
      } else {
        setTransferError('Bank transfer is being processed');
        setIsProcessing(false);
      }
    } catch {
      setTransferError('An unexpected error occurred');
      setIsProcessing(false);
    }
  }, [stripe, elements, onSubmit]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="text-[#ccc] text-base font-medium mb-3">Bank transfer details</div>
        <div className="border border-[#343434] rounded-[7px] p-3 bg-black">
          {clientSecret && clientSecret.length > 0 ? (
            <PaymentElement
              options={{
                layout: 'tabs',
                defaultValues: {
                  billingDetails: {
                    email: userEmail || '',
                  },
                },
                fields: {
                  billingDetails: {
                    email: 'auto',
                  },
                },
                paymentMethodOrder: ['bank_transfer'],
              }}
            />
          ) : (
            <div className="text-red-400 text-sm">⚠ Client secret not available</div>
          )}
        </div>
        {transferError && <div className="text-red-400 text-sm mt-2">⚠ {transferError}</div>}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || isDisabled || isProcessing}
          className={clsx(
            'bg-Teal-500 w-full Teal cursor-pointer gap-2 text-white px-6 py-4 font-medium flex items-center justify-center rounded-full',
            {
              'opacity-50 cursor-not-allowed': !stripe || isDisabled || isProcessing,
              'hover:bg-Teal-600': stripe && !isDisabled && !isProcessing,
            }
          )}
        >
          {isProcessing ? 'Processing Transfer...' : 'Subscribe'}
          <ArrowLeft width="24" height="24" className="transform rotate-180 mt-1" />
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-testid="payment-cancel-button"
          className="bg-transparent text-center text-Teal-500 cursor-pointer TealTransparent border border-Teal-500 w-full rounded-full px-5 py-4 hover:bg-Teal-500 hover:text-white transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export function navigateOnCancel(router: ReturnType<typeof useRouter>, historyLength: number) {
  if (historyLength > 1) {
    router.back();
  } else {
    router.push('/plans');
  }
}

export const PaymentProcess: React.FC<PaymentProcessProps> = ({ isSubmitted, setIsSubmitted }) => {
  // setIsSubmitted is part of the interface but not used in current implementation
  void setIsSubmitted;
  const { user } = useAuth();
  const {
    state,
    addValidationError,
    setPaymentMethod,
    setPaymentStatus,
    setTransactionId,
    setClientSecret,
    setPaymentError,
    clearPaymentError,
    clearValidationErrors,
    resetPayment,
  } = useCheckout();

  const { isAddressComplete, isAddressValidated, selectedPlan, paymentDetails } = state;
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);

  // Clear payment data when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Only clear if payment was successful
      if (paymentDetails.paymentStatus === PaymentStatus.SUCCESS) {
        resetPayment();
      }
    };
  }, [paymentDetails.paymentStatus, resetPayment]);

  const router = useRouter();

  const handleCancel = useCallback(() => {
    navigateOnCancel(router, window.history.length);
  }, [router]);

  // Create payment intent when card tab is selected
  const handleTabCard = useCallback(async () => {
    if (paymentDetails.paymentMethod === PaymentMethod.CARD) return;

    // Clear previous payment data and errors when switching methods
    setClientSecret('');
    clearPaymentError();
    clearValidationErrors();

    setPaymentMethod(PaymentMethod.CARD);
    setPaymentStatus(PaymentStatus.PROCESSING);
    setIsCreatingPaymentIntent(true);

    try {
      // Call your API to create payment intent
      const data = await createPaymentIntent(String(selectedPlan?.id || ''), {
        payment_method: 'card',
      });

      setClientSecret(data.client_secret);
      setPaymentStatus(PaymentStatus.PENDING);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.';
      addValidationError(errorMessage);
      setPaymentError(errorMessage);
      setPaymentStatus(PaymentStatus.FAILED);
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  }, [
    paymentDetails.paymentMethod,
    selectedPlan,
    setPaymentMethod,
    setPaymentStatus,
    setClientSecret,
    setPaymentError,
    clearPaymentError,
    clearValidationErrors,
    addValidationError,
  ]);

  const handleTabBank = useCallback(async () => {
    if (paymentDetails.paymentMethod === PaymentMethod.BANK_TRANSFER) return;

    // Clear previous payment data and errors when switching methods
    setClientSecret('');
    clearPaymentError();
    clearValidationErrors();

    setPaymentMethod(PaymentMethod.BANK_TRANSFER);
    setPaymentStatus(PaymentStatus.PROCESSING);
    setIsCreatingPaymentIntent(true);

    try {
      // Call your API to create payment intent for bank transfer
      const data = await createPaymentIntent(String(selectedPlan?.id || ''), {
        payment_method: 'bank_transfer',
      });

      console.log('✅ Bank transfer payment intent created, client secret:', data.client_secret);
      setClientSecret(data.client_secret);
      setPaymentStatus(PaymentStatus.PENDING);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initialize bank transfer. Please try again.';
      addValidationError(errorMessage);
      setPaymentError(errorMessage);
      setPaymentStatus(PaymentStatus.FAILED);
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  }, [
    paymentDetails.paymentMethod,
    selectedPlan,
    setPaymentMethod,
    setPaymentStatus,
    setClientSecret,
    setPaymentError,
    clearPaymentError,
    clearValidationErrors,
    addValidationError,
  ]);

  const handleCardPaymentSuccess = useCallback(
    (paymentIntentId: string) => {
      // Store transaction ID in context
      setTransactionId(paymentIntentId);
      setPaymentStatus(PaymentStatus.SUCCESS);

      // Also store in localStorage as backup for navigation
      localStorage.setItem('transactionId', paymentIntentId);

      // Store plan data in localStorage for success page (don't clear yet)
      if (selectedPlan) {
        localStorage.setItem('successPlanData', JSON.stringify(selectedPlan));
      }

      // Payment successful, redirect to success page
      router.push('/success');
    },
    [router, setTransactionId, setPaymentStatus, selectedPlan]
  );

  const getButtonClass = useCallback(
    (tab: PaymentMethod) =>
      clsx(
        'w-1/2 cursor-pointer duration-500 py-3 gap-2 rounded-[8.815px] shadow-11xl text-center flex items-center justify-center px-[17.139px]',
        paymentDetails.paymentMethod === tab
          ? 'bg-Teal-500 dark:bg-[#161616] text-white'
          : 'bg-transparent text-[#5D5D5D]'
      ),
    [paymentDetails.paymentMethod]
  );

  return (
    <div className="!w-full !max-w-full flex flex-col md:items-start gap-8 md:gap-10 self-stretch dark:bg-gray-300 py-10 px-5 md:py-12 md:p-6 xl:p-14">
      <div className="text-32 text-semibold tracking-[-0.96px] border-b pb-3 border-b-gray-250 uppercase text-neutral-50 dark:text-white font-Neutra w-full">
        Payment
      </div>

      {/* Validation Errors */}
      <ValidationErrors />

      {/* Address Completion Status */}
      {!isSubmitted && (
        <div className="mt-4 p-3 rounded-lg border-none dark:border">
          {isAddressComplete && isAddressValidated ? (
            <div className="bg-green-500/20 px-3 py-1 border-green-500/50">
              <div className="text-green-400 text-sm">✓ Billing address is complete and ready for subscription</div>
            </div>
          ) : (
            <div className="bg-yellow-500/20 px-3 py-1 border-yellow-500/50">
              <div className="text-yellow-400 text-sm">⚠ Please complete your billing address before subscribing</div>
            </div>
          )}
        </div>
      )}

      {isSubmitted ? (
        <CardPin />
      ) : (
        <div className="flex flex-col w-full">
          <div className="mt-4 dark:md:mt-8">
            <div className="text-neutral-50 dark:text-white text-[19.282px] font-normal uppercase">
              Contact information
            </div>
          </div>
          <div className="flex flex-col mt-4 md:mt-8 gap-3 md:gap-2">
            <div className="flex flex-col relative">
              <div className="text-gray-340 absolute translate-y-1/2 font-medium left-4">Email</div>
              <input
                type="text"
                readOnly
                value={user?.email || 'Loading...'}
                className="rounded-[7px] pl-23 md:pl-34 text-[#CCC] text-sm leading-5 font-medium p-3 placeholder: dark:bg-neutral-50 border border-[#D9DEDF] dark:border-inputsecondary outline-none"
              />
            </div>
            <div className="flex flex-col relative">
              <div className="text-gray-340 absolute translate-y-1/2 font-medium left-4">Mobile</div>
              <input
                type="text"
                readOnly
                value={user?.phone || 'Loading...'}
                className="rounded-[7px] pl-23 md:pl-34 text-[#CCC] text-sm leading-5 font-medium p-3 placeholder: dark:bg-neutral-50 border border-[#D9DEDF] dark:border-inputsecondary outline-none"
              />
            </div>
          </div>

          <div className="flex w-full justify-between bg-blue-150 dark:bg-gray-360 p-1.5 my-4 md:my-12 rounded-[8.815px]">
            <button
              onClick={handleTabCard}
              className={getButtonClass(PaymentMethod.CARD)}
              disabled={isCreatingPaymentIntent}
            >
              <CardIcon />
              <div className="text-xl md:block hidden">{isCreatingPaymentIntent ? 'Loading...' : 'Card'}</div>
            </button>
            <button
              onClick={handleTabBank}
              className={getButtonClass(PaymentMethod.BANK_TRANSFER)}
              disabled={isCreatingPaymentIntent}
            >
              <BankIcon />
              <div className="text-xl md:block hidden">{isCreatingPaymentIntent ? 'Loading...' : 'Bank Transfer'}</div>
            </button>
          </div>
          <div className="text-[#ccc] text-base font-medium">Payment method</div>
          <div className="mt-3 md:mt-6">
            {paymentDetails.paymentMethod === PaymentMethod.CARD ? (
              paymentDetails.clientSecret &&
              paymentDetails.clientSecret.length > 0 &&
              paymentDetails.clientSecret.includes('_secret_') ? (
                <Elements
                  key={`card-${paymentDetails.clientSecret}`}
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentDetails.clientSecret,
                    appearance: stripeAppearance,
                  }}
                >
                  <StripeCardForm
                    onSubmit={handleCardPaymentSuccess}
                    isDisabled={!isAddressComplete || !isAddressValidated}
                    clientSecret={paymentDetails.clientSecret}
                    onCancel={handleCancel}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400">
                    {isCreatingPaymentIntent ? 'Initializing payment...' : 'Click Card tab to initialize payment'}
                  </div>
                </div>
              )
            ) : paymentDetails.paymentMethod === PaymentMethod.BANK_TRANSFER ? (
              paymentDetails.clientSecret &&
              paymentDetails.clientSecret.length > 0 &&
              paymentDetails.clientSecret.includes('_secret_') ? (
                <Elements
                  key={`bank-${paymentDetails.clientSecret}`}
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentDetails.clientSecret,
                    appearance: stripeAppearance,
                  }}
                >
                  <StripeBankTransferForm
                    onSubmit={handleCardPaymentSuccess}
                    isDisabled={!isAddressComplete || !isAddressValidated}
                    clientSecret={paymentDetails.clientSecret}
                    userEmail={user?.email}
                    onCancel={handleCancel}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400">
                    {isCreatingPaymentIntent
                      ? 'Initializing payment...'
                      : 'Click Bank Transfer tab to initialize payment'}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400">Please select a payment method</div>
              </div>
            )}
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="mt-5 text-gray-250 text-[14px] md:text-base">
          Your personal data will be used to process your order, support your experience throughout this website, and
          for other purposes described in our privacy policy.
        </div>
      )}
    </div>
  );
};
