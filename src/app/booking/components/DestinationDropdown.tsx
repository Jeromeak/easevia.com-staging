import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ArrowSwapIcon, FlightFrom, LocationDropdownIcon } from '@/icons/icon';
import type { DestinationDropDownProps, RecentSearch } from '@/lib/types/common.types';
import type { Airport, SubscriptionAirport } from '@/lib/types/api/booking';
import { getAirportCode } from '@/lib/types/api/booking';
import clsx from 'clsx';
import { fetchCitiesOnce } from '@/services/cityCache';
import type { City } from '@/lib/types/api/city';

export const DestinationDropDown: React.FC<DestinationDropDownProps> = ({
  icon: Icon = FlightFrom,
  className,
  placeHolder = 'Search country or airport',
  iconPosition = 'left-0',
  iconColor = 'text-gray-200',
  onChange,
  useCities = false,
  preventList = [],
  airports = [],
  value = '',
  WidthClass = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [recentSearches] = useState<RecentSearch[]>([
    {
      from: 'Singapore',
      fromCode: 'SIN',
      to: 'Dubai',
      toCode: 'DXB',
      startDate: '12 Jul',
      endDate: '16 Jul',
      passengers: 1,
    },
    { from: 'Singapore', fromCode: 'SIN', to: 'Dubai', toCode: 'DXB', startDate: '10 Jul', endDate: '12 Jul' },
    { from: 'India', fromCode: 'DEL', to: 'United States', toCode: 'JFK', startDate: '15 Aug', endDate: '22 Aug' },
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    //* Fetch cities once if needed
    if (useCities) {
      setLoadingCities(true);
      fetchCitiesOnce()
        .then((data) => setCities(data))
        .finally(() => setLoadingCities(false));
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside, useCities]);

  // Initialize component with value prop
  useEffect(() => {
    if (value) {
      // Find the airport from the airports array to get the full name
      const airport = airports.find(
        (airport) => getAirportCode(airport) === value || airport.name === value || airport.city === value
      );

      if (airport) {
        // Display full airport name with code
        const code = getAirportCode(airport);
        const displayValue = `${airport.name} (${code})`;
        setSelected(displayValue);
        setInputValue(displayValue);
      } else {
        // Fallback to the raw value if airport not found
        setSelected(value);
        setInputValue(value);
      }
    }
  }, [value, airports]);

  const handleSelectAirport = useCallback(
    (airportCode: string) => {
      // Find the airport to get the full name for display
      const airport = airports.find((airport) => getAirportCode(airport) === airportCode);

      if (airport) {
        // Display full airport name with code
        const code = getAirportCode(airport);
        const displayValue = `${airport.name} (${code})`;
        setSelected(displayValue);
        setInputValue(displayValue);
      } else {
        // Fallback to the airport code if airport not found
        setSelected(airportCode);
        setInputValue(airportCode);
      }

      setIsOpen(false);
      // Always return the airport code to the parent component
      onChange(airportCode);
    },
    [onChange, airports]
  );
  const handleRecentSelect = useCallback((item: RecentSearch) => {
    const label = `${item.from} (${item.fromCode}) → ${item.to} (${item.toCode})`;
    setInputValue(label);
    setSelected(label);
    setIsOpen(false);
  }, []);

  const handleRecentSelectCallback = useCallback(
    (item: RecentSearch) => () => handleRecentSelect(item),
    [handleRecentSelect]
  );

  const handleInputClick = useCallback(() => {
    setIsOpen(true);

    if (selected) {
      setSelected('');
      setInputValue('');
    }
  }, [selected]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  }, []);

  // Simple filtering for subscription airports
  const filteredSubscriptionAirports = useMemo(() => {
    if (!airports || airports.length === 0) return [];

    return airports.filter((airport: Airport | SubscriptionAirport) => {
      const code = getAirportCode(airport);

      return `${airport.name} ${airport.city} ${airport.country} ${code}`
        .toLowerCase()
        .includes(inputValue.toLowerCase());
    });
  }, [airports, inputValue]);

  // For city mode - memoized to prevent unnecessary recalculations
  const filteredCities = useMemo(() => {
    if (!useCities) return [];

    return cities
      .filter((c) => !preventList.includes(String(c.id)))
      .filter((c) => `${c.name}`.toLowerCase().includes(inputValue.toLowerCase()));
  }, [useCities, cities, preventList, inputValue]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative w-full">
        <input
          type="text"
          onClick={handleInputClick}
          onChange={handleInputChange}
          value={inputValue}
          placeholder={placeHolder}
          className={clsx(
            'pl-8 dark:bg-transparent w-full text-xs md:text-base outline-none text-neutral-50 dark:text-white placeholder:text-black dark:placeholder:text-white',
            className
          )}
        />
        <div className={clsx('absolute top-1/2', iconPosition, '-translate-y-1/2')}>
          <Icon className={clsx('text-base', iconColor)} />
        </div>
      </div>

      {isOpen && (
        <div
          className={clsx(
            'absolute px-4.5 md:max-w-[600px] md:min-w-[400px] scroll py-7 right-[-28px] md:-right-5 top-full mt-1 w-full bg-white dark:bg-gray-300 shadow-12xl rounded-b-xl z-[1000000] max-h-[250px] overflow-y-auto text-neutral-50 dark:text-white',
            WidthClass
          )}
        >
          {/* Recent Searches */}
          {!useCities && inputValue === '' && recentSearches.length > 0 && (
            <div>
              {recentSearches.map((item, idx) => (
                <div
                  key={idx}
                  onClick={handleRecentSelectCallback(item)}
                  className="flex flex-col gap-1 mb-4 cursor-pointer"
                >
                  <div className="flex justify-around items-center text-neutral-50 dark:text-white text-base font-medium">
                    <span className="flex items-start gap-2">
                      {item.from} <span className="text-[#A3A3A3]">({item.fromCode})</span>
                    </span>
                    <span className="flex items-center text-center text-[#00CBCB] dark:text-teal-400">
                      <ArrowSwapIcon />
                    </span>
                    <span className="flex items-end gap-2">
                      {item.to} <span className="text-[#A3A3A3]">({item.toCode})</span>{' '}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Subscription Airports - Direct from API */}
          {!useCities && airports && airports.length > 0 && (
            <>
              <div className="pb-1 mt-2 text-lg text-[#A3A3A3]">
                {inputValue === '' ? 'Available Airports' : 'Search Results'}
              </div>
              {filteredSubscriptionAirports.map((airport: Airport | SubscriptionAirport, idx: number) => {
                const code = getAirportCode(airport);

                return (
                  <div
                    key={`${airport.id}-${idx}`}
                    onClick={() => handleSelectAirport(code)}
                    className="px-4 py-2 cursor-pointer flex justify-between hover:bg-gray-400 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1">
                        <LocationDropdownIcon />
                      </div>
                      <div className="flex flex-col text-xl">
                        {airport.name} ({code})
                        <div className="text-xs text-[#A3A3A3]">
                          {airport.city}, {airport.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[#A3A3A3]">{code}</div>
                  </div>
                );
              })}
            </>
          )}

          {/* Cities Mode */}
          {useCities && (
            <>
              {loadingCities && <div className="px-2 py-1 text-sm text-[#A3A3A3]">Loading cities...</div>}
              {!loadingCities && filteredCities.length === 0 && (
                <div className="px-2 py-1 text-sm text-[#A3A3A3]">No cities</div>
              )}
              {!loadingCities &&
                filteredCities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => {
                      const label = `${city.name}`;
                      setSelected(label);
                      setInputValue(label);
                      setIsOpen(false);
                      onChange(String(city.id));
                    }}
                    className="px-4 py-2 cursor-pointer flex justify-between"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1">
                        <LocationDropdownIcon />
                      </div>
                      <div className="flex flex-col text-xl">{city.name}</div>
                    </div>
                  </div>
                ))}
            </>
          )}

          {/* No Results Message */}
          {!useCities &&
            airports &&
            airports.length > 0 &&
            filteredSubscriptionAirports.length === 0 &&
            inputValue !== '' && (
              <div className="px-4 py-2 text-sm text-[#A3A3A3]">No airports found matching "{inputValue}"</div>
            )}
        </div>
      )}
    </div>
  );
};
