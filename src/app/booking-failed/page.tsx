import { Footer } from '@/common/components/Footer';
import { Header } from '@/common/components/Header';
import { Fragment, Suspense } from 'react';
import { HeroBanner } from './components/HeroBanner';
import { FlightDetails } from './components/FlightDetails';

const BookingFailed = () => {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading..</div>}>
        <div className="bg-blue-150 dark:bg-black">
          <Header />
          <HeroBanner />
          <FlightDetails />
          <Footer />
        </div>
      </Suspense>
    </Fragment>
  );
};

export default BookingFailed;
