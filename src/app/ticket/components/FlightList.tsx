'use client';
import {
  ArrowDown,
  BagIcon,
  BeverageIcon,
  BoeingIcon,
  LayoutIcon,
  LuggageIcon,
  MealIcon,
  MovieIcon,
  PlaneIcon,
  SingaporeAirlineIcon,
  SingaporeIcon,
} from '@/icons/icon';
import type { FlightItemProps } from '@/lib/types/common.types';
import type { FlightSearchResponse, FlightItem } from '@/lib/types/api/booking';
import clsx from 'clsx';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { setSelectedFlightData, getSelectedFlightData } from '@/utils/sessionStorage';
import type { SelectedFlightData } from '@/lib/types/sessionStorage';
import { extractFlightData } from '@/utils/flightUtils';

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

interface FlightListProps {
  flightData?: FlightSearchData | null;
  activeTab?: 'outbound' | 'return';
  onTabChange?: (tab: 'outbound' | 'return') => void;
  onBothFlightsSelected?: () => void;
}

interface FlightItemWithDataProps extends FlightItemProps {
  apiData?: FlightItem | null;
  segmentId?: string;
  onSelectFlight?: (index: number) => void;
  formatDate?: (isoString: string) => string;
  formatTime?: (isoString: string) => string;
}

const FlightItem: React.FC<FlightItemWithDataProps> = ({
  isOpen,
  onClick,
  flightName,
  flightTime,
  index,
  apiData,
  segmentId,
  onSelectFlight,
  formatDate,
  formatTime,
}) => {
  // Extract flight data from the new API structure
  const flightData = apiData ? extractFlightData(apiData) : null;

  // Get departure and arrival dates from extracted flight data
  const departureDate = flightData && formatDate ? formatDate(flightData.departure_time) : '18 Apr';
  const arrivalDate = flightData && formatDate ? formatDate(flightData.arrival_time) : '18 Apr';

  // Get departure and arrival times from extracted flight data
  const departureTime = flightData && formatTime ? formatTime(flightData.departure_time) : '06:45';
  const arrivalTime = flightData && formatTime ? formatTime(flightData.arrival_time) : flightTime;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'cursor-pointer border border-neutral-50/10 dark:border-gray-150 rounded-[14px] p-4 lg:p-6 mb-4 transition-all duration-500 ease-in-out',
        {
          'bg-white dark:!bg-[#1F1F1F]': index % 2 === 0,
          'bg-white dark:!bg-neutral-50': index % 2 !== 0,
        }
      )}
    >
      <div className="flex lg:flex-row flex-col justify-between items-center gap-6 w-full">
        <div className="w-full md:w-[calc(20%_-_8px)] lg:w-[calc(22%_-_16px)] flex items-center gap-2">
          <div className="hidden gap-1 lg:flex items-center ">
            <SingaporeAirlineIcon width="60" height="60" />
            <div className="flex flex-col gap-1">
              <div className="rounded-[25.07px] text-center text-[10px] dark:bg-neutral-180 py-1 font-medium text-[#A4A4A4] px-3">
                {flightData?.flightNumber || segmentId || 'SA 8092'}
              </div>
              <div className="uppercase text-base text-neutral-50 dark:text-white">
                {flightData?.airline || flightName}
              </div>
              <div className="text-xs uppercase text-[#A3A3A3] tracking-wide gap-1 flex items-center">
                Include
                <div className="flex items-center gap-1 text-Teal-500">
                  <LuggageIcon width="12" height="12" />
                  <BagIcon width="12" height="12" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[calc(60%_-_8px)] flex flex-col  items-center">
          <div className="flex justify-between w-full items-center ">
            <div className="text-[#A3A3A3] text-xs md:text-sm">{departureDate}</div>
            <div className="text-[#A3A3A3] text-xs md:text-sm">{arrivalDate}</div>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="text-xl md:text-2xl text-neutral-50 dark:text-white font-medium">{departureTime}</div>
            <div className="w-[60%] lg:w-[calc(78%_-_8px)] flex justify-between gap-2 items-center lg:px-2">
              <div className="border w-[calc(50%_-_4px)] relative border-[#94A3B8] border-dashed">
                <div className="w-2 h-2 rounded-full bg-[#94A3B8] top-1/2 -translate-y-1/2 left-[-2%] lg:left-[-1%] absolute" />
              </div>
              <div className=" flex justify-center ml-2">
                <PlaneIcon className="text-[#94A3B8] lg:w-[40px] lg:h-[40px] w-6 h-6" />
              </div>
              <div className="border w-[calc(50%_-_4px)] border-dashed border-[#94A3B8]  relative">
                <div className="w-2 h-2 rounded-full bg-[#94A3B8] top-1/2 -translate-y-1/2 right-[-1%] absolute" />
              </div>
            </div>
            <div className="text-xl md:text-2xl text-neutral-50 dark:text-white font-medium">{arrivalTime}</div>
          </div>
          <div className="flex justify-between w-full items-center ">
            <div className="text-[#A3A3A3] text-xs md:text-sm">{flightData?.departure_airport || 'CGK'}</div>
            <div className="text-[#A3A3A3] text-xs md:text-sm flex items-center gap-2">
              <div>{flightData?.duration || '1h 50min'}</div>
              <div className="w-1 h-1 rounded-full bg-[#A3A3A3]"></div>
              <div>{flightData ? (flightData.isDirect ? 'Direct Flight' : 'Non-direct Flight') : 'Direct Flight'}</div>
            </div>
            <div className="text-[#A3A3A3] text-xs md:text-sm">{flightData?.arrival_airport || 'DXB'}</div>
          </div>
        </div>
        <div className="w-full hidden md:w-[calc(18%_-_8px)] justify-end gap-3 lg:flex items-center">
          <button
            type="button"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectFlight?.(index);
            }}
            className="lg:py-2 py-0.5 px-3 md:text-base text-[10px] lg:px-6 cursor-pointer hover:bg-transparent border border-transparent hover:border-Teal-500 duration-500 hover:text-Teal-500 uppercase text-white bg-Teal-500 rounded-full"
          >
            Select
          </button>
          <div>
            <ArrowDown className={clsx('text-Teal-500 duration-500 transition-all', { 'rotate-180': isOpen })} />
          </div>
        </div>
        <div className="w-full lg:hidden flex justify-between ">
          <div className="lg:hidden gap-1 flex items-center ">
            <SingaporeAirlineIcon width="30" height="40" />
            <div className="flex flex-col gap-1">
              <div className="rounded-[25.07px] text-center text-[9px] dark:bg-neutral-180 py-0.5 w-fit font-medium text-[#A4A4A4] dark:px-3">
                SA 8092
              </div>
              <div className="uppercase text-xs">{flightName}</div>
              <div className="text-xs uppercase text-[#A3A3A3] tracking-wide gap-1 flex items-center">
                Include
                <div className="flex items-center gap-1 text-Teal-500">
                  <LuggageIcon width="12" height="12" />
                  <BagIcon width="12" height="12" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-fit h-fit">
            <button
              type="button"
              role="button"
              className="lg:py-2 py-0.5 px-3 md:text-base text-[10px] lg:px-6 cursor-pointer hover:bg-transparent border border-transparent hover:border-Teal-500 duration-500 hover:text-Teal-500 uppercase text-white bg-Teal-500 rounded-full"
            >
              Select
            </button>
            <div>
              <ArrowDown className={clsx('text-Teal-500 duration-500 transition-all', { 'rotate-180': isOpen })} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx('overflow-hidden transition-all duration-500 ease-in-out', {
          'max-h-[500px] mt-4 opacity-100': isOpen,
          'max-h-0 opacity-0': !isOpen,
        })}
      >
        <div className="flex md:flex-row flex-col justify-between items-start w-full mt-8">
          <div className="w-full md:w-[50%] flex flex-col gap-10 relative">
            <div className="absolute border border-dashed h-full left-15 md:left-20 border-[#94A3B8]" />
            <div className="w-2 h-2 rounded-full absolute left-[57px] md:left-[77px] bottom-50 bg-Light dark:bg-[#94A3B8] border border-[#94A3B8]"></div>
            <div className="w-2 h-2 rounded-full absolute left-[57px] md:left-[77px] bottom-0 bg-Light dark:bg-[#94A3B8] border border-[#94A3B8]"></div>

            {flightData ? (
              // Use extracted flight data from new API structure
              (() => {
                const formatTime = (isoString: string) => {
                  const date = new Date(isoString);

                  return date
                    .toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                    .replace(':', '.');
                };

                const formatDate = (isoString: string) => {
                  const date = new Date(isoString);

                  return date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                  });
                };

                const departureTime = formatTime(flightData.departure_time);
                const arrivalTime = formatTime(flightData.arrival_time);
                const departureDate = formatDate(flightData.departure_time);
                const arrivalDate = formatDate(flightData.arrival_time);

                return (
                  <div className="flex flex-col gap-10">
                    <div className="flex gap-11 md:gap-14">
                      <div className="w-[14%] flex flex-col">
                        <div className="text-base font-medium text-neutral-50 dark:text-white">{departureTime}</div>
                        <div className="text-[#A3A3A3] text-sm">{departureDate}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-base font-medium text-neutral-50 dark:text-white">
                          {flightData.departure_airport}
                        </div>
                        <div className="text-[#A3A3A3] text-sm">Airport Name</div>
                      </div>
                    </div>
                    <div className="flex gap-11 md:gap-14 items-center">
                      <div className="w-[14%] flex flex-col">
                        <div className="text-[#A3A3A3] text-sm">{flightData.duration}</div>
                        {!flightData.isDirect && (
                          <div className="text-xs text-orange-400 mt-1">
                            {flightData.stops} stop{flightData.stops > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-base font-medium flex items-center gap-2">
                          <SingaporeIcon />
                          <div className="text-sm text-neutral-50 dark:text-white">{flightData.airline}</div>
                        </div>
                        <div className="flex text-sm text-[#A3A3A3] items-center gap-1.5">
                          <div>{flightData.travelClass} Class</div>
                          <div className="w-1 h-1 rounded-full bg-[#A3A3A3] mt-1" />
                          <div>{flightData.flightNumber}</div>
                          <div className="w-1 h-1 rounded-full bg-[#A3A3A3] mt-1" />
                          <div>{flightData.segments[0]?.aircraft?.code || 'Boeing 737'}</div>
                        </div>
                        {!flightData.isDirect && flightData.stopAirports.length > 0 && (
                          <div className="text-xs text-[#A3A3A3] mt-1">Via: {flightData.stopAirports.join(', ')}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-11 md:gap-14">
                      <div className="w-[14%] flex flex-col">
                        <div className="text-base font-medium text-neutral-50 dark:text-white">{arrivalTime}</div>
                        <div className="text-[#A3A3A3] text-sm">{arrivalDate}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-base font-medium text-neutral-50 dark:text-white">
                          {flightData.arrival_airport}
                        </div>
                        <div className="text-[#A3A3A3] text-sm">Airport Name</div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              // Fallback to dummy data
              <>
                <div className="flex gap-11 md:gap-14">
                  <div className="w-[14%] flex flex-col">
                    <div className="text-base font-medium text-neutral-50 dark:text-white">06.45</div>
                    <div className="text-[#A3A3A3] text-sm">18 Apr</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-base font-medium text-neutral-50 dark:text-white">Jakarta (CGK)</div>
                    <div className="text-[#A3A3A3] text-sm">Soekarno-Hatta International Airport</div>
                  </div>
                </div>
                <div className="flex gap-11 md:gap-14 items-center">
                  <div className="w-[14%] flex flex-col">
                    <div className="text-[#A3A3A3] text-sm">1h 50m</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-base font-medium flex items-center gap-2">
                      <SingaporeIcon />
                      <div className="text-sm text-neutral-50 dark:text-white">Singapore Airlines</div>
                    </div>
                    <div className="flex text-sm text-[#A3A3A3] items-center gap-1.5">
                      <div>Economy Class</div>
                      <div className="w-1 h-1 rounded-full bg-[#A3A3A3] mt-1" />
                      <div>SA 8092</div>
                      <div className="w-1 h-1 rounded-full bg-[#A3A3A3] mt-1" />
                      <div>Boeing 737</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-11 md:gap-14">
                  <div className="w-[14%] flex flex-col">
                    <div className="text-base font-medium text-neutral-50 dark:text-white">06.45</div>
                    <div className="text-[#A3A3A3] text-sm">18 Apr</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-base font-medium text-neutral-50 dark:text-white">Singapore (SIN)</div>
                    <div className="text-[#A3A3A3] text-sm">Singapore Changi Airport</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-5 flex-col mt-6 md:mt-0 md:w-fit w-full justify-center md:justify-end text-neutral-50 dark:text-white">
            {/* Aircraft type */}
            <div className="flex flex-row-reverse lg:flex-row justify-end items-center gap-3 text-sm">
              {flightData?.segments[0]?.aircraft?.code || 'Boeing 737'}
              <BoeingIcon />
            </div>

            {/* Dynamic amenities from API */}
            {flightData?.amenities && flightData.amenities.length > 0 ? (
              flightData.amenities.map((amenity, amenityIndex) => (
                <div
                  key={amenityIndex}
                  className="flex flex-row-reverse lg:flex-row justify-end items-center gap-3 text-sm"
                >
                  {amenity.description}
                  {amenity.isChargeable ? <span className="text-xs text-orange-500"></span> : <MealIcon />}
                </div>
              ))
            ) : (
              // Fallback to default amenities if none provided
              <>
                <div className="flex flex-row-reverse lg:flex-row justify-end items-center gap-3 text-sm">
                  Meal Included
                  <MealIcon />
                </div>
                <div className="flex flex-row-reverse lg:flex-row justify-end items-center gap-3 text-sm">
                  Beverages Included
                  <BeverageIcon />
                </div>
                <div className="flex flex-row-reverse lg:flex-row justify-end items-center gap-3 text-sm">
                  On-demand video
                  <MovieIcon />
                </div>
                <div className="flex flex-row-reverse lg:flex-row justify-end items-center gap-3 text-sm">
                  2-2 layout
                  <LayoutIcon />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlightList: React.FC<FlightListProps> = ({ flightData, activeTab = 'outbound', onTabChange }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  // Common function to format time using moment.js
  const formatTime = (isoString: string) => {
    return moment(isoString).format('HH:mm');
  };

  // Common function to format date using moment.js
  const formatDate = (isoString: string) => {
    return moment(isoString).format('DD MMM');
  };

  // Transform API data to the expected format, with fallback to dummy data
  const flights = useMemo(() => {
    // Get the correct flight data based on active tab
    const currentFlightData = activeTab === 'outbound' ? flightData?.outbound : flightData?.return;

    if (currentFlightData && currentFlightData.length > 0) {
      return currentFlightData
        .filter((flight) => flight && flight.segments && Array.isArray(flight.segments) && flight.segments.length > 0)
        .map((flight) => {
          try {
            const flightInfo = extractFlightData(flight);
            const arrivalTime = formatTime(flightInfo.arrival_time);
            const duration = flightInfo.duration;
            const stops = flightInfo.isDirect
              ? 'Non-stop'
              : `${flightInfo.stops} stop${flightInfo.stops > 1 ? 's' : ''}`;

            return {
              flightName: `${flightInfo.airline} ${flightInfo.flightNumber}`,
              flightTime: arrivalTime,
              details: `${stops} · ${duration} · Includes meal & baggage allowance.`,
              segmentId: flightInfo.segment_id,
              apiData: flight,
            };
          } catch (error) {
            console.error('Error extracting flight data:', error, flight);

            return null;
          }
        })
        .filter((flight) => flight !== null);
    }

    // Fallback to dummy data
    return [
      {
        flightName: 'Emirates EK202',
        flightTime: '12:30',
        details: 'Non-stop · 6h 45m · Includes meal & baggage allowance.',
        segmentId: 'SA 8092',
        apiData: null,
      },
      {
        flightName: 'Qatar QR556',
        flightTime: '3:45',
        details: '1 Stop in Doha · 9h 20m · Wi-Fi available.',
        segmentId: 'QR 556',
        apiData: null,
      },
      {
        flightName: 'Indigo 6E432',
        flightTime: '6:00',
        details: 'Budget airline · No meals included · Strict baggage policy.',
        segmentId: '6E 432',
        apiData: null,
      },
      {
        flightName: 'AirIndia 6E432',
        flightTime: '6:00',
        details: 'Budget airline · No meals included · Strict baggage policy.',
        segmentId: 'AI 432',
        apiData: null,
      },
      {
        flightName: 'AirIndia 6E432',
        flightTime: '6:00',
        details: 'Budget airline · No meals included · Strict baggage policy.',
        segmentId: 'AI 432',
        apiData: null,
      },
      {
        flightName: 'AirIndia 6E432',
        flightTime: '6:00',
        details: 'Budget airline · No meals included · Strict baggage policy.',
        segmentId: 'AI 432',
        apiData: null,
      },
    ];
  }, [flightData]);

  const handleCardClick = useCallback((index: number) => {
    setSelectedIndex(index);
    setOpenIndex((prevOpenIndex) => (prevOpenIndex === index ? null : index));
  }, []);

  const handleSelectFlight = useCallback(
    (flightIndex: number) => {
      if (!flightData) return;

      const isRoundTrip = flightData.searchParams.trip_type === 'ROUND_TRIP';
      const currentFlightData = activeTab === 'outbound' ? flightData.outbound : flightData.return;

      if (!currentFlightData || !currentFlightData[flightIndex]) return;

      const selectedFlight = currentFlightData[flightIndex];

      // Get existing selected flights from sessionStorage
      const existingData = getSelectedFlightData();
      const bookingData: SelectedFlightData = existingData || {
        searchParams: {
          ...flightData.searchParams,
          subscription_id: flightData.searchParams.subscription_id,
          adult: flightData.searchParams.adult,
          child: flightData.searchParams.child,
          infant: flightData.searchParams.infant,
        },
        tripType: flightData.searchParams.trip_type || 'ONE_WAY',
      };

      if (isRoundTrip) {
        // For round trip, store both outbound and return flights
        if (activeTab === 'outbound') {
          bookingData.selectedOutboundFlight = selectedFlight;
          // Switch to return tab
          onTabChange?.('return');
        } else {
          bookingData.selectedReturnFlight = selectedFlight;

          setSelectedFlightData(bookingData);
          router.push('/passengers-details');

          return;
        }
      } else {
        // For one-way trip, store single flight and redirect immediately
        bookingData.selectedFlight = selectedFlight;
        setSelectedFlightData(bookingData);
        router.push('/passengers-details');

        return;
      }

      // Store updated data for round trip outbound selection
      setSelectedFlightData(bookingData);
    },
    [flightData, activeTab, onTabChange, router]
  );

  const cardClickHandlers = useMemo(
    () => flights.map((_, index) => () => handleCardClick(index)),
    [flights, handleCardClick]
  );

  return (
    <div className="w-full flex flex-col">
      {flights.map((flight, index) => (
        <div key={index}>
          <FlightItem
            index={index}
            flightName={flight.flightName}
            flightTime={flight.flightTime}
            isOpen={openIndex === index}
            isSelected={selectedIndex === index}
            onClick={cardClickHandlers[index]}
            apiData={flight.apiData}
            segmentId={flight.segmentId}
            onSelectFlight={handleSelectFlight}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        </div>
      ))}
    </div>
  );
};
