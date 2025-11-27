'use client';
import dynamic from 'next/dynamic';
import { Fragment, Suspense } from 'react';
import { Header } from '../../common/components/Header';
import { Footer } from '@/common/components/Footer';

const HeroBanner = dynamic(() => import('./components/HeroBanner'), { ssr: false });
const BookingReferenceDetails = dynamic(() => import('./components/BookingReferenceDetails'), { ssr: false });

const BookingSuccess = () => {
  return (
    <Fragment>
      <Suspense fallback={<div />}>
        <div className="bg-blue-150 dark:bg-black">
          <Header />
          <HeroBanner />
          <BookingReferenceDetails />
          <Footer />
        </div>
      </Suspense>
    </Fragment>
  );
};

export default BookingSuccess;
