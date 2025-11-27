'use client';
import { DestinationIcon, FlightFrom, ModalCloseIcon, SwithIcon } from '@/icons/icon';
import CustomDatePicker from './DatePicker';
import { ToggleSwitch } from './ToggleSwitch';
import { Button } from '@/app/authentication/components/Button';
import { PassengerSelector } from './PassangerSelect';
import { DestinationDropDown } from './DestinationDropdown';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PackSelect from './SubscriptionPackDropdwon';
import { ErrorModal } from './ErrorModal';
import type { TripFormProps } from '@/lib/types/common.types';
import { TripType, PassengerType } from '@/lib/types/common.types';
import type { Option } from '@/lib/types/common.types';
import { fetchSubscriptions, fetchLinkedPackageODRoutes } from '@/lib/api/subscription';
import type { PackageODRoute } from '@/lib/types/api/subscription';
import { searchFlights } from '@/lib/api/booking';
import type { Airport, FlightSearchParams, SubscriptionAirport } from '@/lib/types/api/booking';
import { getAirportCode } from '@/lib/types/api/booking';
import clsx from 'clsx';
import moment from 'moment';
import { clearFlightSessionStorage, setFlightSearchResults } from '@/utils/sessionStorage';

export const TripForm: React.FC<TripFormProps> = ({ type, isEnabled, onToggle }) => {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<Option[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Option | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [originAirports, setOriginAirports] = useState<SubscriptionAirport[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<SubscriptionAirport[]>([]);
  const [filteredOriginAirports, setFilteredOriginAirports] = useState<SubscriptionAirport[]>([]);
  const [filteredDestinationAirports, setFilteredDestinationAirports] = useState<SubscriptionAirport[]>([]);
  const [linkedRoutes, setLinkedRoutes] = useState<PackageODRoute[]>([]);
  const [passengerCounts, setPassengerCounts] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const router = useRouter();

  // Format date for API (YYYY-MM-DD) using moment.js to avoid timezone issues
  const formatDateForAPI = useCallback((date: string | null): string => {
    if (!date) return '';

    return moment(date).format('YYYY-MM-DD');
  }, []);

  // Fetch active subscriptions on component mount

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setSearchLoading(true);
        const allSubscriptions = await fetchSubscriptions();

        // Filter only active (non-expired) subscriptions
        const activeSubscriptions = allSubscriptions.filter((sub) => !sub.expired);

        // Transform subscription data to Option format
        const subscriptionOptions: Option[] = activeSubscriptions.map((sub) => ({
          label: sub.package || `Subscription ${sub.subscription_number || sub.id}`,
          value: sub.id.toString(),
        }));

        setSubscriptions(subscriptionOptions);

        // Set first subscription as default if available
        if (subscriptionOptions.length > 0) {
          setSelectedSubscription(subscriptionOptions[0]);
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
        // Fallback to empty array
        setSubscriptions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  // Convert PackageODRoute to SubscriptionAirport format
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

  // Fetch linked routes when subscription changes
  useEffect(() => {
    // Clear origin and destination selections immediately when subscription changes
    // This ensures the dropdowns are reset before fetching new routes
    setFrom('');
    setTo('');
    setDestinationAirports([]);
    setFilteredDestinationAirports([]);

    const loadLinkedRoutes = async () => {
      if (selectedSubscription) {
        try {
          setSearchLoading(true);
          const routes = await fetchLinkedPackageODRoutes(selectedSubscription.value);
          setLinkedRoutes(routes);

          // Extract unique origin airports from linked routes
          const originMap = new Map<string, SubscriptionAirport>();

          routes.forEach((route: PackageODRoute) => {
            const originCode = route.origin_airport_code;

            // Only add if we have a valid airport code
            if (originCode && originCode.trim() && !originMap.has(originCode)) {
              const airport = convertRouteToAirport(route, true);

              // Ensure code is set
              if (airport.code) {
                originMap.set(originCode, airport);
              }
            }
          });

          const uniqueOrigins = Array.from(originMap.values());
          setOriginAirports(uniqueOrigins);
          setFilteredOriginAirports(uniqueOrigins);

          // Clear destination airports and selections (already cleared above, but ensure it's cleared)
          setDestinationAirports([]);
          setFilteredDestinationAirports([]);
        } catch (error) {
          console.error('Failed to fetch linked routes:', error);
          setLinkedRoutes([]);
          setOriginAirports([]);
          setFilteredOriginAirports([]);
          setDestinationAirports([]);
          setFilteredDestinationAirports([]);
          // Ensure selections are cleared even on error
          setFrom('');
          setTo('');
        } finally {
          setSearchLoading(false);
        }
      } else {
        setLinkedRoutes([]);
        setOriginAirports([]);
        setFilteredOriginAirports([]);
        setDestinationAirports([]);
        setFilteredDestinationAirports([]);
        // Ensure selections are cleared when no subscription is selected
        setFrom('');
        setTo('');
      }
    };

    loadLinkedRoutes();
  }, [selectedSubscription, convertRouteToAirport]);

  // Filter destination airports based on selected origin
  useEffect(() => {
    if (from && linkedRoutes.length > 0) {
      // Find routes where origin matches the selected origin
      // The 'from' value is the airport code (e.g., "BLR") passed from the dropdown
      const matchingRoutes = linkedRoutes.filter((route: PackageODRoute) => {
        const originCode = route.origin_airport_code;
        const originName = route.origin_airport;

        // Match by code (primary) or by name (fallback)
        // The dropdown passes the airport code, so we primarily match by code
        return originCode === from || originName === from;
      });

      // Extract unique destination airports from matching routes
      const destinationMap = new Map<string, SubscriptionAirport>();

      matchingRoutes.forEach((route: PackageODRoute) => {
        const destCode = route.destination_airport_code;

        // Only add if we have a valid airport code
        if (destCode && destCode.trim() && !destinationMap.has(destCode)) {
          const airport = convertRouteToAirport(route, false);

          // Ensure code is set
          if (airport.code && airport.code.trim()) {
            destinationMap.set(destCode, airport);
          }
        }
      });

      const uniqueDestinations = Array.from(destinationMap.values());
      setDestinationAirports(uniqueDestinations);
      // Set filtered destinations directly (country filtering will be applied separately if needed)
      setFilteredDestinationAirports(uniqueDestinations);

      // Clear destination selection when origin changes
      setTo('');
    } else {
      setDestinationAirports([]);
      setFilteredDestinationAirports([]);
      setTo('');
    }
  }, [from, linkedRoutes, convertRouteToAirport]);

  // Update filtered airports when origin/destination airports change
  // Origin is independent of destination - it should always show all available origins
  // Destination depends on origin and is already filtered by linked routes
  useEffect(() => {
    // Origin airports should always show all available origins (no filtering based on destination)
    // Destination depends on origin, but origin doesn't depend on destination
    setFilteredOriginAirports(originAirports);

    // Keep destinations as-is (they're already filtered by linked routes based on origin)
    setFilteredDestinationAirports(destinationAirports);
  }, [originAirports, destinationAirports]);

  const handleSwap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  // Get IATA code from airport name (handle both Airport and SubscriptionAirport types)
  const getIATACode = useCallback((airportName: string, airports: (Airport | SubscriptionAirport)[]): string => {
    const airport = airports.find((ap) => ap.name === airportName);

    if (airport) {
      // Handle both Airport and SubscriptionAirport types
      return getAirportCode(airport) || airportName;
    }

    return airportName;
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    try {
      // Clear previous session storage before new search
      clearFlightSessionStorage();

      // Validation
      if (!selectedSubscription) {
        setErrorMessages(['Please select a subscription pack']);

        return;
      }

      if (!from) {
        setErrorMessages(['Please select departure airport']);

        return;
      }

      if (!to) {
        setErrorMessages(['Please select destination airport']);

        return;
      }

      if (!departureDate) {
        setErrorMessages(['Please select departure date']);

        return;
      }

      if (type === TripType.ROUND_TRIP && !returnDate) {
        setErrorMessages(['Please select return date']);

        return;
      }

      if (type === TripType.ROUND_TRIP && departureDate && returnDate) {
        const departure = moment(departureDate);
        const returnDateObj = moment(returnDate);

        if (!returnDateObj.isAfter(departure)) {
          setErrorMessages(['Return date must be after departure date']);

          return;
        }
      }

      // Validate passenger selection

      const totalPassengers = passengerCounts.adult + passengerCounts.child + passengerCounts.infant;

      if (totalPassengers === 0) {
        setErrorMessages(['Please select at least one passenger']);

        return;
      }

      setSearchLoading(true);
      setErrorMessages([]);

      // Prepare search parameters
      const formattedDepartureDate = formatDateForAPI(departureDate);
      const formattedReturnDate = type === TripType.ROUND_TRIP ? formatDateForAPI(returnDate) : undefined;

      const searchParams: FlightSearchParams = {
        trip_type: type === TripType.ROUND_TRIP ? 'ROUND_TRIP' : 'ONE_WAY',
        subscription_id: selectedSubscription.value,
        adult: passengerCounts.adult,
        ...(passengerCounts.child > 0 && { child: passengerCounts.child }),
        ...(passengerCounts.infant > 0 && { infant: passengerCounts.infant }),
        origin: getIATACode(from, originAirports),
        // origin: 'MAA',
        destination: getIATACode(to, destinationAirports),
        // destination: 'DXB',
        departure_date: formattedDepartureDate,
        ...(type === TripType.ROUND_TRIP && { return_date: formattedReturnDate }),
      };

      // Call flight search API
      const searchResponse = await searchFlights(searchParams);

      if (searchResponse.outbound && searchResponse.outbound.length > 0) {
        // Navigate to flight results page with search data
        const searchData = {
          outbound: searchResponse.outbound || [],
          return: searchResponse.return || [],
          searchParams,
        };

        // Store search data in sessionStorage for the results page
        setFlightSearchResults(searchData);

        // Navigate to results page
        router.push('/ticket');
      } else {
        setErrorMessages(['No flights found for the selected criteria. Please try different dates or routes.']);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search flights. Please try again.';
      console.error('Flight search failed:', errorMessage, error);
      setErrorMessages([errorMessage || 'Failed to search flights. Please try again.']);
    } finally {
      setSearchLoading(false);
    }
  }, [
    selectedSubscription,
    from,
    to,
    departureDate,
    returnDate,
    type,
    passengerCounts,
    originAirports,
    destinationAirports,
    getIATACode,
    formatDateForAPI,
    router,
  ]);

  const handleCloseError = useCallback(() => setErrorMessages([]), []);
  const handlePackSelect = useCallback((selectedOption: Option) => {
    // Clear origin and destination selections when subscription changes
    setFrom('');
    setTo('');
    setDestinationAirports([]);
    setFilteredDestinationAirports([]);
    // Update subscription
    setSelectedSubscription(selectedOption);
  }, []);

  const errorModalContent = useMemo(
    () =>
      errorMessages.length > 0 && (
        <ErrorModal isOpen={true} onClose={handleCloseError}>
          <div className="flex justify-between items-center">
            <div className="text-Teal-500 text-base leading-5">Required following fields</div>
            <div className="cursor-pointer hover:text-orange-500" onClick={handleCloseError}>
              <ModalCloseIcon />
            </div>
          </div>
          <ul className="flex flex-col gap-2 pl-10 mt-5">
            {errorMessages.map((error, index) => (
              <li className="list-disc" key={index}>
                {error}
              </li>
            ))}
          </ul>
          <button
            onClick={handleCloseError}
            type="button"
            role="button"
            className="bg-Teal-500 uppercase w-full cursor-pointer mt-5 border border-transparent hover:bg-transparent hover:text-Teal-500 hover:border-Teal-500 duration-500 text-white rounded-full py-2 px-3"
          >
            Ok
          </button>
        </ErrorModal>
      ),
    [errorMessages, handleCloseError]
  );
  const packSelectClass = useMemo(() => clsx('!w-full'), []);

  return (
    <div className="flex flex-col mt-5">
      {errorModalContent}
      <div className="flex justify-between flex-row items-start w-full md:mt-4 pb-5 gap-2">
        <div className="w-1/2 flex flex-col">
          <div className="text-gray-200 md:text-base text-sm  flex items-center gap-2 ">Subscription pack</div>
          <PackSelect
            options={subscriptions}
            mtClass={packSelectClass}
            leftIconWrapperClass="text-gray-200"
            placeholder="Select subscription pack"
            onChange={handlePackSelect}
          />
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="text-gray-200 ">Passengers</div>
          <PassengerSelector
            passengers={{
              [PassengerType.ADULT]: passengerCounts.adult,
              [PassengerType.CHILD]: passengerCounts.child,
              [PassengerType.INFANT]: passengerCounts.infant,
            }}
            onPassengersChange={(passengers) => {
              setPassengerCounts({
                adult: passengers[PassengerType.ADULT],
                child: passengers[PassengerType.CHILD],
                infant: passengers[PassengerType.INFANT],
              });
            }}
            MarginClass=" md:mt-4 mt-0"
          />
        </div>
      </div>
      <div className="w-full rounded-xl p-6 border border-neutral-400">
        <div className="text-gray-200 text-base leading-5">Flight From</div>
        <div className="flex items-center gap-4 relative pb-6 border-b border-b-neutral-400 mt-5">
          <DestinationDropDown
            icon={FlightFrom}
            value={from}
            onChange={setFrom}
            preventList={[to]}
            airports={filteredOriginAirports as unknown as Airport[]}
            type="origin"
          />
          <div
            onClick={handleSwap}
            className={clsx(
              'flex w-9 h-9 justify-center items-center rounded-full border border-gray-200 dark:border-neutral-400',
              'bg-white dark:bg-black',
              'cursor-pointer'
            )}
          >
            <SwithIcon className="[transform:rotate(182deg)] text-[#00CBCB] dark:text-Teal-900 w-4 h-4" />
          </div>
        </div>
        <div className="text-gray-200 text-base pb-6 leading-5 mt-5">Flight To</div>
        <DestinationDropDown
          icon={DestinationIcon}
          value={to}
          onChange={setTo}
          preventList={[from]}
          airports={filteredDestinationAirports as unknown as Airport[]}
          type="destination"
        />
      </div>
      <div className="flex justify-between gap-3 md:gap-0 mt-5 border-b-[#D8D8D8] dark:border-b-neutral-400 border-b pb-5">
        <div className="md:w-[40%] w-full flex flex-col">
          <div className="text-gray-200">Departure Date</div>
          <div>
            <CustomDatePicker value={departureDate} onChange={setDepartureDate} />
          </div>
        </div>
        {type === TripType.ROUND_TRIP && (
          <div className="flex  w-full md:w-[40%] flex-col">
            <div className="text-gray-200">Return Date</div>
            <div>
              <CustomDatePicker value={returnDate} onChange={setReturnDate} />
            </div>
          </div>
        )}
        <div className="lg:flex hidden w-full md:w-[20%] flex-col">
          <div className="text-gray-200">Round Trip</div>
          <div className="mt-2">
            <ToggleSwitch enabled={isEnabled} onToggle={onToggle} />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Button
          onClick={handleSubmit}
          className={clsx(
            'bg-[#00CBCB] dark:bg-Teal-900 !text-white dark:!text-neutral-50',
            searchLoading && 'opacity-50 cursor-not-allowed'
          )}
          label={searchLoading ? 'Searching Flights...' : 'Search Flight'}
          disabled={searchLoading}
        />
      </div>
    </div>
  );
};
