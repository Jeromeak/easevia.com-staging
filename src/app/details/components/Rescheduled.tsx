'use client';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { TravelPackage } from '@/lib/types/api/package';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

interface RescheduledProps {
  plan?: TravelPackage;
}

export const Rescheduled = ({ plan }: RescheduledProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, descriptionRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
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
            x: 30,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3,
            scrollTrigger: {
              trigger: descriptionRef.current,
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

  const sectionClassName = useMemo(() => clsx('overflow-hidden'), []);
  const outerClassName = useMemo(
    () => clsx('dark:pb-10 pb-10 md:12 lg:pb-20 dark:md:pb-12 dark:lg:pb-30 dark:mt-10'),
    []
  );
  const flexEndClassName = useMemo(() => clsx('flex justify-end'), []);
  const wrapperClassName = useMemo(
    () => clsx('w-full xl:w-[85%] flex justify-between flex-wrap md:flex-nowrap items-stretch'),
    []
  );
  const imageWrapperClassName = useMemo(() => clsx('w-full lg:w-[40%]'), []);
  const imageClassName = useMemo(() => clsx('w-full h-[20rem] md:h-[25rem] object-fit md:object-cover lg:h-full'), []);
  const contentClassName = useMemo(
    () =>
      clsx(
        'w-full lg:w-[60%] flex flex-col justify-between lg:gap-0 gap-10 bg-orange-200 lg:pl-[60px] px-4 py-10 md:p-10 lg:pr-30 lg:py-[60px]'
      ),
    []
  );
  const titleClassName = useMemo(
    () => clsx('text-5xl lg:text-76 font-Neutra lg:leading-19 uppercase tracking-[2.28px] text-black'),
    []
  );
  const descClassName = useMemo(
    () => clsx('text-black text-xl lg:text-32 font-normal uppercase tracking-[0.96px] lg:leading-10 text-end'),
    []
  );

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div className={outerClassName}>
        <div className={flexEndClassName}>
          <div className={wrapperClassName}>
            <div ref={imageRef} className={imageWrapperClassName}>
              <Image
                src={`${cdnBaseUrl}/reschedule.webp`}
                className={imageClassName}
                alt="Reschedule illustration"
                title="Reschedule Illustration"
                width={1920}
                height={320}
              />
            </div>
            <div ref={contentRef} className={contentClassName}>
              <div ref={titleRef} className={titleClassName}>
                Free for
                <br className="hidden md:block" /> Rescheduled Date
              </div>
              <p ref={descriptionRef} className={descClassName}>
                Booked tickets
                <br /> can be rescheduled
                <br /> up to {plan?.allowed_date_change_count || 3} times
                <br /> free of charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
