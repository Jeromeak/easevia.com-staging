'use client';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KeysData } from '@/common/components/Data';
import { WhiteLogo } from '@/icons/icon';
import type { TravelPackage } from '@/lib/types/api/package';

gsap.registerPlugin(ScrollTrigger);

interface KeysProps {
  plan?: TravelPackage;
}

export const Keys = ({ plan }: KeysProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mainNumberRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([mainCardRef.current, gridContainerRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          mainCardRef.current,
          {
            opacity: 0,
            x: -100,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mainCardRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          gridContainerRef.current,
          {
            opacity: 0,
            x: 100,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.4,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: gridContainerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        const mainCounter = { value: 0 };
        gsap.to(mainCounter, {
          value: 1000,
          duration: 2,
          ease: 'power2.out',
          delay: 0.5,
          scrollTrigger: {
            trigger: mainNumberRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: function () {
            if (mainNumberRef.current) {
              mainNumberRef.current.textContent = Math.floor(mainCounter.value) + '+';
            }
          },
        });

        gsap.fromTo(
          mainTitleRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.8,
            scrollTrigger: {
              trigger: mainTitleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        const gridItems = gsap.utils.toArray(gridContainerRef.current?.children || []) as HTMLElement[];
        gridItems.forEach((item, index) => {
          const numberElement = item.querySelector('.number-counter') as HTMLElement;
          const titleElement = item.querySelector('.title-element') as HTMLElement;
          const targetValue = parseInt(KeysData[index].total);

          gsap.set([numberElement, titleElement], { opacity: 0 });

          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 50,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.4)',
              delay: 0.8 + index * 0.15,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          const counter = { value: 0 };
          gsap.to(counter, {
            value: targetValue,
            duration: 1.5,
            ease: 'power2.out',
            delay: 1 + index * 0.15,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: function () {
              if (numberElement) {
                numberElement.textContent = Math.floor(counter.value) + '+';
              }
            },
            onStart: function () {
              gsap.to(numberElement, { opacity: 1, duration: 0.3 });
            },
          });

          gsap.to(titleElement, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.2 + index * 0.15,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }, sectionRef);

      return ctx;
    }
  }, [plan]);

  useEffect(() => {
    const ctx = setupGsapAnimations();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [setupGsapAnimations]);

  const sectionClassName = useMemo(() => clsx('overflow-hidden bg-[#fafafa] dark:bg-black'), []);
  const containerClassName = useMemo(
    () => clsx('w-full lg:max-w-[90%] mx-auto pt-10 md:pt-0 md:pb-10 lg:pt-20 lg:pb-30 dark:lg:pt-30'),
    []
  );
  const cardWrapperClassName = useMemo(
    () =>
      clsx(
        'bg-white dark:bg-gray-300 px-8 py-10 md:p-5 lg:p-10 mt-4 lg:mt-0 flex justify-between flex-wrap items-stretch gap-5'
      ),
    []
  );
  const mainCardClassName = useMemo(
    () =>
      clsx(
        'w-full lg:w-[calc(35%_-_10px)] flex md:justify-center items-center bg-orange-200 lg:py-24 px-6 py-6 md:py-8 md:px-8 lg:px-14 relative'
      ),
    []
  );
  const logoClassName = useMemo(() => clsx('absolute bottom-7 right-0 md:bottom-10 md:right-10'), []);
  const flexColClassName = useMemo(() => clsx('flex flex-col'), []);
  const mainNumberClassName = useMemo(() => clsx('md:text-96 text-[64px] font-Neutra text-white dark:text-black'), []);
  const mainTitleClassName = useMemo(
    () =>
      clsx(
        'text-white dark:text-black uppercase font-medium text-[40px] pt-3 md:pt-0 md:text-40 leading-11 md:leading-10'
      ),
    []
  );
  const gridContainerClassName = useMemo(
    () => clsx('lg:w-[calc(65%_-_10px)] md:col-span-3 gap-5 grid md:grid-cols-2 md:grid-rows-2'),
    []
  );
  const gridItemClassName = useMemo(() => clsx('border border-Teal-500 md:px-9 px-6 py-8 md:py-10 flex flex-col'), []);
  const numberCounterClassName = useMemo(
    () => clsx('number-counter text-5xl md:text-56 text-neutral-50 dark:text-white'),
    []
  );
  const titleElementClassName = useMemo(
    () => clsx('title-element text-xl uppercase font-medium w-full md:w-[60%] leading-7 pt-3 md:pt-0'),
    []
  );

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div className={containerClassName}>
        <div className={cardWrapperClassName}>
          <div ref={mainCardRef} className={mainCardClassName}>
            <div className={logoClassName}>
              <WhiteLogo />
            </div>
            <div className={flexColClassName}>
              <div ref={mainNumberRef} className={mainNumberClassName}>
                1000+
              </div>
              <div ref={mainTitleRef} className={mainTitleClassName}>
                Daily
                <br className="lg:block md:hidden" />
                Flights
              </div>
            </div>
          </div>
          <div ref={gridContainerRef} className={gridContainerClassName}>
            {(plan
              ? [
                  {
                    total: plan.member_count?.toString() || '4',
                    title: 'Person Per Trip',
                  },
                  {
                    total: plan.airlines?.length?.toString() || '3',
                    title: 'Airline Partners',
                  },
                  {
                    total: plan.trip_count?.toString() || '5',
                    title: 'Trips Per Year',
                  },
                  {
                    total: plan.classes?.map((c) => c.name).join(', ') || 'Business',
                    title: 'Travel Class',
                  },
                ]
              : KeysData
            ).map((keys, index) => (
              <div key={index} className={gridItemClassName}>
                <div className={numberCounterClassName}>
                  {keys.total}
                  {keys.title === 'Travel Class' ? '' : '+'}
                </div>
                <div className={titleElementClassName}>{keys.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
