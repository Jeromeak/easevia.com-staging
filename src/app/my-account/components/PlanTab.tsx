'use client';
import { AddIcon, ArrowDown, ArrowLeft, DownloadInvoiceIcon, MapIcon, SmallArrowIcon, ThunderIcon } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import gsap from 'gsap';
import { fetchPassengersOnce } from '@/services/passengerCache';
import {
  fetchSubscriptions,
  addPassengersToSubscription,
  downloadSubscriptionInvoice,
  fetchSubscriptionPackageODPairs,
  linkSubscriptionPackageOD,
} from '@/lib/api/subscription';
import type { Subscription, SubscriptionPassenger, PackageODRoute } from '@/lib/types/api/subscription';
import { SubscriptionSkeletonList } from './SubscriptionCardSkeleton';
import { usePassengerManagement } from '@/context/hooks/usePassengerManagement';
import { usePassengerFlow } from '@/hooks/usePassengerFlow';
import { Modal } from '@/app/authentication/components/Modal';
import clsx from 'clsx';

interface TravellersTabProps {
  setActiveTab?: (tab: string) => void;
}

//* Transform API subscription data to match UI format
const transformSubscriptionData = (subscription: Subscription) => {
  const formatDate = (dateString: string): string => {
    return moment(dateString).format('MMM D, YYYY');
  };

  const normalizeRouteCount = (value: unknown): number | null => {
    if (typeof value === 'number') {
      return Number.isNaN(value) ? null : value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);

      return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
  };

  return {
    id: subscription?.id?.toString(),
    name: subscription?.package || '',
    Sub_Id: subscription?.subscription_number || `SUB_${subscription?.id}`,
    validDate: formatDate(subscription?.start_date),
    billingAmount: `$${subscription?.price}`,
    trips: { total: subscription?.trip_count || 0, used: subscription?.travelled_trip_count || 0 },
    dateChanges: {
      total: subscription?.allowed_date_change_count || 0,
      used: subscription?.used_date_change_count || 0,
    },
    validTill: formatDate(subscription?.end_date),
    passengers: subscription?.passengers || [],
    memberCount: subscription?.member_count || 0,
    allowed_route_count: normalizeRouteCount(subscription?.allowed_route_count),
  };
};

const fetchTheAgeFromDOB = (date_of_birth: string): string => {
  const birthDate = moment(date_of_birth);
  const today = moment(); //* current date

  const age = today.diff(birthDate, 'years');

  return `${age} years`;
};

export const PlanTab: React.FC<TravellersTabProps> = () => {
  const router = useRouter();
  const {
    pendingPassengers,
    planErrors,
    openDetails,
    openDropdowns,
    selectedPassengers,
    addPendingPassenger,
    removePendingPassenger,
    clearPendingPassengers,
    setPlanError,
    toggleDetails,
    setOpenDropdowns,
    setSelectedPassenger,
    canAddMorePassengers,
  } = usePassengerManagement();

  const { navigateToAddPassenger } = usePassengerFlow();

  const [plansData, setPlansData] = useState<
    Array<{
      id: string;
      name: string;
      Sub_Id: string;
      validDate: string;
      billingAmount: string;
      trips: { total: number; used: number };
      dateChanges: { total: number; used: number };
      validTill: string;
      passengers: SubscriptionPassenger[];
      memberCount: number;
      allowed_route_count: number | null;
    }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState<SubscriptionPassenger[]>([]);
  const [savedPassengerIds, setSavedPassengerIds] = useState<Set<string>>(new Set());
  const [routesBySubscription, setRoutesBySubscription] = useState<Record<string, PackageODRoute[]>>({});
  const [pendingRoutes, setPendingRoutes] = useState<Record<string, PackageODRoute[]>>({});
  const [savedRoutes, setSavedRoutes] = useState<Record<string, PackageODRoute[]>>({});
  const [routeError, setRouteError] = useState<Record<string, string | null>>({});
  const [routeDropdowns, setRouteDropdowns] = useState<Record<string, boolean>>({});
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const routeDropdownRef = useRef<HTMLDivElement>(null);

  const navigatePlans = useCallback(() => router.push('/plans'), [router]);
  const navigateToBooking = useCallback(() => router.push('/booking'), [router]);
  const onInvoiceClick = useCallback((id: string) => () => handleDownloadInvoice(id), []);
  const onTogglePassengerDropdown = useCallback(
    (planId: string) => () => setOpenDropdowns(planId, !openDropdowns[planId]),
    [openDropdowns, setOpenDropdowns]
  );
  const onRemovePendingPassenger = useCallback(
    (planId: string, passengerId: string) => () => removePendingPassenger(planId, passengerId),
    [removePendingPassenger]
  );
  const onAddPassengersClick = useCallback(
    (planId: string) => () => {
      const pendingPassengersList = pendingPassengers[planId] || [];

      if (pendingPassengersList.length > 0) {
        // Open the confirmation modal
        setCurrentPlanId(planId);
        setShowSaveModal(true);
      }
    },
    [pendingPassengers]
  );

  const handleAddNewPassenger = useCallback(
    (planId: string) => {
      const currentPlan = plansData.find((plan) => plan.id === planId);
      if (!currentPlan) return;

      if (!canAddMorePassengers(planId, currentPlan.passengers, currentPlan.memberCount)) {
        setPlanError(planId, `Cannot add more passengers. Maximum allowed: ${currentPlan.memberCount}`);

        return;
      }

      navigateToAddPassenger(planId);
    },
    [plansData, canAddMorePassengers, setPlanError, navigateToAddPassenger]
  );

  const onAddNewPassengerClick = useCallback(
    (planId: string) => () => handleAddNewPassenger(planId),
    [handleAddNewPassenger]
  );

  //* Load subscriptions and passengers from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        //* Fetch subscriptions and passengers in parallel
        const [subscriptions, allPassengers] = await Promise.all([fetchSubscriptions(), fetchPassengersOnce()]);

        //* Set passengers data
        setPassengers(allPassengers);

        //* Transform API data to match UI format
        const transformedData = subscriptions.map(transformSubscriptionData);
        setPlansData(transformedData);

        //* Track saved passenger IDs from all subscriptions
        const allSavedPassengerIds = new Set<string>();
        const initialSavedRoutes: Record<string, PackageODRoute[]> = {};
        subscriptions.forEach((subscription) => {
          subscription.passengers.forEach((passenger) => {
            allSavedPassengerIds.add(passenger.id);
          });

          if (Array.isArray(subscription.package_od) && subscription.package_od.length > 0) {
            initialSavedRoutes[String(subscription.id)] = subscription.package_od;
          }
        });
        setSavedPassengerIds(allSavedPassengerIds);

        setSavedRoutes(initialSavedRoutes);
      } catch (fetchError) {
        console.error('Failed to fetch data:', fetchError);
        setError('Failed to load data');
        //* Fallback to dummy data on error
        setPlansData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  //* GSAP animation for subscription cards
  useEffect(() => {
    if (!loading && plansRef.current && plansData.length > 0) {
      const cards = plansRef.current.querySelectorAll('.subscription-card');

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
        }
      );
    }
  }, [loading, plansData]);

  const handleSelect = (option: SubscriptionPassenger, planId: string) => {
    const currentPlan = plansData.find((plan) => plan.id === planId);
    if (!currentPlan) return;

    if (!canAddMorePassengers(planId, currentPlan.passengers, currentPlan.memberCount)) {
      setPlanError(planId, `Cannot add more passengers. Maximum allowed: ${currentPlan.memberCount}`);

      return;
    }

    addPendingPassenger(planId, option);
    setSelectedPassenger(planId, null);
    setOpenDropdowns(planId, false);
    inputRef.current?.blur();
  };

  const handleDownloadInvoice = async (subscriptionId: string) => {
    try {
      const blob = await downloadSubscriptionInvoice(subscriptionId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${subscriptionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error('Failed to download invoice:', downloadError);
    }
  };

  const handleRouteDropdownClick = useCallback((planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRouteDropdowns((prev: Record<string, boolean>) => ({ ...prev, [planId]: !prev[planId] }));
  }, []);
  const handleRouteDropdownBlur = useCallback((planId: string) => {
    setTimeout(() => setRouteDropdowns((prev: Record<string, boolean>) => ({ ...prev, [planId]: false })), 150);
  }, []);

  const handleRouteSelect = useCallback(
    (planId: string, route: PackageODRoute, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      const plan = plansData.find((p) => p.id === planId);
      if (!plan) return;

      const allowedRoutes =
        typeof plan.allowed_route_count === 'number' && !Number.isNaN(plan.allowed_route_count)
          ? plan.allowed_route_count
          : null;

      if (allowedRoutes !== null) {
        const savedCount = savedRoutes[planId]?.length || 0;
        const pendingCount = pendingRoutes[planId]?.length || 0;
        const totalSelected = savedCount + pendingCount;

        if (totalSelected >= allowedRoutes) {
          const message = `You can select up to ${allowedRoutes} route${allowedRoutes === 1 ? '' : 's'}.`;
          setRouteError((prev) => ({ ...prev, [planId]: message }));
          setTimeout(() => setRouteError((prev) => ({ ...prev, [planId]: null })), 4000);

          return;
        }
      }

      if (planId) {
        setPendingRoutes((prev) => {
          const existing = prev[planId] || [];
          if (existing.some((r) => r.id === route.id)) return prev;

          return { ...prev, [planId]: [...existing, route] };
        });
      }

      // Keep placeholder text; do not set a selected value in the input
    },
    [plansData, savedRoutes, pendingRoutes]
  );

  const onSelectSavedPassenger = useCallback(
    (planId: string, option: SubscriptionPassenger) => () => handleSelect(option, planId),
    [handleSelect]
  );
  const onRouteDropdownClickFactory = useCallback(
    (planId: string) => (e: React.MouseEvent) => handleRouteDropdownClick(planId, e),
    [handleRouteDropdownClick]
  );
  const onRouteDropdownBlurFactory = useCallback(
    (planId: string) => () => handleRouteDropdownBlur(planId),
    [handleRouteDropdownBlur]
  );
  const onAddRoutesClick = useCallback(
    (planId: string) => async () => {
      const pending = pendingRoutes[planId] || [];
      if (pending.length === 0) return;

      try {
        await linkSubscriptionPackageOD(
          planId,
          pending.map((r) => r.id)
        );
        setSavedRoutes((prev) => ({ ...prev, [planId]: [...(prev[planId] || []), ...pending] }));
        setPendingRoutes((prev) => ({ ...prev, [planId]: [] }));
        setRouteError((prev) => ({ ...prev, [planId]: null }));
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Failed to save routes';
        setRouteError((prev) => ({ ...prev, [planId]: message }));
        setTimeout(() => setRouteError((prev) => ({ ...prev, [planId]: null })), 4000);
      }
    },
    [pendingRoutes]
  );

  const ensureRoutesLoaded = useCallback(
    async (subscriptionId: string) => {
      if (!subscriptionId) return;
      if (routesBySubscription[subscriptionId]?.length) return;

      try {
        const routes = await fetchSubscriptionPackageODPairs(subscriptionId);
        setRoutesBySubscription((prev) => ({ ...prev, [subscriptionId]: routes }));
      } catch {
        // ignore and keep static options
      }
    },
    [routesBySubscription]
  );

  const removePendingRoute = useCallback((planId: string, routeId: string) => {
    setPendingRoutes((prev) => {
      const list = prev[planId] || [];
      const next = list.filter((r) => r.id !== routeId);

      return { ...prev, [planId]: next };
    });
  }, []);

  const getRouteOptionItems = useCallback(
    (planId: string) => {
      const options = routesBySubscription[planId] || [];
      const pendingIds = new Set((pendingRoutes[planId] || []).map((r) => r.id));
      const savedIds = new Set((savedRoutes[planId] || []).map((r) => r.id));
      const filtered = options.filter((o) => !pendingIds.has(o.id) && !savedIds.has(o.id));

      return filtered.map((route) => {
        const originCity = route.origin_airport_city_name?.toUpperCase() || '';
        const originCode = route.origin_airport_code || '';
        const destCity = route.destination_airport_city_name?.toUpperCase() || '';
        const destCode = route.destination_airport_code || '';

        let label = '';

        if (originCity && originCode && destCity && destCode) {
          label = `${originCity} (${originCode}) → ${destCity} (${destCode})`;
        } else if (originCode && destCode) {
          label = `${originCode} → ${destCode}`;
        } else {
          label = `${route.origin_airport || ''} → ${route.destination_airport || ''}`;
        }

        return { value: label, route };
      });
    },
    [routesBySubscription, pendingRoutes, savedRoutes, handleRouteSelect]
  );

  const handleRouteItemClick = useCallback(
    (planId: string, route: PackageODRoute) => (e: React.MouseEvent) => handleRouteSelect(planId, route, e),
    [handleRouteSelect]
  );

  return (
    <div className="w-full ">
      <div className="w-full lg:flex hidden lg:static sticky top-[84px] z-100  justify-center gap-2 md:gap-0 md:justify-between rounded-e-sm items-center px-5 md:px-8 py-3 md:py-0 flex-wrap md:h-20 bg-blue-150 dark:bg-gray-300">
        <div className="md:text-32 text-2xl md:leading-8 text-neutral-50 dark:text-white uppercase font-Neutra">
          Your Subscription Plan{plansData.length > 1 ? 's' : ''}
        </div>
        <div>
          <button
            onClick={navigatePlans}
            className="bg-Teal-500 Teal  text-white px-5 flex items-center gap-2 uppercase text-sm cursor-pointer py-1.5 rounded-full"
          >
            <AddIcon />
            <div>Add Plan</div>
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:mt-0 mt-36 md:mt-20  gap-5 w-full p-5" ref={plansRef}>
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          //* Show skeleton loaders
          <div className="space-y-6">{<SubscriptionSkeletonList />}</div>
        ) : (
          //* Show subscription cards
          plansData.map((plan) => (
            <div
              key={plan?.id}
              className="w-full flex flex-col bg-[#E6F2F2]  dark:bg-gray-300 rounded-2xl p-5 md:p-8 subscription-card"
            >
              <div
                className={` ${openDetails[plan?.id] ? '' : '!pb-0 md:!pb-0'} flex w-full justify-between items-center  `}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 ">
                    <div className="p-[5px] md:p-[8px] shadow-9xl bg-white dark:bg-black rounded-lg">
                      <div>
                        <ThunderIcon id="thunder" />
                      </div>
                    </div>
                    <div className="font-Neutra md:text-41 text-2xl md:leading-[58.71px]  tracking-[-0.419px] uppercase text-orange-200">
                      {plan.name}
                    </div>
                  </div>
                </div>
                <div className="lg:flex hidden flex-col gap-2">
                  <div className="text-xs uppercase dark:text-white">VALID to date: {plan?.validTill}</div>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={navigatePlans}
                      className="flex Teal text-xs md:text-sm gap-2 md:gap-3  text-white bg-Teal-500 rounded-full px-2 md:px-4 py-1 md:py-1 cursor-pointer  uppercase leading-4 items-center justify-center w-fit"
                    >
                      <div>Upgrade</div>
                      <ArrowLeft width="24" height="24" className="transform rotate-180" />
                    </button>
                    <div
                      className="cursor-pointer"
                      onClick={async () => {
                        toggleDetails(plan?.id);
                        await ensureRoutesLoaded(plan?.id);
                      }}
                    >
                      <ArrowDown
                        width="24"
                        height="24"
                        className={`text-[#737373] transition-transform duration-300 ${openDetails[plan?.id] ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex lg:hidden">
                  <button
                    onClick={onInvoiceClick(plan?.id)}
                    className="w-fit border-2  cursor-pointer uppercase font-medium border-Light py-0.5 px-2 rounded-full text-Light text-[10px] flex gap-2 items-center justify-center"
                  >
                    Invoice
                    <DownloadInvoiceIcon width="12" height="12" />
                  </button>
                </div>
              </div>
              <div
                className={`flex gap-3 justify-between w-full items-center mt-2  ${openDetails[plan?.id] ? 'pb-4' : '!pb-0'}`}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-xs uppercase text-black dark:text-white">Subscription ID : {plan?.Sub_Id}</div>
                  <div className="text-xs lg:hidden block uppercase dark:text-white">
                    VALID to date: {plan?.validTill}
                  </div>
                </div>

                <button
                  onClick={onInvoiceClick(plan?.id)}
                  className="w-fit border-2 hidden lg:flex  cursor-pointer uppercase font-medium border-Light py-1 px-4 rounded-full text-Light text-xs  gap-2 items-center justify-center"
                >
                  Invoice
                  <DownloadInvoiceIcon width="16" height="16" />
                </button>
                <div className="lg:hidden flex gap-1 items-center">
                  <button
                    onClick={navigatePlans}
                    className="flex Teal text-[10px] md:text-sm gap-1 md:gap-3  text-white bg-Teal-500 rounded-full px-1 md:px-4 py-0.5 md:py-1 cursor-pointer  uppercase leading-4 items-center justify-center w-fit"
                  >
                    <div>Upgrade</div>
                    <ArrowLeft width="12" height="12" className="transform rotate-180" />
                  </button>
                  <div
                    className="cursor-pointer"
                    onClick={async () => {
                      toggleDetails(plan?.id);
                      await ensureRoutesLoaded(plan?.id);
                    }}
                  >
                    <ArrowDown
                      width="24"
                      height="24"
                      className={`text-[#737373] transition-transform duration-300 ${openDetails[plan?.id] ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col border-t-[#8AD0D0] dark:border-t-[#343434] border-t-1 w-full overflow-hidden transition-all duration-500 ease-in-out ${
                  openDetails[plan?.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex justify-center md:justify-between gap-3 md:gap-0 flex-wrap items-start w-full pt-4 md:pt-8 ">
                  <div className="flex flex-col md:items-start  items-center w-full md:w-fit">
                    <div className="text-base text-[#9EA2AD] leading-[33.421px] uppercase">BILLING AMOUNT</div>
                    <div className="text-Teal-500 text-2xl">{plan?.billingAmount}</div>
                  </div>
                  <div className="flex flex-col md:items-start items-center w-full md:w-fit">
                    <div className="text-base text-[#9EA2AD] leading-[33.421px] uppercase flex items-center gap-2 ">
                      No of Trips
                      <div className="w-[25px] h-[25px] rounded-sm flex justify-center bg-orange-200 px-1 text-base text-white dark:text-black">
                        {plan?.trips.total}
                      </div>
                    </div>
                    <div className="text-base dark:text-white leading-[33.421px] uppercase flex items-center gap-2 ">
                      Used
                      <div className="w-[25px] h-[25px] items-center rounded-sm flex justify-center bg-Teal-500 px-1 text-base text-white">
                        {plan?.trips.used}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-start items-center w-full md:w-fit">
                    <div className="text-base text-[#9EA2AD] leading-[33.421px] uppercase flex items-center gap-2 ">
                      Free Date Chang
                      <div className="w-[25px] h-[25px] rounded-sm flex justify-center bg-orange-200 px-1 text-base text-white dark:text-black">
                        {plan?.dateChanges.total}
                      </div>
                    </div>
                    <div className="text-base dark:text-white leading-[33.421px] uppercase flex items-center gap-2 ">
                      Used
                      <div className="w-[25px] h-[25px] rounded-sm flex justify-center items-center bg-Teal-500 px-1 text-base  text-white">
                        {plan?.dateChanges?.used}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-start items-center w-full md:w-fit">
                    <button
                      type="button"
                      onClick={navigateToBooking}
                      className="bg-orange-200 text-white dark:text-black text-xs gap-2 mt-2 md:mt-5.5 cursor-pointer  uppercase py-2 md:py-1 px-5 duration-500 rounded-full flex items-center justify-center w-fit"
                    >
                      Book Ticket
                      <ArrowLeft width="16" height="16" className="rotate-180" />
                    </button>
                  </div>
                </div>

                <div className="md:mt-14 mt-5 md:px-6 py-4 border-t-[#8AD0D0] md:py-8 w-full border-t dark:border-t-[#343434]  flex flex-col">
                  <div className="flex justify-between items-start  py-4">
                    <div className="flex flex-col">
                      <div className="text-neutral-50 dark:text-white text-base md:text-lg uppercase font-medium">
                        ADD PASSENGERS
                      </div>
                      <div className="text-[#9EA2AD] text-[10px] md:text-sm mt-1">YOU CAN ADD 4 PASSENGERS</div>
                    </div>
                    <button
                      onClick={onAddNewPassengerClick(plan.id)}
                      className="flex px-3 py-0.5 lg:py-1 cursor-pointer justify-center items-center rounded-full border-[1.5px] border-[#009898] text-[#009898] text-sm uppercase font-medium gap-2"
                    >
                      <span className="text-lg">+</span>
                      <div className="md:block hidden"> ADD NEW PASSENGERS</div>
                      <div className="md:hidden block text-[10px]"> PASSENGERS</div>
                    </button>
                  </div>
                  <div className="flex gap-2 md:gap-5 flex-wrap items-start">
                    <div className="md:w-[50%] w-full xl:w-[30%] ">
                      <div className="relative">
                        <input
                          ref={inputRef}
                          value={selectedPassengers[plan.id]?.name || ''}
                          onClick={onTogglePassengerDropdown(plan.id)}
                          onBlur={() => setTimeout(() => setOpenDropdowns(plan.id, false), 150)}
                          readOnly
                          className="w-full border cursor-pointer border-[#E5E5E5] dark:border-[#343434] placeholder:text-[7C797E] placeholder:text-sm px-5 py-1.5 rounded-sm outline-none bg-white dark:bg-[#161616]"
                          placeholder="Add saved passenger"
                        />
                        <div
                          onClick={onTogglePassengerDropdown(plan.id)}
                          className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                        >
                          <ArrowDown
                            className={(openDropdowns[plan.id] && 'rotate-180 duration-300') || 'duration-300'}
                          />
                        </div>
                      </div>
                      <div
                        className={` top-full w-[350px] scroll left-0 z-[10000]  bg-white dark:bg-[#161616] border border-[#E5E5E5] dark:border-inputsecondary rounded-md mt-1 transition-all duration-300 ease-in-out ${
                          openDropdowns[plan.id]
                            ? 'max-h-[300px] opacity-100 overflow-y-auto'
                            : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'
                        }`}
                      >
                        {(() => {
                          const availablePassengers = passengers.filter(
                            (passenger) =>
                              !plansData.some((planData) => planData.passengers.some((p) => p.id === passenger.id)) &&
                              !(pendingPassengers[plan.id] || []).some((p) => p.id === passenger.id)
                          );

                          if (availablePassengers.length === 0) {
                            return (
                              <div className="px-4 py-2 text-[#737373] dark:text-[#737373] cursor-not-allowed opacity-50">
                                <div className="font-medium text-xs">Passenger not available</div>
                              </div>
                            );
                          }

                          return availablePassengers.map((option) => (
                            <div
                              key={option.id}
                              onClick={onSelectSavedPassenger(plan.id, option)}
                              className="px-4 py-2  dark:text-white hover:bg-blue-150 dark:hover:bg-black duration-500 cursor-pointer border-b border-[#E5E5E5] dark:border-[#000] last:border-b-0"
                            >
                              <div className="flex justify-between items-center">
                                <div className="font-medium text-xs ">{option.name}</div>
                                <div className="text-xs text-[#737373] dark:border-[#4D4D51] border-[#E5E5E5] border-x-2 px-5">
                                  {/* Assuming gender and id are available in the option object */}
                                  {/* This part needs to be adjusted based on the actual passenger data structure */}
                                  {/* For now, using placeholder values */}
                                  <span>Male</span>
                                  <span>E1234567G</span>
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                    <div className="md:w-fit w-full md:mt-0 mt-4">
                      <button
                        type="button"
                        role="button"
                        onClick={onAddPassengersClick(plan.id)}
                        disabled={(pendingPassengers[plan.id] || []).length === 0}
                        className={`px-8 py-1.5 md:py-2 rounded-full w-full md:w-fit border duration-500 uppercase md:text-base text-sm ${
                          (pendingPassengers[plan.id] || []).length > 0
                            ? 'bg-Teal-500 hover:bg-transparent hover:border-Teal-500 border-transparent hover:text-Teal-500 text-white cursor-pointer'
                            : 'opacity-20 bg-Teal-500 text-white border-0 cursor-not-allowed'
                        }`}
                      >
                        save passenger
                      </button>
                    </div>
                  </div>

                  {/* Error message display */}
                  {planErrors[plan.id] && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        {planErrors[plan.id]}
                      </p>
                    </div>
                  )}

                  {/* Existing saved passengers */}
                  {plan?.passengers.length > 0 &&
                    plan?.passengers.map((passenger) => (
                      <div key={`saved-${passenger?.id}`} className="flex justify-between items-center mt-8 ">
                        <div className="flex gap-3 items-center">
                          <div className="flex uppercase text-black font-Neutra text-xl justify-center items-center bg-Teal-500 md:w-12 w-8 h-8 md:h-12 rounded-full">
                            {passenger?.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <div className="text-sm md:text-xl font-medium dark:text-white">{passenger?.name}</div>
                            <div className="text-[#94949C] text-xs md:text-sm">
                              {passenger?.gender}, {fetchTheAgeFromDOB(passenger?.date_of_birth || '')},{' '}
                              {passenger?.relationship_with_user}
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            role="button"
                            disabled={true}
                            className="border uppercase duration-500 text-xs md:text-sm rounded-full py-2 flex items-center gap-2 px-5 border-gray-500 text-gray-500 cursor-not-allowed opacity-50"
                          >
                            <div>Remove</div>
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* Pending passengers (can be removed before save) */}
                  {(pendingPassengers[plan.id] || []).map((passenger) => (
                    <div key={`pending-${passenger?.id}`} className="flex justify-between items-center mt-8 ">
                      <div className="flex gap-3 items-center">
                        <div className="flex uppercase text-black font-Neutra text-xl justify-center items-center bg-orange-200 md:w-12 w-8 h-8 md:h-12 rounded-full">
                          {passenger?.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm md:text-xl font-medium uppercase dark:text-white">
                            {passenger?.name} <span className="text-orange-200 text-xs">(Pending)</span>
                          </div>
                          <div className="text-[#94949C] text-xs md:text-sm">
                            {passenger?.gender}, {fetchTheAgeFromDOB(passenger?.date_of_birth || '')},{' '}
                            {passenger?.relationship_with_user}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          type="button"
                          role="button"
                          onClick={onRemovePendingPassenger(plan.id, passenger.id)}
                          className="border uppercase hover:bg-Teal-500 hover:text-black duration-500 text-Teal-500 text-xs md:text-sm cursor-pointer border-Teal-500 rounded-full py-2 flex items-center gap-2 px-5"
                        >
                          <div>Remove</div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex justify-between flex-col lg:flex-row items-center w-full lg:px-6 py-4">
                    <div className="flex flex-col text-left w-full lg:w-fit">
                      <div className="text-neutral-50 dark:text-white text-lg uppercase font-medium">
                        CHOOSE YOUR ROUTE
                      </div>
                      <div className="text-[#9EA2AD] text-sm mt-1 ">
                        {typeof plan.allowed_route_count === 'number' && !Number.isNaN(plan.allowed_route_count)
                          ? `YOU CAN SELECT ${plan.allowed_route_count} ROUTE${plan.allowed_route_count === 1 ? '' : 'S'}`
                          : 'YOU CAN SELECT ROUTES'}
                      </div>
                    </div>
                    <div className="flex items-center flex-col lg:flex-row gap-4 w-full mt-3 lg:mt-0 lg:w-fit">
                      <div className="relative w-full lg:w-fit">
                        <div
                          ref={routeDropdownRef}
                          onClick={onRouteDropdownClickFactory(plan.id)}
                          onBlur={onRouteDropdownBlurFactory(plan.id)}
                          className="flex lg:max-w-[300px] lg:min-w-[200px] h-[34px] px-3 py-[5px] justify-between items-center rounded border border-[#E5E5E5] dark:border-[#343434] bg-white dark:bg-[#161616] cursor-pointer"
                        >
                          <span className="text-[#9EA2AD] text-sm">Choose Route</span>
                          <ArrowDown
                            width="16"
                            height="16"
                            className={clsx(
                              'text-[#9EA2AD] transition-transform duration-300',
                              routeDropdowns[plan.id] ? 'rotate-180' : ''
                            )}
                          />
                        </div>
                        <div
                          className={clsx(
                            'absolute top-full left-0 w-[280px] bg-white dark:bg-black rounded-md overflow-hidden mt-1 transition-all duration-300 ease-in-out z-20 shadow-lg',
                            routeDropdowns[plan.id] ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                          )}
                        >
                          {(() => {
                            const availableRoutes = getRouteOptionItems(plan.id);

                            if (availableRoutes.length === 0) {
                              return (
                                <div className="px-4 py-3 text-[#737373] dark:text-[#737373] cursor-not-allowed opacity-50">
                                  <div className="text-sm font-medium">Route not available</div>
                                </div>
                              );
                            }

                            return availableRoutes.map((item, index) => (
                              <div
                                key={`route-${index}-${item.value}`}
                                onClick={handleRouteItemClick(plan.id, item.route)}
                                className="px-4 py-3 text-neutral-50 dark:text-white text-sm font-medium hover:bg-[#009898] duration-300 cursor-pointer whitespace-nowrap"
                              >
                                {item.value}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                      <button
                        className="w-full lg:w-fit flex h-8 px-3 py-2 justify-center items-center rounded-full bg-[#009898] text-white uppercase text-sm cursor-pointer hover:bg-[#007777] duration-500 whitespace-nowrap"
                        onClick={onAddRoutesClick(plan.id)}
                      >
                        ADD ROUTE
                      </button>
                    </div>
                  </div>

                  <div className="lg:px-6 pb-4 space-y-3">
                    {routeError[plan.id] && <div className="text-red-400 text-sm">{routeError[plan.id]}</div>}
                    {(pendingRoutes[plan.id] || []).map((route) => (
                      <div key={`pending-route-${route.id}`} className="flex items-center gap-6">
                        <div className="flex items-start gap-3">
                          <MapIcon className="text-[#A3A3A3] mt-2" width="12" height="13" />
                          <div className="flex flex-col">
                            <div className="text-neutral-50 dark:text-white text-[16px] font-medium">
                              {route.origin_airport_city_name || route.origin_airport}
                            </div>
                            <div className="text-[#9EA2AD] text-xs">
                              {route.origin_airport} {route.origin_airport_code ? `(${route.origin_airport_code})` : ''}
                            </div>
                          </div>
                        </div>
                        <SmallArrowIcon
                          width="24"
                          height="16"
                          className="text-neutral-50 dark:text-[#9EA2AD] flex-shrink-0"
                        />
                        <div className="flex items-start gap-3">
                          <MapIcon className="text-[#A3A3A3] mt-2" width="12" height="13" />
                          <div className="flex flex-col">
                            <div className="text-neutral-50 dark:text-white text-[16px] font-medium">
                              {route.destination_airport_city_name || route.destination_airport}
                            </div>
                            <div className="text-[#9EA2AD] text-xs">
                              {route.destination_airport}{' '}
                              {route.destination_airport_code ? `(${route.destination_airport_code})` : ''}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1" />
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-orange-200 text-xs">Pending</div>
                          <button
                            type="button"
                            role="button"
                            onClick={() => removePendingRoute(plan.id, route.id)}
                            className="border uppercase hover:bg-Teal-500 hover:text-black duration-500 text-Teal-500 text-xs md:text-sm cursor-pointer border-Teal-500 rounded-full py-2 flex items-center gap-2 px-5"
                          >
                            <div>Remove</div>
                          </button>
                        </div>
                      </div>
                    ))}
                    {(savedRoutes[plan.id] || []).map((route) => (
                      <div key={`saved-route-${route.id}`} className="flex items-center gap-6">
                        <div className="flex items-start gap-3">
                          <MapIcon className="text-[#A3A3A3] mt-2" width="12" height="13" />
                          <div className="flex flex-col">
                            <div className="text-neutral-50 dark:text-white text-[16px] font-medium">
                              {route.origin_airport_city_name || route.origin_airport}
                            </div>
                            <div className="text-[#9EA2AD] text-xs">
                              {route.origin_airport} {route.origin_airport_code ? `(${route.origin_airport_code})` : ''}
                            </div>
                          </div>
                        </div>
                        <SmallArrowIcon
                          width="24"
                          height="16"
                          className="text-neutral-50 dark:text-[#9EA2AD] flex-shrink-0"
                        />
                        <div className="flex items-start gap-3">
                          <MapIcon className="text-[#A3A3A3] mt-2" width="12" height="13" />
                          <div className="flex flex-col">
                            <div className="text-neutral-50 dark:text-white text-[16px] font-medium">
                              {route.destination_airport_city_name || route.destination_airport}
                            </div>
                            <div className="text-[#9EA2AD] text-xs">
                              {route.destination_airport}{' '}
                              {route.destination_airport_code ? `(${route.destination_airport_code})` : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && plansData.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center py-16 text-center">
            <div className="text-gray-400 text-lg mb-2">No subscriptions found</div>
            <div className="text-gray-500 text-sm mb-6">Get started by adding your first subscription plan</div>
            <button
              onClick={() => router.push('/plans')}
              className="bg-Teal-500 text-white px-6 py-2 rounded-full hover:bg-Teal-600 transition-colors"
            >
              Browse Plans
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} className="!bg-gray-300">
        <div className="flex flex-col gap-4">
          <p className="text-white text-2xl text-center">
            Once you add passengers to this package, you can't remove them after saving
          </p>
          <div className="flex gap-3 md:flex-row flex-col justify-center mt-4">
            <button
              onClick={async (e) => {
                e.preventDefault();

                //* Call API to add pending passengers to subscription
                if (currentPlanId) {
                  const pendingPassengersList = pendingPassengers[currentPlanId] || [];

                  if (pendingPassengersList.length > 0) {
                    try {
                      const passengerIds = pendingPassengersList.map((p) => p.id);
                      await addPassengersToSubscription(currentPlanId, { passenger_ids: passengerIds });

                      //* Move pending passengers to saved passengers
                      setPlansData((prevPlans) =>
                        prevPlans.map((plan) =>
                          plan.id === currentPlanId
                            ? { ...plan, passengers: [...plan.passengers, ...pendingPassengersList] }
                            : plan
                        )
                      );

                      //* Mark these passengers as saved
                      const newSavedIds = new Set(savedPassengerIds);
                      pendingPassengersList.forEach((passenger) => {
                        newSavedIds.add(passenger.id);
                      });
                      setSavedPassengerIds(newSavedIds);

                      //* Clear pending passengers for this plan
                      clearPendingPassengers(currentPlanId);
                    } catch (error) {
                      console.error('Failed to add passengers:', error);
                      setPlanError(currentPlanId, 'Failed to add passengers. Please try again.');
                    }
                  }
                }

                setShowSaveModal(false);
                setCurrentPlanId(null);
              }}
              className="bg-Teal-500 w-[50%] text-white px-6 uppercase text-sm cursor-pointer py-2 rounded-full hover:bg-opacity-80 duration-500"
            >
              Confirm
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowSaveModal(false);
              }}
              className="bg-transparent border w-[50%] border-Teal-500 text-Teal-500 hover:text-white hover:bg-Teal-500 duration-500 px-6 uppercase text-sm cursor-pointer py-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
