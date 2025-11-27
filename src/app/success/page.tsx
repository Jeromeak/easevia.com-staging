'use client';
import { Fragment, Suspense, useEffect, useState } from 'react';
import { Header } from '../../common/components/Header';
import { Footer } from '@/common/components/Footer';
import { SuccessBanner } from './components/SuccessBanner';
import { SubscriptionDetail } from './components/SubscriptionDetail';
import { useAuth } from '@/context/hooks/useAuth';
import { useCheckout } from '@/context/hooks/useCheckout';
import type { SelectedPlan } from '@/context/checkout.types';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const { state } = useCheckout();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    // Get selected plan from success data (stored during payment)
    const successPlanData = localStorage.getItem('successPlanData');

    if (successPlanData) {
      try {
        const planData = JSON.parse(successPlanData);
        setSelectedPlan(planData);
      } catch {
        // Silent fallback for corrupted localStorage data
      }
    } else {
      // Fallback to context if no success data
      if (state.selectedPlan) {
        setSelectedPlan(state.selectedPlan);
      } else {
        // Final fallback to localStorage for page refreshes
        const storedPlan = localStorage.getItem('selectedPlan');

        if (storedPlan) {
          try {
            const planData = JSON.parse(storedPlan);
            setSelectedPlan(planData);
          } catch {
            // Silent fallback for corrupted localStorage data
          }
        }
      }
    }

    // Get transaction ID from context
    if (state.paymentDetails.transactionId) {
      setTransactionId(state.paymentDetails.transactionId);
    } else {
      // Fallback to localStorage for transaction ID
      const storedTransactionId = localStorage.getItem('transactionId');

      if (storedTransactionId) {
        setTransactionId(storedTransactionId);
      }
    }
  }, [state.selectedPlan, state.paymentDetails.transactionId]);

  // Clean up all success data when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      // Clear all success-related data when leaving the page
      localStorage.removeItem('transactionId');
      localStorage.removeItem('successPlanData');
    };
  }, []);

  // Clean up transaction ID from localStorage after it's been used
  useEffect(() => {
    if (transactionId) {
      // Remove the transaction ID from localStorage since it's now displayed
      localStorage.removeItem('transactionId');
    }
  }, [transactionId]);

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <SuccessBanner transactionId={transactionId} />
        <SubscriptionDetail selectedPlan={selectedPlan} userEmail={user?.email} userPhone={user?.phone} />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default PaymentSuccess;
