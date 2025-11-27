'use client';
import { Fragment, Suspense, useEffect, useState } from 'react';
import { Header } from '../../../common/components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { OverView } from '../components/Overview';
import { Destinations } from '../components/Destinations';
import { Trips } from '../components/Trips';
import { Partners } from '../components/Partners';
import { Benefits } from '../components/Benefits';
import { FAQ } from '../components/FAQ';
import { PopularPlans } from '../components/PopularPlans';
import { Keys } from '../components/Keys';
import { Person } from '../components/Person';
import { Rescheduled } from '../components/Rescheduled';
import { Flexible } from '../components/Flexible';
import { Footer } from '@/common/components/Footer';
import { PakageSummary } from '../components/PackageSummary';
import { fetchPackageById } from '@/lib/api/package';
import type { TravelPackage } from '@/lib/types/api/package';
import { useParams } from 'next/navigation';
import { Routs } from '../components/Routs';

const PlanDetails = () => {
  const params = useParams();
  const planId: string = params.id as string;
  const [plan, setPlan] = useState<TravelPackage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!planId) return;

      try {
        setIsLoading(true);
        setError(null);
        const planData = await fetchPackageById(planId);
        setPlan(planData);
      } catch (err: unknown) {
        console.error('Failed to fetch plan details:', err);
        const errorMessage: string = err instanceof Error ? err.message : 'Failed to fetch plan details';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  if (isLoading) {
    return (
      <Fragment>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading plan details...</div>
        </div>
      </Fragment>
    );
  }

  if (error || !plan) {
    return (
      <Fragment>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Plan not found or error occurred</div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Suspense fallback={<div className="">Loading...</div>}>
        <Header />
        <HeroBanner plan={plan} />
        <div className="overflow-hidden">
          <OverView plan={plan} />
        </div>
        <Destinations plan={plan} />
        <Trips plan={plan} />
        <Person plan={plan} />
        <Routs />
        <Partners plan={plan} />
        <Rescheduled plan={plan} />
        {/* <Flexible plan={plan} /> */}
        <Flexible />
        <Benefits plan={plan} />
        <PakageSummary plan={plan} />
        <FAQ />
        <PopularPlans />
        <Keys plan={plan} />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default PlanDetails;
