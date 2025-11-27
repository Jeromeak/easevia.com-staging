import { Fragment, Suspense } from 'react';
import { Header } from '../../common/components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ComparePlane } from './components/ComparePlans';
import { Footer } from '@/common/components/Footer';

const PlanCompare = () => {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-blue-150 dark:bg-black">
          <Header />
          <HeroBanner />
          <ComparePlane />
          <Footer />
        </div>
      </Suspense>
    </Fragment>
  );
};

export default PlanCompare;
