'use client';
import { ToggleSwitch } from '@/app/booking/components/ToggleSwitch';
import { LeftPannelSkeleton } from '@/app/ticket/components/LeftPannelSkeleton';
import { CloseIcon, FilterTicketIcon, DestinationIcon } from '@/icons/icon';
import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { DestinationDropDown } from '@/app/booking/components/DestinationDropdown';
import { fetchPackageClasses, fetchPackageAirlines } from '@/lib/api/package';
import type {
  PackageAirlinesRequest,
  PackageClass,
  PackageClassesRequest,
  PackageAirline,
} from '@/lib/types/api/package';
import { CustomCheckbox } from '@/common/components/CustomCheckBox';

interface FilterPannelProps {
  onTravelClassChange?: (selectedClasses: string) => void;
  onAirlinesChange?: (selectedAirlines: string) => void;
  onOriginChange?: (origin: string) => void;
  onDestinationChange?: (destination: string) => void;
  onClose?: () => void;
}

export const FilterPannel = ({
  onTravelClassChange,
  onAirlinesChange,
  onClose,
  onOriginChange,
  onDestinationChange,
}: FilterPannelProps) => {
  const [enabled, setEnabled] = useState(false);
  const [airlines, setAirlines] = useState<PackageAirline[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [loadingAirlines, setLoadingAirlines] = useState(false);
  const [checkboxKey, setCheckboxKey] = useState(0);
  const [locationKey, setLocationKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  const [travelClasses, setTravelClasses] = useState<PackageClass[]>([]);
  const [selectedTravelClasses, setSelectedTravelClasses] = useState<string[]>([]);
  const [loadingTravelClasses, setLoadingTravelClasses] = useState(false);

  const handleToggleSelectAll = () => {
    if (selectedAirlines.length === airlines.length) {
      setSelectedAirlines([]);
      setEnabled(false);
      if (onAirlinesChange) onAirlinesChange('');
    } else {
      const allIds = airlines.map((a) => a.iata_code);
      setSelectedAirlines(allIds);
      setEnabled(true);
      if (onAirlinesChange) onAirlinesChange(allIds.join(','));
    }

    setCheckboxKey((prev) => prev + 1);
  };

  const fetchTravelClasses = useCallback(async () => {
    setLoadingTravelClasses(true);

    try {
      let params: PackageClassesRequest | undefined = undefined;
      const query: PackageClassesRequest = {};
      if (origin) query.origin = origin;
      if (destination) query.destination = destination;
      if (Object.keys(query).length > 0) params = query;

      const classes = await fetchPackageClasses(params);
      setTravelClasses(classes);
    } catch (error) {
      console.error('Failed to fetch travel classes:', error);
      setTravelClasses([]);
    } finally {
      setLoadingTravelClasses(false);
    }
  }, [origin, destination]);

  const fetchAirlines = useCallback(async () => {
    setLoadingAirlines(true);

    try {
      const params: PackageAirlinesRequest = {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;

      const airlinesData = await fetchPackageAirlines(params);
      setAirlines(airlinesData);
    } catch (error) {
      console.log('Failed to fetch airlines:', error);
      setAirlines([]);
    } finally {
      setLoadingAirlines(false);
    }
  }, [origin, destination]);

  const handleTravelClassChange = (className: string, checked: boolean) => {
    const updatedSelection = checked
      ? [...selectedTravelClasses, className]
      : selectedTravelClasses.filter((name) => name !== className);

    setSelectedTravelClasses(updatedSelection);

    const selectedClassesString = updatedSelection.join(',');
    onTravelClassChange?.(selectedClassesString);
  };

  const handleAirlineChange = (airlineIataCode: string, checked: boolean) => {
    const updatedSelection = checked
      ? [...selectedAirlines, airlineIataCode]
      : selectedAirlines.filter((code) => code !== airlineIataCode);
    setSelectedAirlines(updatedSelection);

    if (onAirlinesChange) {
      onAirlinesChange(updatedSelection.join(','));
    }
  };

  const handleReset = () => {
    setSelectedAirlines([]);
    setSelectedTravelClasses([]);
    setOrigin('');
    setDestination('');
    setEnabled(false);
    setCheckboxKey((prev) => prev + 1);
    onTravelClassChange?.('');
    onAirlinesChange?.('');
    onOriginChange?.('');
    onDestinationChange?.('');
    setLocationKey((prev) => prev + 1);
  };

  const handleClose = () => {
    const isDesktop = window.innerWidth >= 1280;

    if (!isDesktop && panelRef.current && overlayRef.current) {
      gsap.to(panelRef.current, {
        x: '-100%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          if (onClose) onClose();
        },
      });
    } else {
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    setLoading(false);
    setEnabled(selectedAirlines.length === airlines.length && airlines.length > 0);
  }, [selectedAirlines, airlines]);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1280;

    if (!isDesktop && panelRef.current && overlayRef.current && !loading) {
      gsap.set(panelRef.current, {
        x: '-100%',
        visibility: 'visible',
      });
      gsap.set(overlayRef.current, {
        opacity: 0,
        visibility: 'visible',
      });

      requestAnimationFrame(() => {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.2,
          ease: 'power1.out',
        });

        gsap.to(panelRef.current, {
          x: '0%',
          duration: 0.3,
          ease: 'power2.out',
          delay: 0.05,
        });
      });
    }
  }, [loading]);

  useEffect(() => {
    fetchTravelClasses();
    fetchAirlines();
  }, [fetchTravelClasses, fetchAirlines]);

  return loading ? (
    <LeftPannelSkeleton />
  ) : (
    <Fragment>
      <div
        ref={overlayRef}
        className={clsx('xl:hidden fixed inset-0 bg-black/40 backdrop-blur-md bg-opacity-50 z-[9999] invisible')}
        onClick={handleClose}
      />

      <div className="flex flex-col">
        <div className="xl:flex hidden justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <FilterTicketIcon />
            Filter
          </div>
          <div className="text-Light font-medium cursor-pointer" onClick={handleReset}>
            Reset
          </div>
        </div>
        <div
          ref={panelRef}
          className={clsx(
            'fixed inset-0 xl:relative xl:inset-auto w-full md:w-1/2 xl:w-full bg-white dark:bg-neutral-50 xl:h-auto h-full border xl:rounded-2xl border-[#d9d9d9] dark:border-[#262626] xl:mt-5 scroll mt-0 xl:z-0 z-[10000] flex flex-col'
          )}
          style={{
            transform: typeof window !== 'undefined' && window.innerWidth < 1280 ? 'translateX(-100%)' : 'none',
          }}
        >
          <div className="xl:hidden sticky top-0 z-10 bg-white dark:bg-neutral-50 dark:border-b shadow-md dark:border-b-[#262626] p-4 flex justify-between items-center">
            <div className="dark:text-white font-medium text-[20px] font-Futra uppercase">Plan Filter</div>
            <div onClick={handleClose} className="cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <div className="flex flex-col border-b border-b-[#D9D9D9] dark:border-b-[#262626] p-8">
            <div className="text-white font-medium text-base">Destination</div>
            <div className="flex flex-col mt-4">
              <div className="text-base text-Light uppercase font-medium ">From</div>
              <div>
                <DestinationDropDown
                  key={`from-${locationKey}`}
                  useCities
                  preventList={destination ? [destination] : []}
                  onChange={(cityId) => {
                    setOrigin(cityId);
                    onOriginChange?.(cityId);
                  }}
                  className="border-b py-2 border-[#D9D9D9] dark:border-b-[#262626]"
                />
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <div className="text-base text-Light uppercase font-medium ">To</div>
              <div>
                <DestinationDropDown
                  key={`to-${locationKey}`}
                  useCities
                  icon={DestinationIcon}
                  preventList={origin ? [origin] : []}
                  onChange={(cityId) => {
                    setDestination(cityId);
                    onDestinationChange?.(cityId);
                  }}
                  className="border-b py-2 border-b-[#D9D9D9] dark:border-b-[#262626]"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col border-b border-b-[#D9D9D9] dark:border-b-[#262626] p-8">
            <div className="dark:text-white font-medium text-base">Travel Class</div>
            <div className="flex flex-col gap-3 mt-5">
              {loadingTravelClasses ? (
                <div className="text-gray-400 text-sm">Loading travel classes...</div>
              ) : travelClasses.length > 0 ? (
                travelClasses.map((travelClass) => (
                  <CustomCheckbox
                    key={travelClass.id}
                    label={`${travelClass.name}`}
                    checked={selectedTravelClasses.includes(travelClass.name)}
                    onChange={(checked) => handleTravelClassChange(travelClass.name, checked)}
                  />
                ))
              ) : (
                <div className="text-gray-400 text-sm">
                  {origin && destination
                    ? 'No travel classes available for the selected route'
                    : 'No travel classes available'}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col p-8">
            <div className="dark:text-white font-medium text-base">Airlines</div>
            <div className="flex justify-between w-full mt-3">
              <div className="flex items-center text-[#A3A3A3]">Select all airlines</div>
              <div>
                <ToggleSwitch enabled={enabled} onToggle={handleToggleSelectAll} disabled={airlines.length === 0} />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-5" key={checkboxKey}>
              {loadingAirlines ? (
                <div className="text-gray-400 text-sm">Loading airlines...</div>
              ) : airlines.length > 0 ? (
                airlines.map((airline) => (
                  <CustomCheckbox
                    key={airline.id}
                    label={airline.business_name || airline.common_name}
                    checked={selectedAirlines.includes(airline.iata_code)}
                    onChange={(checked) => handleAirlineChange(airline.iata_code, checked)}
                  />
                ))
              ) : (
                <div className="text-gray-400 text-sm">
                  {origin && destination ? 'No airlines available for the selected route' : 'No airlines available'}
                </div>
              )}
            </div>
          </div>
          <div className="lg:hidden flex justify-end sticky bottom-0 bg-white dark:bg-gray-300 p-5">
            <div className="flex gap-3">
              <button className="uppercase rounded-full bg-orange-200 text-black px-8 py-1 font-medium text-sm ">
                Clear
              </button>
              <button className="uppercase rounded-full bg-Teal-500 text-white px-8 py-1 font-medium text-sm ">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
