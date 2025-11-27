'use client';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AIRPORT_LIST } from '@/lib/enums/constants';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export const Routs = () => {
  const airportList = AIRPORT_LIST;
  const airportListItems = useMemo(
    () => airportList.map((airport, idx) => <li key={idx}>{airport}</li>),
    [airportList]
  );
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLUListElement>(null);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `${cdnBaseUrl}/world.png`;
  }, []);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([numberRef.current, titleRef.current, descriptionRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          numberRef.current,
          {
            opacity: 0,
            y: 80,
            scale: 0.5,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.3,
            scrollTrigger: {
              trigger: numberRef.current,
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
            x: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            delay: 0.6,
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
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.9,
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.to(contentRef.current, {
          scale: 1.02,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5,
        });
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
    <section
      ref={sectionRef}
      className="bg-white dark:bg-black dark:pb-10 dark:md:pb-0 dark:md:my-15 md:my-15 dark:lg:mb-30 lg:my-5 overflow-hidden"
    >
      <div>
        <div className="flex flex-col lg:flex-row gap-10 md:gap-0 justify-between xl:flex-wrap items-stretch relative">
          <div ref={imageRef} className="lg:w-[60%] w-full xl:w-[60%] relative">
            <div className="w-full h-full md:h-[22rem] lg:h-full">
              <img
                src={`${cdnBaseUrl}/world.png`}
                className="w-full object-contain h-full"
                alt="Routes Map"
                title="Routes Map"
                onError={handleImageError}
              />
              <div
                ref={numberRef}
                className="absolute left-5 top-[80%] md:left-5 md:top-[55%] lg:left-18 lg:top-[80%] -translate-y-1/2 text-yellow-400 leading-none tracking-tight z-10"
              >
                <span className="text-[58.55px] font-semibold uppercase font-Neutra md:text-[70px] block leading-none">
                  10
                </span>
                <span
                  ref={titleRef}
                  className="block text-xl font-semibold lg:text-2xl md:font-normal font-Neutra uppercase"
                >
                  ROUTS
                </span>
              </div>
            </div>
          </div>
          <div
            ref={contentRef}
            className="xl:ml-2 lg:w-[40%] w-full xl:w-[38%] bg-[#FFD233] text-black p-4 py-10 lg:py-4 xl:py-0 lg:p-6 md:pl-10 z-20 flex flex-col justify-center"
          >
            <ul
              ref={descriptionRef}
              className="list-disc xl:pl-24 pl-5 space-y-2 text-base md:text-lg lg:text-xl font-normal text-black font-Futra"
            >
              {airportListItems}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
