'use client';
import { FilterPannel } from './FilterPannel';
import { PlanCard } from './PlanCard';
import { useEffect, useState } from 'react';
import { fetchPackages } from '@/lib/api/package';
import type { TravelPackage, PackageListRequest } from '@/lib/types/api/package';
import { useLanguageCurrency } from '@/context/hooks/useLanguageCurrency';

interface SubscriptionPlansLocalProps {
  setSelectedPlans: (plans: string[]) => void;
  selectedPlans?: string[];
}

export const SubscriptionPlans: React.FC<SubscriptionPlansLocalProps> = ({ setSelectedPlans, selectedPlans = [] }) => {
  const { currency } = useLanguageCurrency();

  const [selectedTravelClasses, setSelectedTravelClasses] = useState<string>('');
  const [selectedAirlines, setSelectedAirlines] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      setIsLoading(true);

      try {
        const payload: PackageListRequest = {};
        if (currency?.id) payload.currency_id = currency.id;
        if (origin) payload.origin = origin;
        if (destination) payload.destination = destination;
        if (selectedTravelClasses) payload.class_type = selectedTravelClasses;
        if (selectedAirlines) payload.airline = selectedAirlines;

        const data = await fetchPackages(payload);
        setPackages(data);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setPackages([]);
          console.error('Failed to fetch packages:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();

    return () => {
      controller.abort();
    };
  }, [currency?.id, origin, destination, selectedTravelClasses, selectedAirlines]);

  return (
    <section className="relative">
      <div className="max-w-[90%] mx-auto pb-10 lg:pb-30">
        <div className="flex justify-between flex-wrap gap-10 w-full xl:grid xl:grid-cols-12 xl:gap-10">
          <div className="w-full xl:block hidden xl:w-auto xl:col-span-4">
            <div className="xl:sticky xl:top-[120px] xl:h-fit">
              <FilterPannel
                onTravelClassChange={setSelectedTravelClasses}
                onAirlinesChange={setSelectedAirlines}
                onOriginChange={setOrigin}
                onDestinationChange={setDestination}
              />
            </div>
          </div>

          <div className="w-full xl:w-auto xl:col-span-8">
            <PlanCard
              setSelectedPlans={setSelectedPlans}
              selectedPlans={selectedPlans}
              isLoading={isLoading}
              packages={packages}
              onTravelClassChange={setSelectedTravelClasses}
              onAirlinesChange={setSelectedAirlines}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
