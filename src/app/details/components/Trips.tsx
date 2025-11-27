'use client';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { TravelPackage } from '@/lib/types/api/package';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

interface TripsProps {
  plan?: TravelPackage;
}

export const Trips = ({ plan }: TripsProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

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

  const sectionClassName = useMemo(
    () =>
      clsx(
        'bg-blue-150 dark:bg-gray-300 md:mt-10 dark:md:mb-20 md:mb-10 lg:mt-30 lg:mb-0 dark:lg:my-30 overflow-hidden'
      ),
    []
  );
  const flexClassName = useMemo(() => clsx('flex justify-between flex-wrap items-stretch lg:gap-20'), []);
  const imageWrapperClassName = useMemo(
    () => clsx('lg:w-[calc(50%_-_40px)] w-full xl:w-[calc(60%_-_40px)] bg-gray-300'),
    []
  );
  const imageContainerClassName = useMemo(() => clsx('w-full h-[20rem] md:h-[30rem] lg:h-full'), []);
  const imageClassName = useMemo(() => clsx('w-full object-cover mix-blend-difference h-full'), []);
  const contentClassName = useMemo(
    () =>
      clsx(
        'lg:w-[calc(50%_-_40px)] w-full xl:w-[calc(40%_-_40px)] bg-blue-150 dark:bg-gray-300 md:px-10 px-5 py-10 lg:px-0 md:py-10 lg:py-5 my-auto'
      ),
    []
  );
  const numberClassName = useMemo(
    () => clsx('text-Teal-500 text-8xl lg:text-156 text-center lg:text-left font-Neutra lg:leading-[156.69px]'),
    []
  );
  const titleClassName = useMemo(
    () => clsx('text-orange-200 text-5xl text-center lg:text-left lg:text-55 uppercase'),
    []
  );
  const descClassName = useMemo(
    () =>
      clsx(
        'text-xl md:text-lg text-left pt-5 lg:pt-4 xl:text-xl tracking-[1.2px] uppercase leading-[30px] w-full lg:w-[80%]'
      ),
    []
  );

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div>
        <div className={flexClassName}>
          <div ref={imageRef} className={imageWrapperClassName}>
            <div className={imageContainerClassName}>
              <Image
                src={`${cdnBaseUrl}/by_year.webp`}
                className={imageClassName}
                alt="Trips per year"
                title="Trips Per Year"
                width={1920}
                height={1080}
              />
            </div>
          </div>
          <div ref={contentRef} className={contentClassName}>
            <div ref={numberRef} className={numberClassName}>
              {plan?.trip_count || '3 to 5'}
            </div>
            <div ref={titleRef} className={titleClassName}>
              Trips By Year
            </div>
            <p ref={descriptionRef} className={descClassName}>
              Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
              aute irure dolor in reprehenderit. Nullam semper quam mauris, nec mollis felis aliquam eu. Ut non gravida
              mi, phasellus.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
