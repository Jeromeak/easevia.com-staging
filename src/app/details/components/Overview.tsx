'use client';
import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TravelPackage } from '@/lib/types/api/package';

gsap.registerPlugin(ScrollTrigger);

interface OverViewProps {
  plan?: TravelPackage;
}

export const OverView = ({ plan }: OverViewProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([cardRef.current, titleRef.current, descriptionRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          sectionRef.current,
          {
            scale: 1.1,
            opacity: 0.8,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          cardRef.current,
          {
            opacity: 0,
            y: 100,
            x: 50,
            scale: 0.8,
            rotation: 5,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3,
            scrollTrigger: {
              trigger: cardRef.current,
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
            y: 30,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
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

        gsap.to(sectionRef.current, {
          backgroundPosition: '50% 100px',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.to(cardRef.current, {
          boxShadow: '0 0 30px rgba(251, 146, 60, 0.3)',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2,
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
      className="dark:lg:mb-40 lg:mb-35 mb-45 md:mb-40 dark:md:mb-40 dark:xl:mb-76 relative !bg-details_banner bg-cover bg-center w-full h-[70vh] md:min-h-screen overflow-visible pl-2.5 lg:pl-0"
    >
      <div
        ref={cardRef}
        className="absolute bottom-[-23%] md:bottom-[-15%] lg:bottom-[-10%] rounded-[20px] lg:rounded-none gap-10 lg:gap-30 xl:gap-20 flex flex-col bg-white dark:bg-black p-5 md:p-[50px] w-[95%] md:w-[30rem] border border-orange-200 md:right-[20%] z-10"
      >
        <div
          ref={titleRef}
          className="text-5xl lg:text-64 lg:leading-[64px] tracking-[1.92px] text-orange-200 font-Neutra uppercase"
        >
          {plan?.classes?.map((c) => c.name).join(', ') || 'Business'}
          <br className="lg:block hidden" /> Class
        </div>
        <p className={'text-xl lg:text-2xl tracking-[0.72px] uppercase'}>
          {plan?.description ||
            'Business Class offers more comfort than regular Economy. It includes extra legroom, better seats, and upgraded meals and services.'}
        </p>
      </div>
    </section>
  );
};
