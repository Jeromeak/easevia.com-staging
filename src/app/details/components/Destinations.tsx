'use client';
import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TravelPackage } from '@/lib/types/api/package';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

interface DestinationsProps {
  plan?: TravelPackage;
}

export const Destinations = ({ plan }: DestinationsProps) => {
  const headingRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
        });

        gsap.from(subHeadingRef.current, {
          scrollTrigger: {
            trigger: subHeadingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.2,
          ease: 'power2.out',
        });

        gsap.fromTo(
          img1Ref.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: img1Ref.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          [img2Ref.current, img3Ref.current],
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: img2Ref.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

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
    <section className="overflow-hidden">
      <div className="max-w-[90%] mx-auto dark:lg:pb-38 dark:md:pb-10 pt-4 lg:pt-10 overflow-hidden">
        <div className="flex flex-col">
          <div
            ref={headingRef}
            className="text-5xl md:text-90 font-semibold font-Neutra text-Teal-500 uppercase tracking-[3px] leading-12 md:leading-22.5"
          >
            Destinations
          </div>
          <div
            ref={subHeadingRef}
            className="text-2xl md:text-32 font-normal font-Futura leading-9 tracking-[1.44px] md:tracking-[1.92px] md:leading-12 uppercase text-orange-200 pt-2 md:pt-0"
          >
            Regional and Global Popularity
          </div>
        </div>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 md:gap-[12px] h-full md:h-[25rem] lg:h-[40rem] mt-12 md:mt-16">
          <div ref={img1Ref} className="w-full h-full relative overflow-hidden group">
            <Image
              src={`${cdnBaseUrl}/destination_1.webp`}
              className="w-full group-hover:scale-[1.2] duration-500  transition-all ease-in-out h-full object-cover"
              width={600}
              height={400}
              alt="destination_1"
              title="Destination 1"
            />
            <div className="text-32 font-normal text-white bottom-10 left-10 absolute">
              {plan ? `${plan.title} destinations` : 'Dubai to Europe'}
            </div>
          </div>
          <div className="grid grid-rows-2 md:gap-[6px] h-full">
            <div ref={img2Ref} className="relative group overflow-hidden">
              <Image
                src={`${cdnBaseUrl}/destination_2.webp`}
                className="w-full h-full object-cover group-hover:scale-[1.2] duration-500  transition-all ease-in-out"
                alt="destination_2"
                title="Destination 2"
                width={600}
                height={400}
              />
              <div className="text-32 font-normal text-white bottom-10 left-10 absolute">Asia</div>
            </div>
            <div ref={img3Ref} className="relative overflow-hidden group">
              <Image
                src={`${cdnBaseUrl}/destination_3.webp`}
                className="w-full h-full object-cover group-hover:scale-[1.2] duration-500  transition-all ease-in-out"
                alt="destination_3"
                title="Destination 3"
                width={600}
                height={400}
              />
              <div className="text-32 font-normal text-white bottom-10 left-10 absolute">North America</div>
            </div>
          </div>
        </div>
      </div>
      <div className="block md:hidden max-w-full mx-auto lg:pb-38 pb-20 md:pb-10 lg:pt-10 overflow-hidden">
        <div className="md:hidden grid grid-cols-1 md:grid-cols-2 md:gap-[12px] h-full md:h-[25rem] lg:h-[40rem] mt-12 md:mt-16">
          <div ref={img1Ref} className="w-full h-[30rem] relative overflow-hidden group">
            <Image
              src={`${cdnBaseUrl}/destination_1.webp`}
              className="w-full group-hover:scale-[1.2] duration-500  transition-all ease-in-out h-full object-cover"
              alt="destination_1"
              title="Destination 1"
              width={600}
              height={400}
            />
            <div className="text-32 font-normal text-white bottom-10 left-10 absolute">Dubai to Europe</div>
          </div>
          <div className="grid grid-rows-2 md:gap-[6px] h-full">
            <div ref={img2Ref} className="relative group overflow-hidden">
              <Image
                src={`${cdnBaseUrl}/destination_2.webp`}
                className="w-full h-full object-cover group-hover:scale-[1.2] duration-500  transition-all ease-in-out"
                alt="destination_2"
                title="Destination 2"
                width={600}
                height={400}
              />
              <div className="text-32 font-normal text-white bottom-10 left-10 absolute">Asia</div>
            </div>
            <div ref={img3Ref} className="relative overflow-hidden group">
              <Image
                src={`${cdnBaseUrl}/destination_3.webp`}
                className="w-full h-full object-cover group-hover:scale-[1.2] duration-500  transition-all ease-in-out"
                alt="destination_3"
                title="Destination 3"
                width={600}
                height={400}
              />
              <div className="text-32 font-normal text-white bottom-10 left-10 absolute">North America</div>
            </div>
          </div>
        </div>
      </div>
      <div className="block md:hidden max-w-full mx-auto lg:pb-38 pb-20 md:pb-10 lg:pt-10 overflow-hidden">
        <div className="md:hidden grid grid-cols-1 md:grid-cols-2 md:gap-[12px] h-full md:h-[25rem] lg:h-[40rem] mt-12 md:mt-16">
          <div ref={img1Ref} className="w-full h-[30rem] relative overflow-hidden group">
            <Image
              src={`${cdnBaseUrl}/destination_1.webp`}
              className="w-full group-hover:scale-[1.2] duration-500  transition-all ease-in-out h-full object-cover"
              alt="destination_1"
              title="Destination 1"
              width={600}
              height={400}
            />
            <div className="text-32 font-normal text-white bottom-10 left-10 absolute">Dubai to Europe</div>
          </div>
          <div className="grid grid-rows-2 md:gap-[6px] h-full">
            <div ref={img2Ref} className="relative group overflow-hidden">
              <Image
                src={`${cdnBaseUrl}/destination_2.webp`}
                className="w-full h-full object-cover group-hover:scale-[1.2] duration-500  transition-all ease-in-out"
                alt="destination_2"
                title="Destination 2"
                width={600}
                height={400}
              />
              <div className="text-32 font-normal text-white bottom-10 left-10 absolute">Asia</div>
            </div>
            <div ref={img3Ref} className="relative overflow-hidden group">
              <Image
                src={`${cdnBaseUrl}/destination_3.webp`}
                className="w-full h-full object-cover group-hover:scale-[1.2] duration-500  transition-all ease-in-out"
                alt="destination_3"
                title="Destination 3"
                width={600}
                height={400}
              />
              <div className="text-32 font-normal text-white bottom-10 left-10 absolute">North America</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
