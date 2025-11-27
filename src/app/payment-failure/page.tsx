import { Footer } from '@/common/components/Footer';
import { Header } from '@/common/components/Header';
import { Fragment, Suspense } from 'react';
import { PaymentFailedScreen } from './components/PaymentFailedScreen';

const PaymentFailure = () => {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <PaymentFailedScreen />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default PaymentFailure;
