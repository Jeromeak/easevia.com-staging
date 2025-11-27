'use client';
import { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import { useLanguageCurrency } from '@/context/hooks/useLanguageCurrency';

gsap.registerPlugin(ScrollTrigger);

interface HeroBannerProps {
  selectedCount: number;
  selectedPlans: string[];
  onClearSelection: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ selectedCount, selectedPlans, onClearSelection }) => {
  const router = useRouter();
  const { currency } = useLanguageCurrency();
  const sectionRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const handleCompareClick = useCallback(() => {
    if (selectedPlans.length >= 2) {
      const packageIds = selectedPlans.join(',');
      const currencyId = currency?.id || 1;
      router.push(`/plan-compare?package_ids=${packageIds}&currency_id=${currencyId}`);
    }
  }, [router, selectedPlans, currency]);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([subtitleRef.current, titleRef.current, buttonContainerRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, x: -80, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.6,
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
          buttonContainerRef.current,
          { opacity: 0, x: 100, scale: 0.8 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.3,
            ease: 'back.out(1.4)',
            delay: 0.6,
            scrollTrigger: {
              trigger: buttonContainerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }, sectionRef);

      return ctx;
    }
  }, []);

  useEffect(() => {
    const ctx = setupGsapAnimations();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [setupGsapAnimations]);

  return (
    <section ref={sectionRef}>
      <div className="max-w-[90%] mx-auto mt-20 pt-8 md:pt-10 md:pb-5 lg:py-30">
        <div className="flex flex-col lg:flex-row flex-wrap md:gap-0 gap-2 lg:justify-between w-full">
          <div className="flex flex-col">
            <div
              ref={subtitleRef}
              className={clsx(
                'text-base font-normal font-Futra md:text-2xl tracking-[0.96px] leading-[22.4px] lg:leading-[33.6px] lg:tracking-[1.44px] text-left uppercase text-neutral-50 dark:text-white'
              )}
            >
              Pick your affordable
            </div>
            <div
              ref={titleRef}
              className={clsx(
                'font-Neutra text-Teal-500 text-left mt-0 md:mt-2 lg:mt-4 text-[39px] md:text-7xl lg:text-90 lg:leading-22.5 uppercase'
              )}
            >
              subscription plans
            </div>
          </div>
          <div ref={buttonContainerRef} className="flex items-end gap-5">
            {selectedCount > 0 && selectedCount < 2 && (
              <div className="text-sm text-gray-400 uppercase">Select at least 2 plans to compare</div>
            )}
            {selectedCount >= 2 && (
              <button
                type="button"
                role="button"
                onClick={handleCompareClick}
                className={clsx(
                  'flex gap-3 uppercase border rounded-full py-2.5 font-semibold leading-5 text-Teal-500 text-sm px-8 border-Teal-500 h-fit cursor-pointer justify-center items-center'
                )}
              >
                <div>Compare</div>
                <div className={clsx('w-5 h-5 bg-orange-200 text-black rounded flex justify-center items-center')}>
                  {selectedCount}
                </div>
              </button>
            )}
            {selectedCount > 0 && (
              <button
                type="button"
                role="button"
                onClick={onClearSelection}
                className="text-sm text-gray-400 uppercase hover:text-white cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="hidden">
        <h1></h1>
        <h2></h2>
        <h3></h3>
      </div>
    </section>
  );
};
