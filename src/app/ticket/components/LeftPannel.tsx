'use client';

import { ToggleSwitch } from '@/app/booking/components/ToggleSwitch';
import { CustomCheckbox } from '@/common/components/CustomCheckBox';
import { DepartureTime } from '@/common/components/Data';
import { FlightDurationSlider } from '@/common/components/DurationSlider';
import { FilterTicketIcon } from '@/icons/icon';
import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import { LeftPannelSkeleton } from './LeftPannelSkeleton';
import { gsap } from 'gsap';
import { fetchPackageAirlines, fetchPackageClasses } from '@/lib/api/package';
import type {
  PackageAirline,
  PackageAirlinesRequest,
  PackageClass,
  PackageClassesRequest,
} from '@/lib/types/api/package';

interface FilterState {
  selectedAirlines: string[];
  transit?: string; // Comma-separated transit values: "1,2,3+"
  travelClass?: string; // Travel class name from API
  departureTime: string[];
  arrivalTime: string[];
  durationRange: [number, number];
}

interface LeftPannelProps {
  onclose?: () => void;
  disableModal?: boolean;
  filters?: FilterState;
  onFilterChange?: (newFilters: Partial<FilterState>) => void;
  onResetFilters?: () => void;
  loading?: boolean;
}

export const LeftPannel: React.FC<LeftPannelProps> = ({
  onclose,
  disableModal = false,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [airlines, setAirlines] = useState<PackageAirline[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [loadingAirlines, setLoadingAirlines] = useState(false);
  const [checkboxKey, setCheckboxKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTransits, setSelectedTransits] = useState<string[]>([]);
  const [travelClasses, setTravelClasses] = useState<PackageClass[]>([]);
  const [loadingTravelClasses, setLoadingTravelClasses] = useState(false);
  const [selectedDepartureTime, setSelectedDepartureTime] = useState<string | null>(null);
  const [selectedArrivalTime, setSelectedArrivalTime] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Map time index to API value
  const getTimeApiValue = (index: number): string => {
    const timeMap: Record<number, string> = {
      0: 'night', // Night to Morning (00.00 - 06.00)
      1: 'morning', // Morning to Noon (06.00 - 12.00)
      2: 'afternoon', // Noon to Evening (12.00 - 18.00)
      3: 'evening', // Evening to Night (18.00 - 24.00)
    };

    return timeMap[index] || '';
  };

  // Reset internal state when filters are reset
  useEffect(() => {
    if (filters?.selectedAirlines?.length === 0) {
      setSelectedAirlines([]);
      setCheckboxKey((prev) => prev + 1); // Force re-render of checkboxes
    }

    if (filters?.departureTime?.length === 0) {
      setSelectedTransits([]);
    }

    // Sync selected times from filters
    if (filters?.departureTime && filters.departureTime.length > 0) {
      setSelectedDepartureTime(filters.departureTime[0]);
    } else {
      setSelectedDepartureTime(null);
    }

    if (filters?.arrivalTime && filters.arrivalTime.length > 0) {
      setSelectedArrivalTime(filters.arrivalTime[0]);
    } else {
      setSelectedArrivalTime(null);
    }
  }, [filters]);

  const handleToggleSelectAll = useCallback(() => {
    const currentSelectedAirlines = filters?.selectedAirlines || selectedAirlines;

    if (currentSelectedAirlines.length === airlines.length) {
      const newFilters = { selectedAirlines: [] };
      onFilterChange?.(newFilters);
      setSelectedAirlines([]);
      setEnabled(false);
    } else {
      const allIds = airlines.map((a) => a.iata_code);
      const newFilters = { selectedAirlines: allIds };
      onFilterChange?.(newFilters);
      setSelectedAirlines(allIds);
      setEnabled(true);
    }

    setCheckboxKey((prev) => prev + 1);
  }, [filters?.selectedAirlines, selectedAirlines, airlines, onFilterChange]);

  const handleCheckboxChange = useCallback(
    (airlineIataCode: string, checked: boolean) => {
      const currentSelectedAirlines = filters?.selectedAirlines || selectedAirlines;
      const newSelectedAirlines = checked
        ? [...currentSelectedAirlines, airlineIataCode]
        : currentSelectedAirlines.filter((code) => code !== airlineIataCode);

      const newFilters = { selectedAirlines: newSelectedAirlines };
      onFilterChange?.(newFilters);
      setSelectedAirlines(newSelectedAirlines);
    },
    [filters?.selectedAirlines, selectedAirlines, onFilterChange]
  );

  const handleTransitChange = useCallback(
    (transitValue: string, checked: boolean) => {
      const currentSelectedTransits = filters?.transit ? filters.transit.split(',') : selectedTransits;
      const newSelectedTransits = checked
        ? [...currentSelectedTransits, transitValue]
        : currentSelectedTransits.filter((value) => value !== transitValue);

      const newFilters = { transit: newSelectedTransits.join(',') };
      onFilterChange?.(newFilters);
      setSelectedTransits(newSelectedTransits);
    },
    [filters?.transit, selectedTransits, onFilterChange]
  );

  const handleTravelClassChange = useCallback(
    (className: string, checked: boolean) => {
      const newFilters = { travelClass: checked ? className : undefined };
      onFilterChange?.(newFilters);
    },
    [onFilterChange]
  );

  const handleDepartureTimeChange = useCallback(
    (index: number) => {
      const apiValue = getTimeApiValue(index);
      const newSelectedTime = selectedDepartureTime === apiValue ? null : apiValue;
      setSelectedDepartureTime(newSelectedTime);
      const newFilters = {
        departureTime: newSelectedTime ? [newSelectedTime] : [],
      };
      onFilterChange?.(newFilters);
    },
    [selectedDepartureTime, onFilterChange]
  );

  const handleArrivalTimeChange = useCallback(
    (index: number) => {
      const apiValue = getTimeApiValue(index);
      const newSelectedTime = selectedArrivalTime === apiValue ? null : apiValue;
      setSelectedArrivalTime(newSelectedTime);
      const newFilters = {
        arrivalTime: newSelectedTime ? [newSelectedTime] : [],
      };
      onFilterChange?.(newFilters);
    },
    [selectedArrivalTime, onFilterChange]
  );

  const handleDurationChange = useCallback(
    (durationRange: [number, number]) => {
      const newFilters = {
        durationRange,
      };
      onFilterChange?.(newFilters);
    },
    [onFilterChange]
  );

  const handleClose = useCallback(() => {
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
        if (onclose) onclose();
      },
    });
  }, [onclose]);

  // Fetch airlines from API
  const fetchAirlines = useCallback(async () => {
    setLoadingAirlines(true);

    try {
      const params: PackageAirlinesRequest = {};
      const airlinesData = await fetchPackageAirlines(params);
      setAirlines(airlinesData);
    } catch (error) {
      console.error('Failed to fetch airlines:', error);
      setAirlines([]);
    } finally {
      setLoadingAirlines(false);
    }
  }, []);

  // Fetch travel classes from API
  const fetchTravelClasses = useCallback(async () => {
    setLoadingTravelClasses(true);

    try {
      const params: PackageClassesRequest = {};
      const classesData = await fetchPackageClasses(params);
      setTravelClasses(classesData);
    } catch (error) {
      console.error('Failed to fetch travel classes:', error);
      setTravelClasses([]);
    } finally {
      setLoadingTravelClasses(false);
    }
  }, []);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }

    // Fetch airlines and travel classes when component mounts
    fetchAirlines();
    fetchTravelClasses();
  }, [fetchAirlines, fetchTravelClasses]);

  useEffect(() => {
    setEnabled(selectedAirlines.length === airlines.length && airlines.length > 0);
  }, [selectedAirlines, airlines]);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;

    if (!isDesktop && panelRef.current && overlayRef.current && !loading && !disableModal) {
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
  }, [loading, disableModal]);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    if (!loading && isMobile) {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [loading]);

  return loading ? (
    <LeftPannelSkeleton />
  ) : (
    <Fragment>
      {!disableModal && (
        <div
          ref={overlayRef}
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-[99999] invisible"
          onClick={handleClose}
        />
      )}

      <div
        ref={panelRef}
        className={`flex flex-col w-full ${disableModal ? 'relative' : 'xl:relative'} h-full ${disableModal ? '' : 'fixed xl:z-0 z-[100000] left-0 top-0'}`}
        style={{
          transform:
            !disableModal && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'translateX(-100%)' : 'none',
        }}
      >
        <div className="xl:flex justify-between hidden items-center">
          <div className="flex items-center gap-2 cursor-pointer text-neutral-50 dark:text-white">
            <FilterTicketIcon />
            Filter
          </div>
          <div
            onClick={onResetFilters}
            className="text-neutral-50 dark:text-Light font-medium cursor-pointer hover:text-white transition-colors"
          >
            Reset
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-50 border xl:overflow-visible xl:h-auto overflow-y-scroll h-full lg:rounded-2xl border-[#D9D9D9] dark:border-[#262626] xl:mt-5 flex flex-col">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col border-b border-[#D9D9D9] dark:border-b-[#262626] p-8 text-neutral-50 dark:text-white">
              <div className="font-medium text-base">No. of Transit</div>
              <div className="flex flex-col gap-3 mt-5">
                <CustomCheckbox
                  label="Direct Flight"
                  checked={(filters?.transit || '').includes('1')}
                  onChange={(checked) => handleTransitChange('1', checked)}
                />
                <CustomCheckbox
                  label="1 transit"
                  checked={(filters?.transit || '').includes('2')}
                  onChange={(checked) => handleTransitChange('2', checked)}
                />
                <CustomCheckbox
                  label="2+ transits"
                  checked={(filters?.transit || '').includes('3+')}
                  onChange={(checked) => handleTransitChange('3+', checked)}
                />
              </div>
            </div>
            <div className="flex flex-col border-b border-[#D9D9D9] dark:border-b-[#262626] p-8 text-neutral-50 dark:text-white">
              <div className="font-medium text-base">Travel Class</div>
              <div className="flex flex-col gap-3 mt-5">
                {loadingTravelClasses ? (
                  <div className="text-[#A3A3A3] text-sm">Loading travel classes...</div>
                ) : travelClasses.length > 0 ? (
                  travelClasses.map((travelClass) => (
                    <CustomCheckbox
                      key={travelClass.id}
                      label={travelClass.name}
                      checked={filters?.travelClass === travelClass.name}
                      onChange={(checked) => handleTravelClassChange(travelClass.name, checked)}
                    />
                  ))
                ) : (
                  <div className="text-[#A3A3A3] text-sm">No travel classes available</div>
                )}
              </div>
            </div>
            <div className="flex flex-col border-b border-[#D9D9D9] dark:border-b-[#262626] p-8 text-neutral-50 dark:text-white">
              <div className="font-medium text-base">Airlines</div>
              <div className="flex justify-between w-full mt-3">
                <div className="flex items-center text-[#A3A3A3]">Select all airlines</div>
                <div>
                  <ToggleSwitch enabled={enabled} onToggle={handleToggleSelectAll} />
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-5" key={checkboxKey}>
                {loadingAirlines ? (
                  <div className="text-[#A3A3A3] text-sm">Loading airlines...</div>
                ) : airlines.length > 0 ? (
                  airlines.map((airline) => (
                    <CustomCheckbox
                      key={airline.id}
                      label={airline.business_name || airline.common_name}
                      checked={(filters?.selectedAirlines || selectedAirlines).includes(airline.iata_code)}
                      onChange={(checked) => handleCheckboxChange(airline.iata_code, checked)}
                    />
                  ))
                ) : (
                  <div className="text-[#A3A3A3] text-sm">No airlines available</div>
                )}
              </div>
            </div>
            <div className="p-8 flex flex-col border-b border-[#D9D9D9] dark:border-b-[#262626]">
              <div className="text-neutral-50 dark:text-white font-medium text-base">Time</div>
              <div className="flex flex-col mt-3">
                <div className="text-[#A3A3A3]">Departure Time</div>
                <div className="flex justify-between flex-wrap items-center w-full gap-3 mt-3">
                  {DepartureTime.map((Departure, index) => {
                    const apiValue = getTimeApiValue(index);
                    const isSelected = selectedDepartureTime === apiValue;

                    return (
                      <div
                        key={index}
                        onClick={() => handleDepartureTimeChange(index)}
                        className={`w-[calc(50%_-_12px)] border flex flex-col gap-2 justify-center items-center rounded-xl py-3.5 px-4 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-Teal-500 bg-Teal-50 dark:bg-Teal-900/20'
                            : 'border-[#D9D9D9] dark:border-gray-150 hover:border-Teal-500/50'
                        }`}
                      >
                        <div className="text-sm text-neutral-50 dark:text-white font-medium">{Departure.day}</div>
                        <div className="text-sm text-Teal-900 dark:text-Teal-500 font-medium">{Departure.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col mt-5">
                <div className="text-[#A3A3A3]">Arrival Time</div>
                <div className="flex justify-between flex-wrap items-center w-full gap-3 mt-3">
                  {DepartureTime.map((Departure, index) => {
                    const apiValue = getTimeApiValue(index);
                    const isSelected = selectedArrivalTime === apiValue;

                    return (
                      <div
                        key={index}
                        onClick={() => handleArrivalTimeChange(index)}
                        className={`w-[calc(50%_-_12px)] border flex flex-col gap-2 justify-center items-center rounded-xl py-3.5 px-4 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-Teal-500 bg-Teal-50 dark:bg-Teal-900/20'
                            : 'border-[#D9D9D9] dark:border-gray-150 hover:border-Teal-500/50'
                        }`}
                      >
                        <div className="text-sm text-neutral-50 dark:text-white font-medium">{Departure.day}</div>
                        <div className="text-sm text-Teal-900 dark:text-Teal-500 font-medium">{Departure.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-8 flex flex-col border-b border-[#D9D9D9] dark:border-b-[#262626]">
              <FlightDurationSlider
                min={0}
                max={24}
                step={1}
                defaultValue={filters?.durationRange || [0, 24]}
                onChange={handleDurationChange}
              />
            </div>
            <div className="lg:hidden flex justify-end w-full sticky bottom-0 bg-gray-300 p-5">
              <div className="flex gap-3">
                <button
                  onClick={onResetFilters}
                  className="uppercase rounded-full bg-orange-200 text-black px-8 py-1 font-medium text-sm hover:bg-orange-300 transition-colors"
                >
                  Clear
                </button>
                <button className="uppercase rounded-full bg-Teal-500 text-white px-8 py-1 font-medium text-sm hover:bg-Teal-600 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
