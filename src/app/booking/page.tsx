import { Fragment, Suspense } from 'react';
import config from '../../../config.json';
import { Header } from '../../common/components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ActiveTickets } from './components/ActiveTicket';
import { Destination } from './components/Destination';
import { Partners } from './components/Partners';
import { SubscriptionWorks } from './components/SubscriptionWorks';
import { Footer } from '@/common/components/Footer';

const bookingSEO = config.find((item) => item.slug === '/booking');
export const metadata = {
  title: bookingSEO?.title || '',
  description: bookingSEO?.description || '',
  keywords: bookingSEO?.keywords || '',
};

const Booking = () => {
  return (
    <Fragment>
      <Suspense fallback={<div></div>}>
        <Header />
        <div className="overflow-hidden">
          <HeroBanner />
        </div>
        <ActiveTickets />
        <Destination
          textColor="text-white dark:text-black"
          leftBgColor="bg-Teal-500 py-8"
          arrowColor="text-white"
          widthClass="w-full"
          subTitle="text-white"
          arrowBorderColor="border-white"
        />
        <Partners />
        <SubscriptionWorks />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default Booking;
