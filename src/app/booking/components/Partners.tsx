'use client';

import { PartnerData } from '@/common/components/Data';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

export const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return;
    }

    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.fromTo(
      subtitleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    gsap.fromTo(
      '.partner-card',
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      setupGsapAnimations();
    }, sectionRef);

    const handleResize = () => {
      ctx.revert();

      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        setupGsapAnimations();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [setupGsapAnimations]);

  const partnerCardClass = useMemo(
    () =>
      clsx(
        'partner-card w-[calc(50%_-_10px)] md:w-[calc(33.33%_-_20px)]  xl:w-[calc(20%_-_48px)] flex justify-center items-center duration-500 dark:lg:grayscale dark:lg:hover:grayscale-0 dark:bg-gray-300 shadow-8xl rounded-2xl px-5 lg:px-10 h-[10rem]'
      ),
    []
  );

  const partners = useMemo(
    () =>
      PartnerData.map((partner) => (
        <div key={partner.id} className={partnerCardClass}>
          {partner.icon}
        </div>
      )),
    [partnerCardClass]
  );

  return (
    <section ref={sectionRef}>
      <div className={clsx('max-w-[90%] mx-auto md:pt-10 pb-10 lg:pb-30')}>
        <div className={clsx('flex flex-col')}>
          <div ref={titleRef} className={clsx('text-xl text-white tracking-[1.44px] uppercase leading-[33.6px]')}>
            Experience Flying with
          </div>
          <div
            ref={subtitleRef}
            className={clsx(
              'text-Teal-500 font-Neutra text-[40px] leading-[40px] md:text-7xl lg:text-90 md:leading-[90px] uppercase'
            )}
          >
            our Airline Partners
          </div>
          <div
            ref={cardsRef}
            className={clsx(
              'w-full flex md:justify-center xl:justify-between flex-wrap items-center gap-5 xl:gap-[60px] mt-5 lg:mt-20'
            )}
          >
            {partners}
          </div>
        </div>
      </div>
    </section>
  );
};
