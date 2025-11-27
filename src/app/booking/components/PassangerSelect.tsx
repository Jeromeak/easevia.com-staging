import { ArrowDown, PassengerIcon } from '@/icons/icon';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { PassengerType } from '@/lib/types/common.types';
import { PASSENGER_OPTIONS, PASSENGER_LIMIT } from '../constants';

interface PassengerSelectorProps {
  passengers?: Record<PassengerType, number>;
  onPassengersChange?: (passengers: Record<PassengerType, number>) => void;
  MarginClass?: string; // For backward compatibility
}

export const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  passengers: externalPassengers,
  onPassengersChange,
  MarginClass = 'mt-4',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalPassengers, setInternalPassengers] = useState<Record<PassengerType, number>>({
    [PassengerType.ADULT]: 0,
    [PassengerType.CHILD]: 0,
    [PassengerType.INFANT]: 0,
  });

  // Use external passengers if provided, otherwise use internal state
  const passengers = externalPassengers || internalPassengers;
  const setPassengers = onPassengersChange || setInternalPassengers;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const updateCount = useCallback(
    (type: PassengerType, delta: number) => {
      const newCount = passengers[type] + delta;
      const currentTotal =
        passengers[PassengerType.ADULT] + passengers[PassengerType.CHILD] + passengers[PassengerType.INFANT];
      const newTotal = currentTotal - passengers[type] + newCount;

      // Only allow update if new total doesn't exceed limit and count is non-negative
      if (newCount >= 0 && newTotal <= PASSENGER_LIMIT) {
        const updatedPassengers = {
          ...passengers,
          [type]: newCount,
        };
        setPassengers(updatedPassengers);
      }
    },
    [passengers, setPassengers]
  );

  const totalPassengers = useMemo(() => {
    return passengers[PassengerType.ADULT] + passengers[PassengerType.CHILD] + passengers[PassengerType.INFANT];
  }, [passengers]);

  const displayText = useMemo(() => {
    if (totalPassengers === 0) return 'Select Passengers';

    return `${totalPassengers} Passenger${totalPassengers > 1 ? 's' : ''}`;
  }, [totalPassengers]);

  const inputClass = useMemo(
    () =>
      clsx(
        'w-full pl-5 pr-2 py-2 outline-none rounded cursor-pointer',
        totalPassengers === 0 ? 'text-[#8E8E8E]' : 'text-neutral-50 dark:text-white'
      ),
    [totalPassengers]
  );

  const dropdownClass = useMemo(
    () =>
      clsx(
        'absolute left-0 mt-2 w-full shadow-12xl bg-white dark:bg-gray-300 text-neutral-50 dark:text-white rounded-b-xl px-4 pt-4 pb-4 z-[9999] overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      ),
    [isOpen]
  );

  const arrowClass = useMemo(() => clsx(isOpen ? 'rotate-180' : 'rotate-0'), [isOpen]);

  return (
    <div className={clsx('relative inline-block w-full md:w-64 xl:w-50')} ref={dropdownRef}>
      <div className={clsx('relative', MarginClass)}>
        <input type="text" readOnly onClick={toggleDropdown} value={displayText} className={inputClass} />
        <div className="absolute top-1/2  -translate-y-1/2">
          <PassengerIcon />
        </div>
        <div
          onClick={toggleDropdown}
          className="absolute right-1 xl:right-0 duration-500 -translate-1/2 top-1/2 cursor-pointer"
        >
          <ArrowDown className={arrowClass} />
        </div>
      </div>
      <div className={dropdownClass}>
        <div className="space-y-4">
          {PASSENGER_OPTIONS.map((option) => {
            const count = passengers[option.key] || 0;

            return (
              <div key={option.key} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-neutral-50 dark:text-white text-sm font-medium">{option.label}</div>
                  <div className="text-[#9EA2AD] text-xs">{option.sub}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateCount(option.key, -1)}
                    disabled={count === 0}
                    className={clsx(
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all duration-200',
                      count === 0
                        ? 'border-[#8E8E8E] text-[#8E8E8E] cursor-not-allowed'
                        : 'border-Teal-500 text-Teal-500 hover:bg-Teal-500 hover:text-white cursor-pointer'
                    )}
                  >
                    -
                  </button>
                  <span className="text-neutral-50 dark:text-white text-base font-medium min-w-[20px] text-center">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCount(option.key, 1)}
                    disabled={totalPassengers >= PASSENGER_LIMIT}
                    className={clsx(
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all duration-200',
                      totalPassengers >= PASSENGER_LIMIT
                        ? 'border-[#8E8E8E] text-[#8E8E8E] cursor-not-allowed'
                        : 'border-Teal-500 text-Teal-500 hover:bg-Teal-500 hover:text-white cursor-pointer'
                    )}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
