'use client';
import { ArrowDown, CompleteIcon, UpcomingIcon } from '@/icons/icon';
import { FlightList } from './FlightList';
import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import { RightPannelSkeleton } from './RightPannelSkeleton';
import React from 'react';
import { LeftPannel } from './LeftPannel';
import clsx from 'clsx';
import { DestinationType } from '@/lib/types/common.types';
import type { FlightSearchResponse } from '@/lib/types/api/booking';

interface FlightSearchData {
  outbound: FlightSearchResponse['outbound'];
  return?: FlightSearchResponse['return'];
  searchParams: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    trip_type: string;
    subscription_id: string;
    adult: number;
    child?: number;
    infant?: number;
  };
}

interface RightPannelProps {
  flightData?: FlightSearchData | null;
  loading?: boolean;
}

const sortOptions = [
  {
    title: 'Fastest',
    subtitle: 'Fastest first',
    value: 'fastest',
  },
  {
    title: 'Departure time',
    subtitle: 'Earliest first',
    value: 'departure',
  },
  {
    title: 'Arrival time',
    subtitle: 'Earliest First',
    value: 'arrival',
  },
  {
    title: 'Stops',
    subtitle: 'Fewest stops first',
    value: 'stops',
  },
];

export const RightPannel: React.FC<RightPannelProps> = ({ flightData, loading: externalLoading = false }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<DestinationType>(DestinationType.FROM);
  const [currentFlightTab, setCurrentFlightTab] = useState<'outbound' | 'return'>('outbound');

  // Determine if this is a round trip
  const isRoundTrip =
    flightData?.searchParams?.trip_type === 'ROUND_TRIP' && flightData?.return && flightData.return.length > 0;

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [showSortModal, setShowSortModal] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const selectedLabel = sortOptions.find((s) => s.value === selectedSort)?.title || 'Sort by';

  useEffect(() => {
    if (externalLoading) {
      setLoading(true);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [externalLoading]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleFilterClose = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const handleDropdownToggle = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const handleSortModalClose = useCallback(() => {
    setShowSortModal(false);
  }, []);

  const handleTabClick = useCallback((tab: DestinationType) => {
    setActiveTab(tab);
    // Update flight tab based on destination tab
    setCurrentFlightTab(tab === DestinationType.FROM ? 'outbound' : 'return');
  }, []);

  const handleFlightTabChange = useCallback((tab: 'outbound' | 'return') => {
    setCurrentFlightTab(tab);
    // Update destination tab based on flight tab
    setActiveTab(tab === 'outbound' ? DestinationType.FROM : DestinationType.TO);
  }, []);

  const handleSortOptionSelect = useCallback((value: string) => {
    setSelectedSort(value);
    setShowDropdown(false);
    setShowSortModal(false);
  }, []);

  const handleSortOptionClick = useCallback(
    (value: string) => () => {
      handleSortOptionSelect(value);
    },
    [handleSortOptionSelect]
  );

  const handleTabClickFactory = useCallback(
    (tab: DestinationType) => () => {
      handleTabClick(tab);
    },
    [handleTabClick]
  );

  const handleSortOptionClickFactory = useCallback(
    (value: string) => () => {
      handleSortOptionClick(value);
    },
    [handleSortOptionClick]
  );

  return loading ? (
    <RightPannelSkeleton />
  ) : (
    <Fragment>
      <div className="flex flex-col w-full">
        <div className="flex justify-end items-center w-full mb-2">
          <div className="relative lg:block hidden" ref={dropdownRef}>
            <button
              type="button"
              role="button"
              onClick={handleDropdownToggle}
              className="flex gap-3 duration-500 tracking-wider hover:text-white hover:bg-Teal-900 border rounded-full py-2.5 font-semibold leading-5 text-[#A3A3A3] px-6 border-Teal-500 h-fit cursor-pointer justify-center items-center"
            >
              <div>{selectedLabel}</div>
              <ArrowDown
                className={clsx('transition-transform duration-300 text-Teal-500', { 'rotate-180': showDropdown })}
              />
            </button>
            <div
              className={clsx(
                'absolute top-full right-0 mt-2 w-60 overflow-hidden rounded-xl shadow-12xl p-7 bg-white dark:bg-gray-300 transition-all duration-300 ease-in-out',
                {
                  'max-h-80 opacity-100 z-10': showDropdown,
                  'max-h-0 opacity-0 z-[-1]': !showDropdown,
                }
              )}
            >
              <div className="flex flex-col gap-5">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={handleSortOptionClickFactory(option.value)}
                    className={clsx('flex flex-col text-lg cursor-pointer hover:text-Teal-500 duration-500', {
                      'text-Teal-500': selectedSort === option.value,
                      'text-[#A3A3A3]': selectedSort !== option.value,
                    })}
                  >
                    <div>{option.title}</div>
                    <div className="text-xs">{option.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between lg:items-center w-full mb-3 lg:mb-6">
          <div>
            <div className="uppercase text-[#737373] text-xl md:text-32 font-Neutra font-normal opacity-80">
              Departure to{' '}
              <span className="text-neutral-50 dark:text-white font-semibold">
                {flightData?.searchParams?.destination || 'Dubai'}
              </span>
            </div>
          </div>
          <div className="text-neutral-50 dark:text-white font-Futra text-sm font-normal lg:pt-4">
            {flightData?.searchParams?.departure_date
              ? new Date(flightData.searchParams.departure_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Saturday, 12 July 2025'}
          </div>
        </div>
        {/* Show tabs only for round trips, or always show for one-way trips */}
        {isRoundTrip ? (
          <div className="flex w-full justify-between bg-Teal-100 dark:bg-gray-360 p-1.5 rounded-[8.815px]">
            <button
              onClick={handleTabClickFactory(DestinationType.FROM)}
              className={clsx(
                'w-1/2 cursor-pointer duration-500 uppercase py-3 gap-2 rounded-[8.815px] shadow-11xl text-center flex items-center justify-center px-3 lg:px-[17.139px]',
                activeTab === DestinationType.FROM
                  ? 'bg-white dark:bg-[#161616] text-neutral-50 dark:text-white'
                  : 'bg-transparent text-[#5D5D5D]'
              )}
            >
              <UpcomingIcon className="md:h-[25px] w-[15px] h-[15px] md:w-[25px]" />
              <div className="text-xs md:text-xl">
                {flightData?.searchParams
                  ? `${flightData.searchParams.origin} to ${flightData.searchParams.destination}`
                  : 'Singapore to Dubai'}
              </div>
            </button>
            <button
              onClick={handleTabClickFactory(DestinationType.TO)}
              className={clsx(
                'w-1/2 cursor-pointer duration-500 uppercase py-3 gap-2 rounded-[8.815px] shadow-11xl text-center flex items-center justify-center px-[17.139px]',
                activeTab === DestinationType.TO
                  ? 'bg-white dark:bg-[#161616] text-neutral-50 dark:text-white'
                  : 'bg-transparent text-[#5D5D5D]'
              )}
            >
              <CompleteIcon className="md:h-[25px] w-[15px] h-[15px] md:w-[25px]" />
              <div className="text-xs md:text-xl">
                {flightData?.searchParams
                  ? `${flightData.searchParams.destination} to ${flightData.searchParams.origin}`
                  : 'Dubai to Singapore'}
              </div>
            </button>
          </div>
        ) : (
          // For one-way trips, show a single tab with full width
          <div className="flex w-full justify-center bg-Teal-100 dark:bg-gray-360 p-1.5 rounded-[8.815px]">
            <div className="w-full bg-white dark:bg-[#161616] text-neutral-50 dark:text-white py-3 gap-2 rounded-[8.815px] shadow-11xl text-center flex items-center justify-center px-3 lg:px-[17.139px]">
              <UpcomingIcon className="md:h-[25px] w-[15px] h-[15px] md:w-[25px]" />
              <div className="text-xs md:text-xl">
                {flightData?.searchParams
                  ? `${flightData.searchParams.origin} to ${flightData.searchParams.destination}`
                  : 'Singapore to Dubai'}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col mt-8 ">
          <FlightList flightData={flightData} activeTab={currentFlightTab} onTabChange={handleFlightTabChange} />
        </div>
      </div>
      {isFilterOpen && <LeftPannel onclose={handleFilterClose} />}
      {showSortModal && (
        <div className="fixed inset-0 z-[100000] flex items-end xl:hidden">
          <div className="absolute h-[60vh] inset-0 bg-black/60" onClick={handleSortModalClose} />
          <div className="w-full h-[40vh] bg-gray-300 p-7 pb-10 animate-slide-up">
            <div className="flex flex-col gap-5">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={handleSortOptionClickFactory(option.value)}
                  className={clsx('flex flex-col text-lg cursor-pointer hover:text-Teal-500 duration-500', {
                    'text-Teal-500': selectedSort === option.value,
                    'text-[#A3A3A3]': selectedSort !== option.value,
                  })}
                >
                  <div>{option.title}</div>
                  <div className="text-xs">{option.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
