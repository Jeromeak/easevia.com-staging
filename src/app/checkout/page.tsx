'use client';
import { Fragment, Suspense, useState, useEffect } from 'react';
import { Header } from '../../common/components/Header';
import { HeroBanner } from './components/Herobanner';
import { Payment } from './components/Payment';
import { Footer } from '@/common/components/Footer';
import { useCheckout } from '@/context/hooks/useCheckout';

const Checkout = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { clearPaymentError, clearValidationErrors } = useCheckout();
  const stepText = isSubmitted ? 'Step 2/2' : 'Step 1/2';

  // Reset payment errors and validation errors when component mounts
  useEffect(() => {
    clearPaymentError();
    clearValidationErrors();
  }, [clearPaymentError, clearValidationErrors]);

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <HeroBanner stepText={stepText} selectedCount={0} />
        <Payment isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default Checkout;
