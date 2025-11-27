'use client';
import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TravelPackage } from '@/lib/types/api/package';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

interface PersonProps {
  plan?: TravelPackage;
}

export const Person = ({ plan }: PersonProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const bigNumberRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, imageRef.current, bigNumberRef.current, subtitleRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
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
          imageRef.current,
          {
            opacity: 0,
            y: 80,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3,
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          bigNumberRef.current,
          {
            opacity: 0,
            scale: 0.3,
            rotation: -15,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.8,
            ease: 'elastic.out(1, 0.6)',
            delay: 0.5,
            scrollTrigger: {
              trigger: bigNumberRef.current,
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
            x: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            delay: 0.8,
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.to(imageRef.current, {
          y: -30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
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
    <section ref={sectionRef} className="overflow-hidden">
      <div className="md:max-w-[90%] mx-auto dark:md:pb-0 md:pb-0 dark:md:py-0 md:py-0 py-10 dark:py-10 dark:lg:pb-30 lg:pb-30 lg:pt-20 xl:py-20 dark:xl:py-30">
        <div className="flex justify-between flex-wrap items-end w-full">
          <div ref={leftContentRef} className="w-full lg:w-[60%] gap-4 md:gap-5 lg:gap-10 flex flex-col">
            <div
              ref={titleRef}
              className="w-full pl-2.5 md:pl-0 lg:pr-18 md:text-7xl xl:text-96 text-Teal-500 dark:text-white font-Neutra text-5xl tracking-[2.88px] xl:leading-24 uppercase text-left lg:text-end"
            >
              travel up to
            </div>
            <div ref={imageRef} className="w-full block">
              <img
                src={`${cdnBaseUrl}/travel_up_to.webp`}
                className="w-full h-[25rem] object-cover lg:h-fit"
                alt="travel-up-to"
                title="Travel Up To"
              />
            </div>
          </div>
          <div
            ref={rightContentRef}
            className="w-full md:max-w-[90%] lg:w-[40%] mt-0 md:mt-10 lg:mt-0 text-Teal-500 dark:text-white"
          >
            <div className="flex gap-5 items-end mt-[-23px] md:mt-0 ml-[-48px] md:ml-0 lg:mb-30">
              <div
                ref={bigNumberRef}
                className="lg:text-[400px] text-[100px] md:text-9xl md:-mb-5 xl:text-[564.837px] lg:leading-[400px] ml-24 md:ml-0 lg:-ml-20 lg:-mb-35 xl:-ml-34 xl:-mb-20 xl:leading-[564.837px] font-Neutra"
              >
                {plan?.member_count || 4}
              </div>
              <div
                ref={subtitleRef}
                className="text-[49.152px] md:text-7xl xl:text-96 leading-12 lg:leading-16 xl:leading-24 pb-5 font-Neutra tracking-[1.475px] md:tracking-[2.88px] uppercase"
              >
                persons <br className="hidden lg:block" />
                per trip
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
