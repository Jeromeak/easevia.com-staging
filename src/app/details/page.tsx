import { Fragment, Suspense, useMemo } from 'react';
import clsx from 'clsx';
import { Header } from '../../common/components/Header';
import { HeroBanner } from './components/HeroBanner';
import { OverView } from './components/Overview';
import { Destinations } from './components/Destinations';
import { Trips } from './components/Trips';
import { Partners } from './components/Partners';
import { Benefits } from './components/Benefits';
import { FAQ } from './components/FAQ';
import { PopularPlans } from './components/PopularPlans';
import { Keys } from './components/Keys';
import { Person } from './components/Person';
import { Routs } from './components/Routs';
import { Rescheduled } from './components/Rescheduled';
import { Flexible } from './components/Flexible';
import { Footer } from '@/common/components/Footer';
import { PakageSummary } from './components/PackageSummary';

const PlanDetails = () => {
  const overflowClassName = useMemo(() => clsx('overflow-hidden'), []);
  const loadingClassName = useMemo(() => clsx(''), []);

  return (
    <Fragment>
      <Suspense fallback={<div className={loadingClassName}>Loading...</div>}>
        <Header />
        <HeroBanner />
        <div className={overflowClassName}>
          <OverView />
        </div>
        <Destinations />
        <Trips />
        <Person />
        <Routs />
        <Partners />
        <Rescheduled />
        <Flexible />
        <Benefits />
        <PakageSummary />
        <FAQ />
        <PopularPlans />
        <Keys />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default PlanDetails;
