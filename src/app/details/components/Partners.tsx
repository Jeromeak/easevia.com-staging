'use client';
import { PartnerData } from '@/common/components/Data';
import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TravelPackage, PackageAirline } from '@/lib/types/api/package';

gsap.registerPlugin(ScrollTrigger);

interface PartnersProps {
  plan?: TravelPackage;
}

export const Partners = ({ plan }: PartnersProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const handleCardHover = useCallback((cardElement: HTMLElement, hoverTl: gsap.core.Timeline) => {
    const onMouseEnter = () => hoverTl.play();
    const onMouseLeave = () => hoverTl.reverse();
    cardElement.addEventListener('mouseenter', onMouseEnter);
    cardElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cardElement.removeEventListener('mouseenter', onMouseEnter);
      cardElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.set('.partner-card', {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: -80,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
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
          '.partner-card',
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotation: 5,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            stagger: 0.15,
            delay: 0.3,
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.utils.toArray('.partner-card').forEach((card) => {
          const cardElement = card as HTMLElement;
          const hoverTl = gsap.timeline({ paused: true });

          hoverTl.to(cardElement, {
            scale: 1.05,
            y: -5,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            duration: 0.3,
            ease: 'power2.out',
          });

          cardElement.addEventListener('mouseenter', () => hoverTl.play());
          cardElement.addEventListener('mouseleave', () => hoverTl.reverse());
        });

        gsap.utils.toArray('.partner-card').forEach((card, index) => {
          const cardElement = card as HTMLElement;
          gsap.to(cardElement, {
            y: -3,
            duration: 2 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2 + index * 0.3,
          });
        });
      }, sectionRef);

      return ctx;
    }
  }, [handleCardHover]);

  useEffect(() => {
    const ctx = setupGsapAnimations();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [setupGsapAnimations]);

  return (
    <section ref={sectionRef} className="overflow-hidden">
      <div className="dark:pb-10 py-10 md:pb-10 dark:lg:pb-20 lg:pb-20 dark:xl:py-30 xl:py-20 max-w-[85%] mx-auto">
        <div className="flex justify-between flex-wrap items-start w-full">
          <div
            ref={titleRef}
            className="md:text-90 uppercase text-5xl md:leading-22.5 font-Neutra tracking-[3px] text-Teal-500"
          >
            Airline
            <br className="lg:block hidden" /> <span className="text-orange-200">Partners</span>
          </div>
          <div className="hidden lg:flex w-[40%]">
            <div
              ref={cardsContainerRef}
              className="w-full flex justify-between flex-wrap items-center mt-0 lg:gap-[13px] xl:gap-[25px]"
            >
              {(plan?.airlines?.slice(0, 3) || PartnerData.slice(0, 3)).map((partner, index) => (
                <div
                  key={index}
                  className="partner-card w-full md:w-[calc(33.33%_-_25px)] flex justify-center items-center hover:grayscale-0 duration-500 grayscale dark:bg-gray-300 shadow-8xl rounded-2xl px-10 h-[10rem]"
                >
                  {plan?.airlines ? (
                    <div className="dark:text-white text-2xl font-bold text-center">
                      {(partner as PackageAirline).business_name || (partner as PackageAirline).common_name}
                    </div>
                  ) : (
                    (partner as (typeof PartnerData)[0]).icon
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
