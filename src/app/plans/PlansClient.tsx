'use client';

import { Fragment, Suspense, useCallback, useEffect, useState } from 'react';
import { Header } from '../../common/components/Header';
import { HeroBanner } from './components/HeroBanner';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { Footer } from '@/common/components/Footer';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const arraysEqual = (a: string[], b: string[]) => a.length === b.length && a.every((id, index) => id === b[index]);

export default function PlansClient() {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const syncSelectionWithQuery = useCallback(
    (plans: string[]) => {
      if (!pathname) return;

      const params = new URLSearchParams(searchParams?.toString());

      if (plans.length > 0) {
        params.set('selected_plan_ids', plans.join(','));
      } else {
        params.delete('selected_plan_ids');
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const selectedParam = searchParams?.get('selected_plan_ids');
    const parsed = selectedParam ? selectedParam.split(',').filter(Boolean) : [];

    setSelectedPlans((prev) => (arraysEqual(prev, parsed) ? prev : parsed));
  }, [searchParams]);

  const handleSelectedPlansChange = useCallback(
    (plans: string[]) => {
      const uniquePlans = Array.from(new Set(plans));
      setSelectedPlans(uniquePlans);
      syncSelectionWithQuery(uniquePlans);
    },
    [syncSelectionWithQuery]
  );

  const handleClearSelection = () => {
    handleSelectedPlansChange([]);
  };

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-blue-150 dark:bg-black">
          <Header />
          <HeroBanner
            selectedCount={selectedPlans.length}
            selectedPlans={selectedPlans}
            onClearSelection={handleClearSelection}
          />
          <SubscriptionPlans setSelectedPlans={handleSelectedPlansChange} selectedPlans={selectedPlans} />
          <Footer />
        </div>
      </Suspense>
    </Fragment>
  );
}
