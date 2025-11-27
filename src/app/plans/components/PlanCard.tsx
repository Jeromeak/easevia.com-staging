'use client';
import {
  ArrowLeft,
  DetailArrow,
  FilterIcon,
  InfoIcon,
  LocationIcon,
  PlaneUpIcon,
  RouteIcon,
  ThunderIcon,
  TickIcon,
} from '@/icons/icon';
import Link from 'next/link';
import { PlansButton } from './PlansButton';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Fragment, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { CustomCheckbox } from '@/common/components/CustomCheckBox';
import { PlanCardSkeleton } from './PlanCradSkeleton';
import { PlanCardMobileSkeleton } from './PlanCardMobileSkeleton';
import { FilterPannel } from './FilterPannel';
import { toPlanViewModel } from '../../../services/planViewModel';
import type { TravelPackage } from '@/lib/types/api/package';
import { useCheckout } from '@/context/hooks/useCheckout';
import type { SelectedPlan } from '@/context/checkout.types';
import { RouteModal } from './RouteModal';
import { PLAN_ROUTE_DATA } from '@/lib/enums/constants';

gsap.registerPlugin(ScrollTrigger);
interface PlanCardProps {
  limit?: number;
  setSelectedPlans: (plans: string[]) => void;
  selectedPlans?: string[];
  isLoading?: boolean;
  packages?: TravelPackage[];
  onTravelClassChange?: (selectedClasses: string) => void;
  onAirlinesChange?: (selectedAirlines: string) => void;
  onOriginChange?: (origin: string) => void;
  onDestinationChange?: (destination: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  limit,
  setSelectedPlans,
  selectedPlans,
  isLoading: externalLoading,
  packages,
  onTravelClassChange,
  onAirlinesChange,
  onOriginChange,
  onDestinationChange,
}) => {
  const router = useRouter();
  const { setSelectedPlan } = useCheckout();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedPlanForRoute, setSelectedPlanForRoute] = useState<string | null>(null);
  const [skeletonCount, setSkeletonCount] = useState<number>(limit || 5);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleFilterToggle = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const handlePlanSubscription = useCallback(
    (plan: TravelPackage, vm: ReturnType<typeof toPlanViewModel>) => {
      const planData: SelectedPlan = {
        id: vm.id,
        title: vm.title,
        price: vm.price,
        classLabel: vm.classLabel,
        tripsPerYear: vm.tripsPerYear,
        airlinesLabel: vm.airlinesLabel,
        description: plan.description || '',
        additionalBenefits: plan.additional_benefits?.filter(Boolean) || [],
      };

      setSelectedPlan(planData);
      router.push(`/checkout?packageId=${vm.id}`);
    },
    [setSelectedPlan, router]
  );

  const slicedPlans = useMemo(() => {
    if (!Array.isArray(packages)) return [];

    const seenIds = new Set<string>();

    return packages.filter((p: TravelPackage) => {
      const id: string | undefined = typeof p?.id === 'string' ? p.id : undefined;
      if (id === undefined) return true;
      if (seenIds.has(id)) return false;
      seenIds.add(id);

      return true;
    });
  }, [packages]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      cardRefs.current.forEach((el, index) => {
        if (el) {
          gsap.set(el, { opacity: 0, visibility: 'visible' });

          gsap.fromTo(
            el,
            { x: 100, opacity: 0, scale: 0.95, rotationY: 15 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 1.2,
              ease: 'power3.out',
              delay: index * 0.15,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          const elements = [
            el.querySelector('.plan-icon'),
            el.querySelector('.plan-title'),
            el.querySelector('.plan-tag'),
            el.querySelector('.plan-description'),
            el.querySelector('.plan-price'),
            el.querySelector('.plan-features'),
            el.querySelector('.plan-buttons'),
            el.querySelector('.plan-checkbox'),
          ].filter(Boolean) as Element[];

          elements.forEach((element, idx) => {
            gsap.set(element, { opacity: 0, y: 30 });
            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              delay: index * 0.15 + 0.3 + idx * 0.1,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse',
              },
            });
          });
        }
      });
    }
  }, [isLoading]);

  useEffect(() => {
    setupGsapAnimations();
  }, [setupGsapAnimations]);

  const handleCheckboxChange = (planId: string, isChecked: boolean) => {
    const current = Array.isArray(selectedPlans) ? selectedPlans : [];

    if (isChecked && current.length >= 3 && !current.includes(planId)) {
      return;
    }

    const updated = isChecked ? [...current, planId] : current.filter((id) => id !== planId);
    const unique = Array.from(new Set(updated));
    setSelectedPlans(unique);
  };

  useEffect(() => {
    if (typeof externalLoading === 'boolean') {
      setIsLoading(externalLoading);

      return;
    }

    const timer = setTimeout(() => setIsLoading(false), 5000);

    return () => clearTimeout(timer);
  }, [externalLoading]);

  useEffect(() => {
    const updateSkeletonCount = () => {
      if (typeof window === 'undefined') return;

      if (limit) {
        setSkeletonCount(limit);

        return;
      }

      const w = window.innerWidth;

      if (w >= 768 && w < 1024) {
        setSkeletonCount(4);
      } else if (w < 768) {
        setSkeletonCount(3);
      } else {
        setSkeletonCount(5);
      }
    };

    updateSkeletonCount();
    window.addEventListener('resize', updateSkeletonCount);

    return () => window.removeEventListener('resize', updateSkeletonCount);
  }, [limit]);
  const handleCloseRouteModal = useCallback(() => {
    setSelectedPlanForRoute(null);
  }, []);
  const handleViewRoute = useCallback((planId: string) => {
    setSelectedPlanForRoute(planId);
  }, []);
  const createViewRouteHandler = useCallback((planId: string) => () => handleViewRoute(planId), [handleViewRoute]);

  const handleTooltipToggle = useCallback(
    (planId: string) => {
      setActiveTooltip(activeTooltip === planId ? null : planId);
    },
    [activeTooltip]
  );

  const handleTooltipClose = useCallback(() => {
    setActiveTooltip(null);
  }, []);

  return (
    <Fragment>
      <div className="flex xl:hidden justify-between items-center mb-8 mt-4 md:mt-0 md:mb-2 gap-4">
        <div className="w-full md:w-auto">
          <div
            onClick={handleFilterToggle}
            className="flex items-center w-full gap-2 px-4 py-3 bg-white md:bg-blue-150 dark:bg-[#0a0a0a] dark:md:bg-black rounded-xl focus:outline-none"
          >
            <FilterIcon width="28" height="28" className="text-Teal-500" />
            <span className="dark:text-white text-base font-normal font-Futra">Filter</span>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex md:flex-wrap md:flex-row lg:flex-col gap-5 lg:gap-10">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <div key={i} className="w-full md:w-[calc(50%_-_20px)] lg:w-full">
                <div className="lg:hidden">
                  <PlanCardMobileSkeleton />
                </div>
                <div className="hidden lg:block">
                  <PlanCardSkeleton />
                </div>
              </div>
            ))
          : slicedPlans.map((plan, index) => {
              const vm = toPlanViewModel(plan);
              const additionalBenefits = Array.isArray(plan.additional_benefits)
                ? plan.additional_benefits.filter((benefit): benefit is string => Boolean(benefit)).slice(0, 3)
                : [];

              return (
                <div
                  key={`${vm.id}-${index}`}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`w-full bg-white dark:bg-gray-300 ${vm.isActive ? ' border-orange-200' : 'border-Teal-500'} flex-wrap overflow-hidden border relative  flex justify-between items-stretch gap-5 lg:gap-20 rounded-2xl p-5 lg:p-[50px]`}
                >
                  {vm.isPopularBadge && (
                    <div className="absolute top-0  right-0 text-black uppercase text-sm leading-6 font-semibold px-8 py-2 rounded-bl-[18px] bg-Teal-500">
                      Popular
                    </div>
                  )}
                  <div className="w-full lg:w-[calc(33.33%_-_80px)] flex flex-col">
                    <div className="plan-icon flex items-center gap-3">
                      <div className="p-[8px] shadow-9xl bg-white dark:bg-black rounded-lg flex items-center justify-center min-w-[40px] min-h-[40px] lg:min-w-[48px] lg:min-h-[48px]">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
                          <ThunderIcon className="w-full h-full" id={`thunder-${plan.id}`} />
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div
                          title={vm.title}
                          className="plan-title font-Neutra text-41 max-w-[150px] leading-[58.71px] truncate uppercase text-[#F7CB3C] dark:text-orange-200"
                        >
                          {vm.title}
                        </div>
                        <div className="relative ml-2">
                          <div
                            className="cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            onMouseEnter={() => setActiveTooltip(vm.id)}
                            onMouseLeave={handleTooltipClose}
                            onClick={() => handleTooltipToggle(vm.id)}
                          >
                            <InfoIcon className="text-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                          </div>
                          {activeTooltip === vm.id && (
                            <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-sm rounded-lg shadow-lg whitespace-nowrap max-w-xs">
                              <div className="font-medium">{vm.title}</div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black dark:border-t-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="plan-tag py-0.5 px-3 bg-orange-200 w-fit mt-2 rounded-full text-white dark:text-black uppercase text-xs font-medium">
                      {vm.classLabel.toUpperCase()}
                    </div>
                    <div className="plan-description text-[#3f3f3f] dark:text-gray-600 mt-4">{plan.description}</div>
                    <div className="plan-price mt-5 text-neutral-800 text-xl">
                      <span className="font-Neutra text-5xl font-medium text-Teal-900">{vm.price}</span>
                      <span className="ml-2">/ Year</span>
                    </div>
                    <Link
                      href={'/terms-and-conditions'}
                      className="mt-3 underline font-medium leading-4 text-[#39A0F4] dark:text-blue-100 text-sm"
                    >
                      Teams & Conditions
                    </Link>
                  </div>
                  <div className="plan-features w-full lg:w-[calc(33.33%_-_80px)] hidden md:flex flex-col gap-2 xl:gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-100 text-2xl">
                        <LocationIcon className="" />
                      </div>
                      <div className="text-base font-medium">{vm.tripsPerYear}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-gray-100 text-2xl">
                        <PlaneUpIcon className="" />
                      </div>
                      <div className="text-base  truncate font-medium ">{vm.airlinesLabel}</div>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-100 text-2xl">
                          <RouteIcon className="" />
                        </div>
                        <div className="text-base truncate font-medium">{vm.routeLabel || 'Route not available'}</div>
                      </div>
                      <div
                        className="flex items-end text-[9px] font-Futra text-neutral-50/50 dark:text-white/30 uppercase cursor-pointer"
                        onClick={createViewRouteHandler(vm.id)}
                      >
                        view
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-neutral-900 mt-3 xl:mt-6" />
                    <div className="text-base font-medium dark:text-white mt-4">Additional Benefits :</div>
                    <div className="flex flex-col gap-2 ">
                      {additionalBenefits.length > 0 ? (
                        additionalBenefits.map((benefit: string, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <TickIcon />
                            <div className="text-sm dark:text-white">{benefit}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-[#737373] dark:text-[#b3b3b3]">
                          Additional benefits not available
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-[calc(33.33%_-_80px)] gap-5 xl:gap-30 flex flex-col">
                    <div className="plan-buttons flex flex-col gap-5 md:order-1 md:gap-4">
                      <PlansButton
                        className="border-Teal-900 dark:border-Teal-500 group  text-Teal-900 dark:text-Teal-500 TealTransparent uppercase"
                        icon={<DetailArrow className="group-hover:rotate-45 duration-500" />}
                        label="Plan Details"
                        onClick={() => router.push(`/details/${vm.id}`)}
                      />
                      <PlansButton
                        className="bg-[#F7CB3C] dark:bg-orange-200 group text-white dark:text-black orange uppercase"
                        icon={
                          <ArrowLeft
                            width="24"
                            height="24"
                            className="rotate-180 group-hover:translate-x-2 duration-500"
                          />
                        }
                        label="Subscribe"
                        onClick={() => handlePlanSubscription(plan, vm)}
                      />
                    </div>
                    <div className="plan-checkbox mt-2 md:mt-0 md:order-2 block">
                      <CustomCheckbox
                        className="!border-[#737373]"
                        checked={(selectedPlans ?? []).includes(vm.id)}
                        disabled={(selectedPlans ?? []).length >= 3 && !(selectedPlans ?? []).includes(vm.id)}
                        onChange={(checked) => handleCheckboxChange(vm.id, checked)}
                      >
                        <div className="uppercase text-Light text-sm leading-4 font-Futra md:text-base">
                          Add to Compare
                        </div>
                      </CustomCheckbox>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      {isFilterOpen && (
        <FilterPannel
          onClose={handleCloseFilter}
          onTravelClassChange={onTravelClassChange}
          onAirlinesChange={onAirlinesChange}
          onOriginChange={onOriginChange}
          onDestinationChange={onDestinationChange}
        />
      )}

      {selectedPlanForRoute && (
        <RouteModal
          isOpen={!!selectedPlanForRoute}
          onClose={handleCloseRouteModal}
          title={`${slicedPlans.find((p) => p.id === selectedPlanForRoute)?.title} Pack Rout`}
          subTitle=""
        >
          <div className="space-y-1">
            <div className="w-full h-[1px] bg-neutral-900 mb-2 md:mb-4" />
            {PLAN_ROUTE_DATA.map((route, index) => (
              <div key={index} className="py-2">
                <div className="text-sm font-normal text-neutral-50 dark:text-white">
                  {route.city}, {route.airport} ({route.code})
                </div>
              </div>
            ))}
          </div>
        </RouteModal>
      )}
    </Fragment>
  );
};
