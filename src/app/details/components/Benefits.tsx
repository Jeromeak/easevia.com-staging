'use client';
import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BenefitsData } from '@/common/components/Data';
import { CheckMark } from '@/icons/icon';
import type { TravelPackage } from '@/lib/types/api/package';

gsap.registerPlugin(ScrollTrigger);

interface BenefitsProps {
  plan?: TravelPackage;
}

export const Benefits = ({ plan }: BenefitsProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const benefitsListRef = useRef<HTMLDivElement>(null);

  const renderBenefitItem = useCallback(
    (benefit: string, index: number) => (
      <div key={index} className="flex gap-5 items-start">
        <div className="w-auto">
          <div className="lg:w-12 lg:h-12 w-8 h-8 rounded-full border flex justify-center items-center border-Teal-500 dark:border-orange-200">
            <CheckMark className="w-3 h-3 md:w-5 md:h-5 lg:w-auto lg:h-auto text-Teal-500 dark:text-orange-200" />
          </div>
        </div>
        <div className="text-[18.142px] md:text-2xl text-neutral-50 dark:text-white lg:text-4xl uppercase tracking-[1.089px] lg:tracking-[2.16px] lg:leading-13.5">
          {benefit}
        </div>
      </div>
    ),
    []
  );

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([leftPanelRef.current, rightPanelRef.current, titleRef.current, descriptionRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          leftPanelRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: leftPanelRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: 'power3.out',
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
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.5,
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          rightPanelRef.current,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: rightPanelRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        const benefitItems = gsap.utils.toArray(benefitsListRef.current?.children || []) as HTMLElement[];
        benefitItems.forEach((item, index) => {
          gsap.set(item, { opacity: 0, x: 50, y: 30 });
          gsap.to(item, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.8 + index * 0.15,
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
  }, []);

  useEffect(() => {
    const ctx = setupGsapAnimations();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [setupGsapAnimations]);

  return (
    <section ref={sectionRef} className="pt-10 overflow-hidden">
      <div className="flex justify-between flex-wrap w-full">
        <div
          ref={leftPanelRef}
          className="w-full xl:w-1/2 bg-Teal-500 p-5 px-4 py-10 md:px-15 lg:px-30 md:py-15 lg:py-14"
        >
          <div
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-90 font-Neutra uppercase text-white dark:text-black tracking-[3px] lg:leading-22.5"
          >
            Additional Benefits
          </div>
          <p
            ref={descriptionRef}
            className="text-xl uppercase tracking-[1.2px] text-white dark:text-black w-full lg:w-[60%] mt-5"
          >
            Reprehenderit. Nullam semper quam mauris, nec mollis felis aliquam eu. Ut non gravida mi, phasellus.
          </p>
        </div>
        <div
          ref={rightPanelRef}
          className="w-full xl:w-1/2 bg-blue-150 dark:bg-gray-300 lg:py-14 md:px-15 px-5 py-10 md:py-15 lg:px-30"
        >
          <div ref={benefitsListRef} className="flex flex-col gap-4 md:gap-8">
            {(plan?.additional_benefits || BenefitsData).map(renderBenefitItem)}
          </div>
        </div>
      </div>
    </section>
  );
};
