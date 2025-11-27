'use client';
import { OneWayIcon, RoundTripIcon } from '@/icons/icon';
import { useCallback, useState } from 'react';
import { TripForm } from './TripForm';
import { TripType } from '@/lib/types/common.types';
import clsx from 'clsx';

export const FindTicket = () => {
  const [activeTab, setActiveTab] = useState<TripType>(TripType.ONEWAY);
  const isEnabled = activeTab === TripType.ROUND_TRIP;

  const handleToggleSwitch = useCallback(() => {
    setActiveTab((prev) => (prev === TripType.ONEWAY ? TripType.ROUND_TRIP : TripType.ONEWAY));
  }, []);

  const handleSetOneWay = useCallback(() => setActiveTab(TripType.ONEWAY), []);
  const handleSetRoundTrip = useCallback(() => setActiveTab(TripType.ROUND_TRIP), []);

  const getButtonClass = (tab: TripType) =>
    clsx(
      'w-full gap-3 flex justify-center text-base font-medium leading-[23px] border-b-2 cursor-pointer pb-3 items-center',
      activeTab === tab
        ? 'text-Teal-900 border-b-Teal-900'
        : 'text-gray-200 border-b-[#D8D8D8] dark:border-b-transparent'
    );

  return (
    <div className="bg-white dark:bg-transparent dark:lg:bg-secondary w-full rounded-2xl shadow-7xl p-3 md:p-6">
      <div className="flex gap-2 xl:gap-0">
        <div className="w-[50%]">
          <button onClick={handleSetOneWay} className={getButtonClass(TripType.ONEWAY)}>
            <div>
              <OneWayIcon />
            </div>
            <div>One Way</div>
          </button>
        </div>
        <div className="w-[50%]">
          <button onClick={handleSetRoundTrip} className={getButtonClass(TripType.ROUND_TRIP)}>
            <div>
              <RoundTripIcon />
            </div>
            <div>Round Trip</div>
          </button>
        </div>
      </div>
      <TripForm type={activeTab} onToggle={handleToggleSwitch} isEnabled={isEnabled} />
    </div>
  );
};
