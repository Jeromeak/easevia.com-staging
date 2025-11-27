import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CloseIcon, FlightFrom, LocationDropdownIcon } from '@/icons/icon';
import type { DestinationDropDownProps } from '@/lib/types/common.types';
import type { Airport, SubscriptionAirport } from '@/lib/types/api/booking';
import { getAirportCode } from '@/lib/types/api/booking';
import { AIRPORT_OPTIONS_BY_COUNTRY } from '../constants';

export const DestinationFromDropdown: React.FC<DestinationDropDownProps & { widthClass?: string }> = ({
  icon: Icon = FlightFrom,
  className,
  placeHolder = 'Search country or airport',
  iconPosition = 'left-0',
  iconColor = 'text-gray-200',
  widthClass = '',
  onChange,
  airports = [],
  value = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize with value prop
  useEffect(() => {
    if (value && airports.length > 0) {
      const airport = airports.find(
        (airport) => getAirportCode(airport) === value || airport.name === value || airport.city === value
      );

      if (airport) {
        const code = getAirportCode(airport);
        const displayValue = `${airport.name} (${code})`;
        setSelected(displayValue);
        setInputValue(displayValue);
      } else {
        setInputValue(value);
      }
    } else if (!value) {
      setSelected('');
      setInputValue('');
    }
  }, [value, airports]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleInputClick = useCallback(() => {
    setIsOpen(true);

    if (selected) {
      setSelected('');
      setInputValue('');
      setSelectedCountry('');
    }
  }, [selected]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  }, []);

  const handleClearCountry = useCallback(() => {
    setSelectedCountry('');
    setInputValue('');
  }, []);

  // Handle airport selection from API data
  const handleAirportSelect = useCallback(
    (airport: Airport | SubscriptionAirport) => {
      const code = getAirportCode(airport);
      const displayValue = `${airport.name} (${code})`;
      setSelected(displayValue);
      setInputValue(displayValue);
      setIsOpen(false);
      onChange?.(code);
    },
    [onChange]
  );

  // Filter airports from API if available
  const filteredAirports = useMemo(() => {
    if (airports.length === 0) return [];

    return airports.filter((airport: Airport | SubscriptionAirport) => {
      const code = getAirportCode(airport);
      const searchText = inputValue.toLowerCase();

      return (
        airport.name.toLowerCase().includes(searchText) ||
        airport.city.toLowerCase().includes(searchText) ||
        airport.country.toLowerCase().includes(searchText) ||
        code.toLowerCase().includes(searchText)
      );
    });
  }, [airports, inputValue]);

  const filteredCountries = useMemo(
    () =>
      Object.keys(AIRPORT_OPTIONS_BY_COUNTRY).filter((country) =>
        country.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [inputValue]
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          onClick={handleInputClick}
          onChange={handleInputChange}
          value={inputValue}
          placeholder={placeHolder}
          className={`pl-8 bg-transparent w-full outline-none text-neutral-50 dark:text-white${className ? ' ' + className : ''}`}
        />
        <div className={`absolute top-1/2 ${iconPosition} -translate-y-1/2`}>
          <Icon className={`text-base ${iconColor}`} />
        </div>
      </div>

      {isOpen && (
        <div
          className={`absolute px-[18px] md:max-w-[600px] md:min-w-[400px] scroll py-[28px] top-full mt-1 bg-white dark:bg-gray-300 shadow-12xl rounded-b-xl z-[1000000] max-h-80 overflow-y-auto text-white ${widthClass}`}
        >
          {/* Show API airports if available */}
          {airports.length > 0 && filteredAirports.length > 0 && (
            <div className="flex flex-col space-y-4 w-full mb-4">
              {filteredAirports.map((airport: Airport | SubscriptionAirport, idx: number) => {
                const code = getAirportCode(airport);

                return (
                  <div
                    key={`${airport.id || idx}-${code}`}
                    onClick={() => handleAirportSelect(airport)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-400 transition-colors"
                  >
                    <div className="flex flex-col">
                      <div className="text-lg text-neutral-50 dark:text-white leading-7 font-Futra">
                        {airport.city}, {airport.country}
                      </div>
                      <div className="text-sm font-normal text-[#A3A3A3]">
                        {airport.name} <span className="text-[#A3A3A3]">({code})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show hardcoded airports only if no API airports available */}
          {airports.length === 0 && (
            <>
              {selectedCountry && (
                <div className="flex sticky top-0 bg-gray-300 justify-between items-center">
                  <div className="flex items-center gap-2 text-lg text-white pb-2">
                    <LocationDropdownIcon />
                    {selectedCountry}
                  </div>
                  <div onClick={handleClearCountry} className="cursor-pointer">
                    <CloseIcon />
                  </div>
                </div>
              )}

              {!selectedCountry && inputValue === '' && filteredCountries.length > 0 && (
                <div>
                  <div className="flex flex-col space-y-6 w-full mb-4">
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="flex flex-col">
                        <div className="text-lg text-neutral-50 dark:text-white leading-7 font-Futra">
                          Chennai, India
                        </div>
                        <div className="text-sm font-normal text-[#A3A3A3]">
                          Chennai International Airport <span className="text-[#A3A3A3]">(MAA)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="flex flex-col">
                        <div className="text-lg text-neutral-50 dark:text-white leading-7 font-Futra">Dubai, UAE</div>
                        <div className="text-sm font-normal text-[#A3A3A3]">
                          Dubai International Airport <span className="text-[#A3A3A3]">(DXB)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="flex flex-col">
                        <div className="text-lg text-neutral-50 dark:text-white leading-7 font-Futra">Singapore</div>
                        <div className="text-sm font-normal text-[#A3A3A3]">
                          Singapore Changi Airport <span className="text-[#A3A3A3]">(SIN)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="flex flex-col">
                        <div className="text-lg text-neutral-50 dark:text-white leading-7 font-Futra">
                          Kuala Lumpur, Malaysia
                        </div>
                        <div className="text-sm font-normal text-[#A3A3A3]">
                          Kuala Lumpur International Airport <span className="text-[#A3A3A3]">(KUL)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* No results message */}
          {airports.length > 0 && filteredAirports.length === 0 && inputValue !== '' && (
            <div className="px-4 py-2 text-sm text-[#A3A3A3]">No airports found matching "{inputValue}"</div>
          )}
        </div>
      )}
    </div>
  );
};
