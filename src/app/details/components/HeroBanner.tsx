'use client';
import { ArrowLeft } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useState } from 'react';
import type { TravelPackage } from '@/lib/types/api/package';
import { useCheckout } from '@/context/hooks/useCheckout';
import { toPlanViewModel } from '@/services/planViewModel';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

interface HeroBannerProps {
  plan?: TravelPackage;
}

export const HeroBanner = ({ plan }: HeroBannerProps) => {
  const router = useRouter();
  const { setSelectedPlan } = useCheckout();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  const handleSubscribe = useCallback(() => {
    if (plan) {
      // Transform the plan data using the same pattern as PlanCard
      const vm = toPlanViewModel(plan);

      // Store plan details in context and localStorage (same as PlanCard)
      const planData = {
        id: vm.id,
        title: vm.title,
        price: vm.price,
        classLabel: vm.classLabel,
        tripsPerYear: vm.tripsPerYear,
        airlinesLabel: vm.airlinesLabel,
        description: plan.description || '',
        additionalBenefits: plan.additional_benefits || [],
      };
      setSelectedPlan(planData);
      router.push(`/checkout?packageId=${vm.id}`);
    }
  }, [router, plan, setSelectedPlan]);

  return (
    <section
      className={clsx(
        'bg-white dark:bg-black sticky z-100 top-[83px] overflow-hidden transition-all duration-300',
        isScrolled ? 'shadow-lg' : ''
      )}
    >
      <div
        className={clsx(
          'max-w-[90%] mx-auto transition-all duration-300',
          isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-4 lg:py-5'
        )}
      >
        <div onClick={handleGoBack} className="flex items-center w-fit cursor-pointer">
          <ArrowLeft
            className={clsx(
              'text-neutral-50 dark:text-white opacity-80 md:opacity-100 transition-all duration-300',
              isScrolled ? 'w-4 h-4 md:w-6 md:h-6' : 'w-6 h-6 lg:w-12 lg:h-12'
            )}
          />
          <div
            className={clsx(
              'font-normal font-Futra text-neutral-50 dark:text-white/90 dark:md:text-white uppercase md:ml-2 transition-all duration-300',
              isScrolled
                ? 'text-xs md:text-sm lg:text-base md:leading-4'
                : 'text-sm md:text-lg lg:text-2xl md:leading-6'
            )}
          >
            subscription plans
          </div>
        </div>
        <div
          className={clsx(
            'flex gap-3 flex-nowrap justify-between md:flex-wrap md:items-end w-full transition-all duration-300',
            isScrolled ? 'mt-2 lg:mt-2' : 'mt-5 lg:mt-5'
          )}
        >
          <div className="flex flex-col md:flex-row items-start md:items-end md:gap-5">
            <div
              className={clsx(
                'uppercase font-semibold font-Neutra text-orange-200 transition-all duration-300',
                isScrolled
                  ? 'text-2xl md:text-4xl lg:text-5xl leading-tight'
                  : 'text-5xl md:text-7xl lg:text-9xl lg:leading-32'
              )}
            >
              {plan?.title || 'Premium'}
            </div>
            <div
              className={clsx(
                'text-neutral-800 mr-4 md:mr-0 transition-all duration-300',
                isScrolled ? 'md:mt-2 text-sm md:text-base' : 'md:mt-5 text-[15.24px] md:text-xl'
              )}
            >
              <span
                className={clsx(
                  'font-Neutra text-Teal-500 transition-all duration-300',
                  isScrolled ? 'text-xl md:text-2xl lg:text-3xl' : 'lg:text-70 md:text-5xl text-[37.474px]'
                )}
              >
                {plan?.price || '$499'}
              </span>
              / Year
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={handleSubscribe}
              className={clsx(
                'flex gap-2 md:gap-3 cursor-pointer hover:bg-transparent border border-transparent hover:border-orange-200 hover:text-orange-200 duration-500 group items-center uppercase w-fit justify-center rounded-full bg-orange-200 text-black font-Futra transition-all',
                isScrolled
                  ? 'text-xs md:text-sm py-1 px-3 lg:px-4 leading-3'
                  : 'text-xs md:text-sm lg:text-lg py-2 px-4 lg:px-8 leading-4 lg:leading-6'
              )}
            >
              Subscribe
              <ArrowLeft
                width={isScrolled ? '16' : '24'}
                height={isScrolled ? '16' : '24'}
                className="transform -rotate-180 group-hover:translate-x-2 duration-300"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
