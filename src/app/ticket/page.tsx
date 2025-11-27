'use client';
import { Fragment, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../../common/components/Header';
import { FlightSearchBar } from './components/FlightSearchBar';
import { DateSlider } from './components/DateSlider';
import { LeftPannel } from './components/LeftPannel';
import { Footer } from '@/common/components/Footer';
import { RightPannel } from './components/RightPanel';
import { NoResultFound } from './components/NoResult';
import { FilterIconM, SortIcon } from '@/icons/icon';
import { TripUpdateModal } from './components/TripUpdateModal';
import { FilterMobileModal } from './components/FilterModal';
import { SortModal } from './components/SortModal';
import type { FlightSearchResponse, FlightSearchParams } from '@/lib/types/api/booking';
import type { Option } from '@/lib/types/common.types';
import { fetchSubscriptions } from '@/lib/api/subscription';
import { getFlightSearchResults, setFlightSearchResults } from '@/utils/sessionStorage';
import { searchFlights } from '@/lib/api/booking';

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

interface FilterState {
  selectedAirlines: string[];
  transit?: string; // Comma-separated transit values: "1,2,3+"
  travelClass?: string; // Travel class name from API
  departureTime: string[];
  arrivalTime: string[];
  durationRange: [number, number];
  selectedDate?: string; // Selected date from date slider (YYYY-MM-DD)
}

const Ticket = () => {
  const [showResults, setShowResults] = useState(false);
  const [isTripUpdateModalOpen, setIsTripUpdateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [flightData, setFlightData] = useState<FlightSearchData | null>(null);
  const [subscriptions, setSubscriptions] = useState<Option[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const durationDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-dismiss error after 10 seconds
  useEffect(() => {
    if (searchError) {
      const timer = setTimeout(() => {
        setSearchError(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchError]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (durationDebounceTimerRef.current) {
        clearTimeout(durationDebounceTimerRef.current);
      }
    };
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    selectedAirlines: [],
    departureTime: [],
    arrivalTime: [],
    durationRange: [0, 24],
    selectedDate: undefined,
  });

  // Ref to store latest filters for debounced calls
  const filtersRef = useRef<FilterState>(filters);

  // Ref to store searchParams so they're always available for filter changes
  const searchParamsRef = useRef<FlightSearchData['searchParams'] | null>(null);

  // Ref to track if we're programmatically setting subscription (to prevent clearing data)
  const isSettingSubscriptionProgrammatically = useRef(false);

  // Load flight search data from session storage on mount
  useEffect(() => {
    const storedData = getFlightSearchResults();

    if (!storedData) {
      return;
    }

    // Validate that we have actual flight data
    const hasOutboundFlights = storedData.outbound && storedData.outbound.length > 0;
    const hasReturnFlights = storedData.return && storedData.return.length > 0;

    if (hasOutboundFlights || hasReturnFlights) {
      setFlightData(storedData);
      searchParamsRef.current = storedData.searchParams;
      setShowResults(true);
    }
  }, []);

  // Load subscriptions once on component mount
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const allSubscriptions = await fetchSubscriptions();

        // Filter only active (non-expired) subscriptions
        const activeSubscriptions = allSubscriptions.filter((sub) => !sub.expired);

        // Transform subscription data to Option format
        const subscriptionOptions: Option[] = activeSubscriptions.map((sub) => ({
          label: sub.package,
          value: sub.id.toString(),
        }));

        setSubscriptions(subscriptionOptions);

        // Check if we have stored flight data - if so, don't set default subscription yet
        // The subscription will be set from the stored flight data in the next effect
        const storedData = getFlightSearchResults();
        const hasStoredFlightData = storedData && storedData.searchParams;

        // Only set default subscription if we don't have stored flight data
        // This prevents clearing flight data during initialization
        if (subscriptionOptions.length > 0 && !hasStoredFlightData) {
          setSelectedSubscription(subscriptionOptions[0]);
        }
      } catch {
        // Silently handle subscription loading errors
      }
    };

    loadSubscriptions();
  }, []);

  // Track if we've initialized subscription from stored data
  const [hasInitializedSubscription, setHasInitializedSubscription] = useState(false);

  // Set selected subscription only on initial load from stored data
  useEffect(() => {
    // Only run this once on initial load when we have stored flight data
    if (hasInitializedSubscription) {
      return;
    }

    // Priority 1: If we have flight data, use its subscription
    if (flightData?.searchParams && subscriptions.length > 0) {
      const selectedSub = subscriptions.find((sub) => sub.value === flightData.searchParams.subscription_id);

      if (selectedSub) {
        // Mark that we're setting subscription programmatically to prevent data clearing
        isSettingSubscriptionProgrammatically.current = true;
        setSelectedSubscription(selectedSub);
        setHasInitializedSubscription(true);

        // Reset flag after a brief delay to allow state update
        setTimeout(() => {
          isSettingSubscriptionProgrammatically.current = false;
        }, 100);
      } else if (subscriptions.length > 0 && !selectedSubscription) {
        // If subscription not found, keep the flight data but set first available subscription
        // Don't clear flight data - it might still be valid
        setSelectedSubscription(subscriptions[0]);
        setHasInitializedSubscription(true);
      }
    } else if (subscriptions.length > 0 && !selectedSubscription && !hasInitializedSubscription) {
      // Priority 2: If no flight data, set first subscription
      setSelectedSubscription(subscriptions[0]);
      setHasInitializedSubscription(true);
    }
  }, [flightData, subscriptions, selectedSubscription, hasInitializedSubscription]);

  // Centralized search function
  const performSearch = useCallback(async (searchParams: FlightSearchParams) => {
    setLoading(true);
    setSearchError(null);

    try {
      const searchResponse = await searchFlights(searchParams);

      const data: FlightSearchData = {
        outbound: searchResponse.outbound || [],
        return: searchResponse.return || [],
        searchParams: {
          ...searchParams,
        },
      };

      // Store in session storage
      setFlightSearchResults(data);
      setFlightData(data);
      // Update searchParams ref whenever flightData is updated
      searchParamsRef.current = data.searchParams;
      setShowResults(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search flights. Please try again.';

      const isNoResultsError = errorMessage.toLowerCase().includes('no flights');

      if (isNoResultsError) {
        const emptyData: FlightSearchData = {
          outbound: [],
          return: [],
          searchParams: {
            ...searchParams,
          },
        };

        setFlightSearchResults(emptyData);
        setFlightData(emptyData);
        searchParamsRef.current = emptyData.searchParams;
        setShowResults(true);
      } else {
        setSearchError(errorMessage);
        // Clear flight data on other errors
        setFlightData(null);
        setShowResults(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    setShowResults(true);
  };

  const openTripUpdateModal = () => {
    setIsTripUpdateModalOpen(true);
  };

  const OpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const CloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const closeTripUpdateModal = () => {
    setIsTripUpdateModalOpen(false);
  };

  const openSortModal = () => {
    setIsSortModalOpen(true);
  };

  const closeSortModal = () => {
    setIsSortModalOpen(false);
  };

  const handleSubscriptionSelect = (option: Option) => {
    // If we're programmatically setting the subscription, don't clear data
    if (isSettingSubscriptionProgrammatically.current) {
      setSelectedSubscription(option);

      return;
    }

    // If subscription matches flight data, always keep the data
    const matchesFlightData = flightData && option.value === flightData.searchParams.subscription_id;

    if (matchesFlightData) {
      setSelectedSubscription(option);

      return;
    }

    // If we're still initializing and have flight data, prevent setting wrong subscription
    // This prevents the dropdown from setting a different subscription during initialization
    if (!hasInitializedSubscription && flightData) {
      return;
    }

    // If initialization is complete and subscription doesn't match, clear flight data
    // This means user manually selected a different subscription
    if (flightData && hasInitializedSubscription) {
      setFlightData(null);
      setShowResults(false);
    }

    setSelectedSubscription(option);
  };

  // Handle search result from search bar
  const handleSearchResult = (data: FlightSearchData) => {
    setFlightData(data);
    // Update searchParams ref whenever flightData is updated
    searchParamsRef.current = data.searchParams;
  };

  // Handle filter changes with debounce for duration slider
  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      // Merge new filters with current filters
      const mergedFilters = { ...filtersRef.current, ...newFilters };

      // Update filters state immediately for visual feedback
      setFilters(mergedFilters);
      // Update ref immediately to ensure latest values are available
      filtersRef.current = mergedFilters;
      setSearchError(null); // Clear error when filters change

      // Check if this is a duration change - debounce it
      const isDurationChange = 'durationRange' in newFilters;

      // Clear existing debounce timer if duration is changing
      if (isDurationChange && durationDebounceTimerRef.current) {
        clearTimeout(durationDebounceTimerRef.current);
      }

      const triggerSearch = (filtersToUse: FilterState) => {
        // Get searchParams from ref (always available) or from flightData (fallback)
        const baseSearchParams = searchParamsRef.current || flightData?.searchParams;

        // Trigger new search with updated filters if we have base search params
        if (baseSearchParams) {
          const searchParams: FlightSearchParams = {
            trip_type: baseSearchParams.trip_type as 'ONE_WAY' | 'ROUND_TRIP',
            subscription_id: baseSearchParams.subscription_id,
            adult: baseSearchParams.adult,
            ...(baseSearchParams.child && { child: baseSearchParams.child }),
            ...(baseSearchParams.infant && { infant: baseSearchParams.infant }),
            origin: baseSearchParams.origin,
            destination: baseSearchParams.destination,
            // Use selected date from date slider if available, otherwise use original departure date
            departure_date: filtersToUse.selectedDate || baseSearchParams.departure_date,
            ...(baseSearchParams.return_date && { return_date: baseSearchParams.return_date }),
            // Add filter parameters to the search
            ...(filtersToUse.selectedAirlines &&
              filtersToUse.selectedAirlines.length > 0 && {
                airlines: filtersToUse.selectedAirlines.join(','),
              }),
            // Add transit filter parameter
            ...(filtersToUse.transit && {
              transit: filtersToUse.transit,
            }),
            // Add travel class filter parameter
            ...(filtersToUse.travelClass && {
              travel_class: filtersToUse.travelClass,
            }),
            // Add departure time filter parameter
            ...(filtersToUse.departureTime &&
              filtersToUse.departureTime.length > 0 && {
                departure_time: filtersToUse.departureTime[0],
              }),
            // Add arrival time filter parameter
            ...(filtersToUse.arrivalTime &&
              filtersToUse.arrivalTime.length > 0 && {
                arrival_time: filtersToUse.arrivalTime[0],
              }),
            // Add duration filter parameters (convert hours to minutes)
            // Only include duration filters if they're not the default [0, 24]
            ...(filtersToUse.durationRange &&
              (filtersToUse.durationRange[0] !== 0 || filtersToUse.durationRange[1] !== 24) && {
                min_duration: filtersToUse.durationRange[0] * 60, // Convert hours to minutes
                max_duration: filtersToUse.durationRange[1] * 60, // Convert hours to minutes
              }),
          };

          performSearch(searchParams);
        }
      };

      // Debounce duration changes by 800ms, call immediately for other filters
      if (isDurationChange) {
        // For debounced duration, use the merged filters after timeout
        durationDebounceTimerRef.current = setTimeout(() => {
          triggerSearch(filtersRef.current);
          durationDebounceTimerRef.current = null;
        }, 800);
      } else {
        // For immediate filters, use the merged filters directly
        triggerSearch(mergedFilters);
      }
    },
    [flightData?.searchParams, performSearch]
  );

  // Handle date selection from date slider
  const handleDateSelect = useCallback(
    (date: string) => {
      handleFilterChange({ selectedDate: date });
    },
    [handleFilterChange]
  );

  // Reset all filters to default values and trigger new search
  const handleResetFilters = useCallback(() => {
    // Reset filters to default values
    const defaultFilters: FilterState = {
      selectedAirlines: [],
      departureTime: [],
      arrivalTime: [],
      durationRange: [0, 24],
      selectedDate: undefined,
    };
    setFilters(defaultFilters);
    filtersRef.current = defaultFilters;

    // Get searchParams from ref (always available) or from flightData (fallback)
    const baseSearchParams = searchParamsRef.current || flightData?.searchParams;

    // Trigger new search with basic parameters (no filters)
    if (baseSearchParams) {
      const basicSearchParams: FlightSearchParams = {
        trip_type: baseSearchParams.trip_type as 'ONE_WAY' | 'ROUND_TRIP',
        subscription_id: baseSearchParams.subscription_id,
        adult: baseSearchParams.adult,
        ...(baseSearchParams.child && { child: baseSearchParams.child }),
        ...(baseSearchParams.infant && { infant: baseSearchParams.infant }),
        origin: baseSearchParams.origin,
        destination: baseSearchParams.destination,
        departure_date: baseSearchParams.departure_date,
        ...(baseSearchParams.return_date && { return_date: baseSearchParams.return_date }),
        // No filter parameters - basic search only
      };

      performSearch(basicSearchParams);
    }
  }, [flightData?.searchParams, performSearch]);

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <div className="dark:xl:max-w-[85%] dark:max-w-[90%] xl:max-w-[85%] max-w-[90%] mx-auto dark:pb-10 pb-10 md:mt-0 mt-30 lg:pt-30 dark:md:py-30 md:py-30">
          <FlightSearchBar
            onSearch={handleSearch}
            subscriptions={subscriptions}
            selectedSubscription={selectedSubscription}
            onSubscriptionSelect={handleSubscriptionSelect}
            baseSearchParams={flightData?.searchParams || null}
            onSearchResult={handleSearchResult}
            onPerformSearch={performSearch}
          />
          <div className="flex justify-between items-center px-5 w-full lg:hidden z-10 sticky top-[83px] bg-white dark:bg-black py-5">
            <button
              onClick={openTripUpdateModal}
              className="dark:text-white hover:text-Teal-500 transition-colors duration-200 cursor-pointer"
            >
              Trip Update
            </button>
            <div onClick={OpenFilterModal} className="flex gap-1.5 items-center">
              <FilterIconM className="-mt-1" />
              Filter
            </div>
            <div onClick={openSortModal} className="flex gap-2 items-center">
              <SortIcon className="text-Teal-500" />
              Sort by
            </div>
          </div>
          <DateSlider selectedDate={filters.selectedDate} onDateSelect={handleDateSelect} />
          {searchError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mx-5 mt-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-800 dark:text-red-200 text-sm font-medium">{searchError}</p>
                </div>
                <button
                  onClick={() => setSearchError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors flex-shrink-0"
                  aria-label="Close error message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {(() => {
            // Check if we have valid flight data
            const hasFlightData =
              flightData &&
              ((flightData.outbound && flightData.outbound.length > 0) ||
                (flightData.return && flightData.return.length > 0));

            // Show NoResultFound only if showResults is true AND we don't have flight data
            if (showResults && !hasFlightData) {
              return <NoResultFound />;
            }

            // Show results if we have flight data (regardless of showResults state)
            if (hasFlightData) {
              return (
                <div className="bg-blue-150 dark:bg-black dark:py-0 py-10 lg:py-20">
                  <div className="dark:max-w-full xl:max-w-[85%] max-w-[90%] mx-auto">
                    <div className="flex justify-between flex-wrap items-start gap-8 dark:mt-5 dark:lg:mt-20 dark:xl:mt-10 mt-10 md:mt-20">
                      <div className="xl:w-[calc(30%_-_16px)] w-full xl:mt-20 xl:block hidden">
                        <LeftPannel
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          onResetFilters={handleResetFilters}
                          loading={loading}
                        />
                      </div>
                      <div className="xl:w-[calc(70%_-_16px)] w-full xl:mt-5">
                        <RightPannel flightData={flightData} loading={loading} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Default: show nothing (or loading state)
            return null;
          })()}
        </div>
        <Footer />
        <TripUpdateModal isOpen={isTripUpdateModalOpen} onClose={closeTripUpdateModal} />
        <FilterMobileModal
          isOpen={isFilterModalOpen}
          onClose={CloseFilterModal}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          loading={loading}
        />
        <SortModal isOpen={isSortModalOpen} onClose={closeSortModal} />
      </Suspense>
    </Fragment>
  );
};

export default Ticket;
