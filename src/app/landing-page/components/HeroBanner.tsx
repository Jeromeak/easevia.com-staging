'use client';
import { SecondaryLogo } from '@/icons/icon';
import { cdnBaseUrl } from '@/lib/config';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useCallback } from 'react';

export const HeroSection = () => {
  const logoRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const animateLogo = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    }
  }, []);

  const animateSection = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    }
  }, []);

  useEffect(() => {
    animateLogo();
    animateSection();
  }, [animateLogo, animateSection]);

  return (
    <section id="home">
      <div className="flex flex-col gap-10 md:gap-24 pt-10 lg:pt-38 justify-center items-center w-full">
        <div ref={logoRef} className="lg:block hidden">
          <SecondaryLogo />
        </div>
        <div
          ref={sectionRef}
          className="flex 2xl:h-482 xl:h-[572px] lg:mt-0 mt-[28px] lg:h-[444px] lg:flex-row flex-col h-full justify-between w-full"
        >
          <div className="xl:w-[50%] lg:w-[55%] 2xl:w-[45%] h-full md:py-14 py-[28px] px-[24px] md:px-15 bg-Teal-900 dark:bg-Teal-500">
            <div className="flex flex-col w-full h-full md:gap-10 xl:gap-0 lg:gap-12 gap-10 justify-between xl:w-[80%] 2xl:w-[70%]">
              <h1 className="font-Neutra text-[47px] font-semibold leading-[50px] xl:text-7xl lg:text-[60px] md:text-7xl text-white dark:text-black uppercase tracking-[3px] md:tracking-[4.32px] md:leading-[72px]">
                Fly Smarter <br /> with Easevia!
              </h1>
              <p className="text-base md:text-xl font-normal uppercase text-white dark:text-black md:leading-[28px]">
                Subscription travel from the UAE. Book flights in advance with fixed credits, avoid surge pricing, and
                ensure priority access. Experience hassle-free travel with Easevia.
              </p>
            </div>
          </div>
          <div className="xl:w-[50%] lg:w-[45%] 2xl:w-[55%] h-[280px] md:h-full">
            <Image
              src={`${cdnBaseUrl}/heroBanner.webp`}
              className="w-full h-full object-cover"
              alt="Easevia hero banner"
              title="Easevia hero banner"
              width={500}
              height={500}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
