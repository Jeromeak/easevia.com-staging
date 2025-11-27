import { ArrowDown, PersonIcon } from '@/icons/icon';
import clsx from 'clsx';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

interface PassengerCounts {
  adult: number;
  child: number;
  infant: number;
}

interface CountDropdownProps {
  initialPassengerCounts?: PassengerCounts;
  onPassengerCountChange?: (counts: PassengerCounts) => void;
}

export const CountDropdown = ({
  initialPassengerCounts = { adult: 1, child: 0, infant: 0 },
  onPassengerCountChange,
}: CountDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passengers, setPassengers] = useState<PassengerCounts>(initialPassengerCounts);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Update passenger count when initial value changes
  useEffect(() => {
    setPassengers(initialPassengerCounts);
  }, [initialPassengerCounts]);

  // Call callback when passenger count changes
  useEffect(() => {
    onPassengerCountChange?.(passengers);
  }, [passengers, onPassengerCountChange]);

  const updateCount = useCallback((type: keyof PassengerCounts, delta: number) => {
    setPassengers((prev) => {
      const newCount = prev[type] + delta;

      return {
        ...prev,
        [type]: Math.max(0, Math.min(9, newCount)),
      };
    });
  }, []);

  const displayText = useMemo(() => {
    const total = passengers.adult + passengers.child + passengers.infant;

    return total.toString();
  }, [passengers]);

  return (
    <div className="relative inline-block md:w-fit w-full" ref={dropdownRef}>
      <div className="relative md:w-fit w-full">
        <input
          type="text"
          readOnly
          onClick={toggleDropdown}
          value={displayText}
          className="bg-blue-150 dark:bg-neutral-50 w-full md:w-44 rounded-full outline-none border border-blue-150 dark:border-black pl-12 pr-8 py-2 "
        />
        <div className="absolute top-1/2 left-5  -translate-y-1/2 text-[#28272D] dark:text-gray-50">
          <PersonIcon />
        </div>
        <div onClick={toggleDropdown} className="absolute right-1 duration-500 -translate-1/2 top-1/2 cursor-pointer">
          <ArrowDown className={clsx({ 'rotate-180': isOpen, 'rotate-0': !isOpen })} />
        </div>
      </div>
      <div
        className={clsx(
          'absolute left-0 mt-2 w-44 shadow-12xl bg-white dark:bg-gray-300 text-white rounded-xl px-4 pt-4 pb-4 overflow-hidden transition-all duration-300 ease-in-out',
          {
            'max-h-[500px] opacity-100 z-[9999]': isOpen,
            'max-h-0 opacity-0 z-[-1]': !isOpen,
          }
        )}
      >
        <div className="space-y-3">
          {(
            [
              { label: 'Adult', key: 'adult' },
              { label: 'Child', key: 'child' },
              { label: 'Infant', key: 'infant' },
            ] as const
          ).map((p) => (
            <div key={p.key} className="flex items-center justify-between">
              <div className="text-black">{p.label}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateCount(p.key, -1)}
                  className="w-6 h-6 rounded-full border flex items-center justify-center"
                  disabled={passengers[p.key] === 0}
                >
                  -
                </button>
                <div className="text-black w-5 text-center">{passengers[p.key]}</div>
                <button
                  type="button"
                  onClick={() => updateCount(p.key, 1)}
                  className="w-6 h-6 rounded-full border flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
