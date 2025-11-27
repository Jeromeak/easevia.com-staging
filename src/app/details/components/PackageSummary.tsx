'use client';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import type { TravelPackage } from '@/lib/types/api/package';
import { useCheckout } from '@/context/hooks/useCheckout';
import { toPlanViewModel } from '@/services/planViewModel';

gsap.registerPlugin(ScrollTrigger);

interface PakageSummaryProps {
  plan?: TravelPackage;
}

// Generate package description dynamically
const generatePackageDescription = (plan: TravelPackage | undefined): string => {
  if (!plan) {
    return 'The Premium Plan at $499/year offers Business Class travel with 3–5 trips annually for up to 4 people to top destinations like Asia, Europe, and North America. It includes free ticket rescheduling up to 3 times, flexible booking with a 48-hour lead time, and airline partnerships with Emirates, Lufthansa, and Qatar Airways. Members also enjoy priority booking, occasional upgrades, and exclusive access to offers and promotions.';
  }

  const classNames = plan.classes?.map((c) => c.name).join(', ') || 'Business';
  const defaultDescription =
    'It includes flexible booking and airline partnerships. Members also enjoy priority booking, occasional upgrades, and exclusive access to offers and promotions.';

  return `The ${plan.title} Plan at ${plan.price}/year offers ${classNames} Class travel with ${plan.trip_count} trips annually for up to ${plan.member_count} people. ${plan.description || defaultDescription}`;
};

export const PakageSummary = ({ plan }: PakageSummaryProps) => {
  const router = useRouter();
  const { setSelectedPlan } = useCheckout();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([containerRef.current, titleRef.current, descriptionRef.current, buttonRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          containerRef.current,
          {
            opacity: 0,
            scale: 0.9,
            y: 60,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.6)',
            delay: 0.3,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          descriptionRef.current,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.6,
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          buttonRef.current,
          {
            opacity: 0,
            scale: 0.7,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'back.out(1.4)',
            delay: 0.9,
            scrollTrigger: {
              trigger: buttonRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }, sectionRef);

      return ctx;
    }
  }, [containerRef, titleRef, descriptionRef, buttonRef]);

  useEffect(() => {
    const ctx = setupGsapAnimations();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [setupGsapAnimations]);

  const sectionClassName = useMemo(() => clsx('overflow-hidden bg-[#Fafafa] dark:bg-black pt-16 lg:pt-30'), []);
  const containerClassName = useMemo(() => clsx('max-w-[90%] mx-auto pb-20 lg:pb-30'), []);
  const cardClassName = useMemo(
    () =>
      clsx(
        'p-5 md:p-8 lg:p-16 border border-Teal-500 flex flex-col justify-center items-center w-full bg-white dark:bg-gray-300 rounded-2xl'
      ),
    []
  );
  const titleDesktopClassName = useMemo(
    () =>
      clsx(
        'hidden md:flex text-4xl lg:text-5xl text-center text-neutral-50 dark:text-white font-semibold font-Neutra uppercase'
      ),
    []
  );
  const titleMobileClassName = useMemo(
    () =>
      clsx('flex md:hidden text-4xl text-center text-neutral-50 dark:text-white font-semibold font-Neutra uppercase'),
    []
  );
  const descClassName = useMemo(
    () =>
      clsx(
        'text-center text-base md:text-xl lg:text-2xl text-neutral-50 dark:text-white uppercase tracking-[1.44px] mt-10 md:mt-8'
      ),
    []
  );
  const buttonWrapperClassName = useMemo(() => clsx('w-full justify-center flex mt-6 md:mt-10 items-center'), []);
  const buttonClassName = useMemo(
    () =>
      clsx(
        'flex gap-3 text-sm lg:text-lg cursor-pointer hover:bg-transparent border border-transparent hover:border-orange-200 hover:text-orange-200 duration-500 group items-center uppercase w-fit justify-center px-4 py-2 lg:px-8 rounded-full bg-orange-200 text-white dark:text-black'
      ),
    []
  );
  const arrowClassName = useMemo(() => clsx('transform rotate-[-180deg] group-hover:translate-x-2 duration-300'), []);

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div className={containerClassName}>
        <div ref={containerRef} className={cardClassName}>
          <div ref={titleRef} className={titleDesktopClassName}>
            Package summarized Info
          </div>
          <div ref={titleRef} className={titleMobileClassName}>
            Package <br />
            summarized Info
          </div>
          <div ref={descriptionRef} className={descClassName}>
            {generatePackageDescription(plan)}
          </div>
          <div className={buttonWrapperClassName}>
            <button ref={buttonRef} type="button" onClick={handleSubscribe} className={buttonClassName}>
              Subscribe Now
              <ArrowLeft width="24" height="24" className={arrowClassName} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
