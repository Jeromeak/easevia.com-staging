'use client';
import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { PaymentMethod } from './checkout.types';
import {
  PaymentStatus,
  type CheckoutState,
  type CheckoutContextType,
  type SelectedPlan,
  initialState,
} from './checkout.types';
import { CheckoutContext } from './contexts/CheckoutContext';

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CheckoutState>(initialState);

  // Load selected plan from localStorage on mount (for persistence across page refreshes)
  useEffect(() => {
    const storedPlan = localStorage.getItem('selectedPlan');

    if (storedPlan) {
      try {
        const planData = JSON.parse(storedPlan);
        setState((prev) => ({ ...prev, selectedPlan: planData }));
      } catch (error) {
        console.error('Error parsing stored plan data:', error);
      }
    }
  }, []);

  const setSelectedPlan = useCallback((plan: SelectedPlan | null) => {
    setState((prev) => ({ ...prev, selectedPlan: plan }));

    // Persist plan data for page refreshes
    if (plan) {
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
    } else {
      localStorage.removeItem('selectedPlan');
    }
  }, []);

  // Clear all checkout data
  const clearCheckoutData = useCallback(() => {
    setState(initialState);
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('transactionId');
  }, []);

  const setAddressComplete = useCallback((complete: boolean) => {
    setState((prev) => ({ ...prev, isAddressComplete: complete }));
  }, []);

  const setAddressValidated = useCallback((validated: boolean) => {
    setState((prev) => ({ ...prev, isAddressValidated: validated }));
  }, []);

  const addValidationError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      validationErrors: [...prev.validationErrors, error],
    }));
  }, []);

  const clearValidationErrors = useCallback(() => {
    setState((prev) => ({ ...prev, validationErrors: [] }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  // Payment methods
  const setPaymentMethod = useCallback((method: PaymentMethod | null) => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        paymentMethod: method,
        paymentStatus: method ? PaymentStatus.PENDING : PaymentStatus.PENDING,
      },
    }));
  }, []);

  const setPaymentStatus = useCallback((status: PaymentStatus) => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        paymentStatus: status,
        timestamp: new Date(),
      },
    }));
  }, []);

  const setTransactionId = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        transactionId: id,
      },
    }));
  }, []);

  const setClientSecret = useCallback((secret: string) => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        clientSecret: secret,
      },
    }));
  }, []);

  const setPaymentError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        errorMessage: error,
        paymentStatus: PaymentStatus.FAILED,
        timestamp: new Date(),
      },
    }));
  }, []);

  const clearPaymentError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        errorMessage: undefined,
      },
    }));
  }, []);

  const resetPayment = useCallback(() => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        paymentMethod: null,
        paymentStatus: PaymentStatus.PENDING,
        transactionId: undefined,
        clientSecret: undefined,
        errorMessage: undefined,
        timestamp: undefined,
      },
    }));
  }, []);

  // Method to handle bank transfer initiation
  const initiateBankTransfer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        paymentStatus: PaymentStatus.PROCESSING,
        timestamp: new Date(),
      },
    }));
  }, []);

  const resetCheckout = useCallback(() => {
    setState(initialState);
    localStorage.removeItem('selectedPlan');
  }, []);

  const value: CheckoutContextType = {
    state,
    setSelectedPlan,
    setAddressComplete,
    setAddressValidated,
    addValidationError,
    clearValidationErrors,
    setLoading,
    resetCheckout,
    setPaymentMethod,
    setPaymentStatus,
    setTransactionId,
    setClientSecret,
    setPaymentError,
    clearPaymentError,
    resetPayment,
    initiateBankTransfer,
    clearCheckoutData,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};
