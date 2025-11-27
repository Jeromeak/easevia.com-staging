'use client';
import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export const Subscription = () => {
  const headingRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLImageElement | null>(null);
  const rightTextRef = useRef<HTMLDivElement | null>(null);
  const topTextRef = useRef<HTMLDivElement | null>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      const ctx = gsap.context(() => {
        if (headingRef.current) {
          const spans = headingRef.current.querySelectorAll('span');
          const headingTl = gsap.timeline({
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          });

          headingTl.from(spans, {
            y: 60,
            autoAlpha: 0,
            ease: 'back.out(1.7)',
            stagger: 0.15,
            duration: 0.8,
          });
        }

        if (planeRef.current) {
          gsap.fromTo(
            planeRef.current,
            { scale: 0.4, rotation: -10 },
            {
              scale: 1,
              rotation: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: planeRef.current,
                start: 'top 95%',
                end: 'bottom top',
                scrub: 1,
                toggleActions: 'play none none reverse',
              },
              duration: 2,
            }
          );
        }

        if (rightTextRef.current) {
          gsap.from(rightTextRef.current, {
            x: 120,
            autoAlpha: 0,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: rightTextRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        }

        if (topTextRef.current) {
          gsap.from(topTextRef.current, {
            y: 80,
            autoAlpha: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: topTextRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });

      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    const cleanup = setupGsapAnimations();

    return cleanup;
  }, [setupGsapAnimations]);

  return (
    <section className="overflow-hidden">
      <div className="relative">
        <div className="relative">
          <img
            src={`${cdnBaseUrl}/back_frame.webp`}
            className="w-full h-full object-contain"
            alt="back_frame"
            title="Back Frame"
          />
          <div className="absolute lg:bottom-60 md:bottom-40 bottom-20 xl:bottom-80 2xl:bottom-100">
            <img
              ref={planeRef}
              src={`${cdnBaseUrl}/plane_single.webp`}
              alt="Plane"
              className="w-full h-full object-contain"
              title="Plane"
            />
          </div>
        </div>

        <div
          ref={headingRef}
          className="absolute top-10 xl:top-30 pl-4 md:pl-14 xl:text-2xxl md:leading-[90px] md:text-[90px] leading-[50px] text-[50px] font-Neutra text-Teal-500 xl:leading-[160px] uppercase"
        >
          <span> Enjoy Travel</span>
          <br /> <span>with Easevia's</span> <br />
          <span>Subscription Plans</span>
        </div>

        <div
          ref={rightTextRef}
          className="lg:absolute text-end right-10 md:text-6xl text-4xl px-10 xl:px-0 mt-5 xl:mt-0 uppercase xl:text-76 font-Neutra xl:leading-[79.508px] tracking-[3.843px] lg:bottom-30 xl:bottom-40"
        >
          through easevia
          <br /> Booking
        </div>
      </div>

      <div className="max-w-[90%] mx-auto pb-16 pt-16 xl:pb-38 xl:pt-[100px]">
        <p
          ref={topTextRef}
          className="text-base xl:text-[40px] md:text-[24px] xl:w-[60%] 2xl:w-[56%] tracking-[2.4px] xl:leading-[50px] uppercase"
        >
          Easevia offers a revolutionary approach to flight booking, providing travelers with subscription-based plans
          that guarantee a seamless and cost-effective experience. Say goodbye to unpredictable surge pricing and hello
          to stress-free travel planning with our flexible subscription options.
        </p>
      </div>
    </section>
  );
};
