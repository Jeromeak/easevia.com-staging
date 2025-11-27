import { Footer } from '@/common/components/Footer';
import { Header } from '@/common/components/Header';
import { Fragment, Suspense } from 'react';
import { BookingReview } from './components/BookingReviewPage ';

const PassengersDetails = () => {
  return (
    <Fragment>
      <Suspense fallback={<div></div>}>
        <Header />
        <BookingReview />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default PassengersDetails;
