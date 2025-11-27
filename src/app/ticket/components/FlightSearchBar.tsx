'use client';
import { useCallback, useState, useEffect, useRef } from 'react';
import { DestinationFromDropdown } from '@/app/booking/components/DestinationFromDropdown';
import DateRangePicker from '@/common/components/DateRangePicker';
import { DestinationIcon, SwithIconLeft, TicketSearchIcon } from '@/icons/icon';
import { CountDropdown } from './CountDropdown';
import PackSelect from '@/app/booking/components/SubscriptionPackDropdwon';
import type { FlightSearchBarProps } from '@/lib/types/common.types';
import type { FlightSearchParams, SubscriptionAirport, Airport } from '@/lib/types/api/booking';
import { fetchLinkedPackageODRoutes } from '@/lib/api/subscription';
import type { PackageODRoute } from '@/lib/types/api/subscription';
import { getAirportCode } from '@/lib/types/api/booking';
import moment from 'moment';
import { clearFlightSessionStorage, setFlightSearchResults } from '@/utils/sessionStorage';
import { searchFlights } from '@/lib/api/booking';

export const FlightSearchBar: React.FC<FlightSearchBarProps> = ({
  onSearch,
  subscriptions = [],
  selectedSubscription,
  onSubscriptionSelect,
  baseSearchParams = null,
  onSearchResult,
  onPerformSearch,
}) => {
  const [originAirports, setOriginAirports] = useState<SubscriptionAirport[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<SubscriptionAirport[]>([]);
  const [linkedRoutes, setLinkedRoutes] = useState<PackageODRoute[]>([]);

  // Local selections (store IATA codes when possible)
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');

  // Date selections
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  // Track if user has explicitly interacted with date picker
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  // Passenger count state
  const [passengerCounts, setPassengerCounts] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });

  // Helper function to format date in local timezone (YYYY-MM-DD) using moment.js
  const formatDateForAPI = useCallback((date: Date | null): string => {
    if (!date) return '';

    return moment(date).format('YYYY-MM-DD');
  }, []);

  // Initialize all fields from baseSearchParams
  useEffect(() => {
    if (baseSearchParams?.departure_date) {
      setSelectedStartDate(new Date(baseSearchParams.departure_date));
    } else {
      setSelectedStartDate(null);
    }

    // Only initialize return date if it exists in baseSearchParams
    if (baseSearchParams?.return_date) {
      setSelectedEndDate(new Date(baseSearchParams.return_date));
    } else {
      setSelectedEndDate(null);
    }

    // Initialize origin and destination from baseSearchParams
    if (baseSearchParams?.origin) {
      setSelectedOrigin(baseSearchParams.origin);
    }

    if (baseSearchParams?.destination) {
      setSelectedDestination(baseSearchParams.destination);
    }

    // Initialize passenger counts from baseSearchParams
    if (baseSearchParams?.adult !== undefined) {
      setPassengerCounts({
        adult: baseSearchParams.adult,
        child: baseSearchParams.child || 0,
        infant: baseSearchParams.infant || 0,
      });
    }

    // Reset user interaction flag when baseSearchParams change
    setHasUserInteracted(false);
  }, [baseSearchParams]);

  const convertRouteToAirport = useCallback((route: PackageODRoute, isOrigin: boolean): SubscriptionAirport => {
    if (isOrigin) {
      return {
        id: route.id,
        name: route.origin_airport,
        code: route.origin_airport_code,
        city: route.origin_airport_city_name,
        country: route.origin_airport_country_name,
      };
    }

    return {
      id: route.id,
      name: route.destination_airport,
      code: route.destination_airport_code,
      city: route.destination_airport_city_name,
      country: route.destination_airport_country_name,
    };
  }, []);

  // Track the last subscription ID we fetched to prevent duplicate calls (using ref for synchronous access)
  const lastFetchedSubscriptionIdRef = useRef<string | null>(null);

  // Fetch linked routes when subscription changes
  useEffect(() => {
    let isMounted = true;
    let abortController: AbortController | null = null;

    const subscriptionId = selectedSubscription?.value;

    if (!subscriptionId) {
      setLinkedRoutes([]);
      setOriginAirports([]);
      setDestinationAirports([]);
      setSelectedOrigin('');
      setSelectedDestination('');
      lastFetchedSubscriptionIdRef.current = null;

      return;
    }

    // Skip if we're already fetching or have fetched for this subscription
    if (subscriptionId === lastFetchedSubscriptionIdRef.current) {
      return;
    }

    const loadRoutes = async () => {
      try {
        // Create abort controller for this request
        abortController = new AbortController();

        // Mark that we're fetching for this subscription BEFORE making the API call
        lastFetchedSubscriptionIdRef.current = subscriptionId;

        const routes = await fetchLinkedPackageODRoutes(subscriptionId);

        // Check if component is still mounted and subscription hasn't changed
        if (!isMounted || selectedSubscription?.value !== subscriptionId) {
          return;
        }

        setLinkedRoutes(routes);

        const originMap = new Map<string, SubscriptionAirport>();

        routes.forEach((route) => {
          const originAirport = convertRouteToAirport(route, true);

          if (originAirport.code && !originMap.has(originAirport.code)) {
            originMap.set(originAirport.code, originAirport);
          }
        });

        const uniqueOrigins = Array.from(originMap.values());
        setOriginAirports(uniqueOrigins);

        setSelectedOrigin((prev) => {
          if (prev && !originMap.has(prev)) {
            setSelectedDestination('');
            setDestinationAirports([]);

            return '';
          }

          return prev;
        });
      } catch (error) {
        // Only handle error if component is still mounted and subscription matches
        if (!isMounted || selectedSubscription?.value !== subscriptionId) {
          return;
        }

        console.error('Failed to fetch subscription routes:', error);
        setLinkedRoutes([]);
        setOriginAirports([]);
        setDestinationAirports([]);
        setSelectedOrigin('');
        setSelectedDestination('');
        // Reset last fetched ID on error so we can retry
        lastFetchedSubscriptionIdRef.current = null;
      }
    };

    loadRoutes();

    return () => {
      isMounted = false;

      // Abort any pending requests
      if (abortController) {
        abortController.abort();
      }
    };
  }, [selectedSubscription?.value, convertRouteToAirport]);

  // Update destination airports when origin changes
  useEffect(() => {
    if (selectedOrigin && linkedRoutes.length > 0) {
      const destinationMap = new Map<string, SubscriptionAirport>();

      linkedRoutes.forEach((route) => {
        const originCode = route.origin_airport_code;

        if (originCode === selectedOrigin || route.origin_airport === selectedOrigin) {
          const destinationAirport = convertRouteToAirport(route, false);

          if (destinationAirport.code && !destinationMap.has(destinationAirport.code)) {
            destinationMap.set(destinationAirport.code, destinationAirport);
          }
        }
      });

      const uniqueDestinations = Array.from(destinationMap.values());
      setDestinationAirports(uniqueDestinations);

      if (selectedDestination && !destinationMap.has(selectedDestination)) {
        setSelectedDestination('');
      }
    } else {
      setDestinationAirports([]);

      if (selectedDestination) {
        setSelectedDestination('');
      }
    }
  }, [selectedOrigin, linkedRoutes, convertRouteToAirport, selectedDestination]);

  // Helper: find airport code by displayed airport name
  const findAirportCodeByName = useCallback((name: string, list: SubscriptionAirport[]) => {
    const match = list.find((a) => a.name === name);

    return match ? getAirportCode(match) : name;
  }, []);

  const handleFromChange = useCallback(
    (label: string) => {
      // Try to map label (airport name) to its airport code from originAirports
      const airportCode = findAirportCodeByName(label, originAirports);
      setSelectedOrigin(airportCode || label);
      setSelectedDestination('');
    },
    [findAirportCodeByName, originAirports]
  );

  const handleToChange = useCallback(
    (label: string) => {
      const airportCode = findAirportCodeByName(label, destinationAirports);
      setSelectedDestination(airportCode || label);
    },
    [findAirportCodeByName, destinationAirports]
  );

  const handlePackSelectChange = useCallback(
    (option: { label: string; value: string }) => {
      // Clear origin and destination selections when subscription changes
      setSelectedOrigin('');
      setSelectedDestination('');
      // Reset the last fetched subscription ID ref so we can fetch for the new subscription
      lastFetchedSubscriptionIdRef.current = null;
      onSubscriptionSelect?.(option);
    },
    [onSubscriptionSelect]
  );

  const handleSearchClick = useCallback(async () => {
    // Clear previous session storage before new search
    clearFlightSessionStorage();

    // Build params using local selections with fallback to previous search
    const subscription_id = selectedSubscription?.value || baseSearchParams?.subscription_id || '';

    const origin = selectedOrigin || baseSearchParams?.origin || '';
    const destination = selectedDestination || baseSearchParams?.destination || '';

    // Use selected dates or fallback to baseSearchParams
    const departure_date = selectedStartDate
      ? formatDateForAPI(selectedStartDate)
      : baseSearchParams?.departure_date || '';

    // Only use return date if user has explicitly selected it
    let return_date: string | undefined = undefined;

    if (hasUserInteracted && selectedEndDate) {
      return_date = formatDateForAPI(selectedEndDate);
    }

    // Double-check: if user hasn't interacted, force return_date to undefined
    if (!hasUserInteracted) {
      return_date = undefined;
    }

    // Determine trip type based on return date
    const trip_type = return_date && return_date.trim() !== '' ? 'ROUND_TRIP' : 'ONE_WAY';

    if (!subscription_id || !origin || !destination || !departure_date) {
      // If essential params are missing, just trigger onSearch to keep UI behavior
      onSearch();

      return;
    }

    const params: FlightSearchParams = {
      trip_type,
      subscription_id,
      adult: passengerCounts.adult,
      ...(passengerCounts.child > 0 && { child: passengerCounts.child }),
      ...(passengerCounts.infant > 0 && { infant: passengerCounts.infant }),
      origin,
      destination,
      departure_date,
      ...(trip_type === 'ROUND_TRIP' && return_date ? { return_date } : {}),
    };

    // Use centralized search function if available, otherwise fallback to local search
    if (onPerformSearch) {
      await onPerformSearch(params);
    } else {
      try {
        const searchResponse = await searchFlights(params);

        const data = {
          outbound: searchResponse.outbound || [],
          return: searchResponse.return || [],
          searchParams: params,
        } as const;

        // Persist for consistency with booking flow
        setFlightSearchResults(data);

        // Notify parent to update results immediately
        onSearchResult?.(data);
      } catch (e) {
        console.error('Flight search failed:', e);
      }
    }

    onSearch();
  }, [
    baseSearchParams?.departure_date,
    baseSearchParams?.destination,
    baseSearchParams?.return_date,
    baseSearchParams?.subscription_id,
    baseSearchParams?.origin,
    passengerCounts,
    selectedSubscription?.value,
    selectedOrigin,
    selectedDestination,
    selectedStartDate,
    selectedEndDate,
    hasUserInteracted,
    formatDateForAPI,
    onSearch,
    onSearchResult,
    onPerformSearch,
  ]);

  return (
    <div className="dark:max-w-full xl:max-w-[85%] max-w-[90%] mx-auto lg:flex hidden items-center xl:flex-nowrap flex-wrap justify-center 2xl:justify-between gap-3 md:gap-5">
      <div className="flex md:flex-row w-full md:w-fit flex-col gap-3 md:gap-5 xl:gap-0 2xl:gap-5 relative">
        <div className="absolute flex items-center justify-center dark:bg-neutral-50 md:right-[20.5%] lg:right-[27%] xl:right-[18.5%] 2xl:right-[27%] z-50 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 shadow-10xl">
          <SwithIconLeft className="text-neutral-50 dark:text-gray-50" />
        </div>

        <PackSelect
          options={subscriptions}
          mtClass="!mt-0"
          className="!bg-blue-150 dark:!bg-neutral-50  md:!w-[160px] rounded-full outline-none !mt-0 border border-blue-150 dark:border-black pl-12 pr-8 py-2"
          placeholder="Select subscription pack"
          leftIconWrapperClass="!top-5 !left-2"
          thunderIconClass="!text-neutral-50 dark:!text-gray-200"
          arrowWrapperClass="!top-5 !right-3"
          onChange={handlePackSelectChange}
        />

        <CountDropdown initialPassengerCounts={passengerCounts} onPassengerCountChange={setPassengerCounts} />
        <DestinationFromDropdown
          iconPosition="left-4"
          iconColor="dark:text-white"
          placeHolder="Flying from"
          widthClass="!min-w-[260px] 2xl:!min-w-[300px]"
          className="!bg-blue-150 dark:!bg-neutral-50 !w-full !pl-12 rounded-full md:!rounded-30 !border !border-blue-150 dark:!border-black  !px-8 !py-2 "
          onChange={handleFromChange}
          airports={originAirports as unknown as Airport[]}
          value={selectedOrigin}
        />
        <DestinationFromDropdown
          icon={DestinationIcon}
          iconPosition="left-5"
          iconColor="dark:text-white"
          placeHolder="Flying to"
          widthClass="!min-w-[250px] 2xl:!min-w-[300px]"
          className="!bg-blue-150 dark:!bg-neutral-50 !pl-14 rounded-full md:!rounded-40 !border !border-blue-150 dark:!border-black  !px-8 !py-2 "
          onChange={handleToChange}
          airports={destinationAirports as unknown as Airport[]}
          value={selectedDestination}
        />
      </div>

      <DateRangePicker
        onStartDateChange={(date) => {
          setSelectedStartDate(date);
        }}
        onEndDateChange={(date) => {
          setSelectedEndDate(date);
          // Set hasUserInteracted to true when user selects a date, false when they clear it
          setHasUserInteracted(!!date);
        }}
        initialStartDate={selectedStartDate}
        initialEndDate={selectedEndDate}
      />

      <div className="xl:w-fit md:w-fit w-full">
        <button
          type="button"
          onClick={handleSearchClick}
          role="button"
          className="bg-Teal-900 dark:bg-Teal-500 px-3 cursor-pointer w-full md:w-[8rem] font-medium justify-center  py-2 rounded-full text-white dark:text-neutral-50 flex items-center gap-3"
        >
          <TicketSearchIcon className="text-white dark:text-neutral-50" />
          <div>Search</div>
        </button>
      </div>
    </div>
  );
};
