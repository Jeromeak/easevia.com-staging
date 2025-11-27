'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export const Booking = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const animateText = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && textRef.current) {
      const scrollAnimation = gsap.to(textRef.current, {
        y: -100,
        opacity: 1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      return scrollAnimation;
    }

    return undefined;
  }, []);

  const animateDescription = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && descriptionRef.current) {
      gsap.from(descriptionRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }, []);

  useEffect(() => {
    const scrollAnimation = animateText();
    animateDescription();

    return () => {
      if (scrollAnimation) scrollAnimation.kill();
    };
  }, [animateText, animateDescription]);

  const sectionClassName = useMemo(() => clsx('pb-16 xl:pb-38'), []);
  const containerClassName = useMemo(
    () => clsx('max-w-[90%] mx-auto lg:max-w-full xl:mx-0 xl:w-full lg:flex-row flex-col flex xl:h-[800px] relative'),
    []
  );
  const leftColClassName = useMemo(() => clsx('xl:w-[40%] lg:w-[20%]'), []);
  const textClassName = useMemo(
    () =>
      clsx(
        'hidden lg:block xl:bottom-[30%] lg:top-[40%] text-[50px] leading-[50px] lg:leading-[75px] lg:text-[75px] md:text-[90px] lg:left-[-13%] 2xl:left-[2%] xl:left-[7%] lg:absolute lg:whitespace-nowrap lg:rotate-[-90deg] tracking-[4.72px] xl:leading-[101.695px] xl:text-10xl uppercase text-Teal-900 dark:text-Teal-500 font-Neutra'
      ),
    []
  );
  const textMobileClassName = useMemo(
    () =>
      clsx(
        'block lg:hidden xl:bottom-[30%] lg:top-[40%] text-5xl lg:text-[75px] md:text-[90px] lg:left-[-13%] 2xl:left-[2%] xl:left-[-6%] lg:absolute lg:whitespace-nowrap lg:rotate-[-90deg] tracking-[4.72px] xl:leading-[101.695px] xl:text-10xl uppercase text-orange-200 font-Neutra'
      ),
    []
  );
  const rightColClassName = useMemo(
    () => clsx('lg:w-[80%] xl:w-[60%] flex gap-5 lg:h-[505.5px] xl:h-[799px] mt-5 xl:mt-0'),
    []
  );
  const imgWrapperClassName = useMemo(() => clsx('w-full overflow-hidden'), []);
  const imgClassName = useMemo(
    () => clsx('w-full h-full object-cover transition-all duration-500 hover:scale-125 scale-100'),
    []
  );
  const descRowClassName = useMemo(() => clsx('flex xl:max-w-full max-w-[90%] mx-auto xl:mx-0 mt-12'), []);
  const descSpacerClassName = useMemo(() => clsx('xl:block hidden xl:w-[26%] 2xl:w-[16%] w-[17%]'), []);
  const descClassName = useMemo(
    () =>
      clsx(
        'xl:w-[55%] 2xl:w-[40%] md:text-xl w-[85%] text-base font-normal uppercase leading-[30px] tracking-[1.14px]'
      ),
    []
  );

  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <div className={leftColClassName}>
          <div ref={textRef} className={textClassName}>
            Seamless Flight
            <br />
            Booking
          </div>
          <div className={textMobileClassName}>
            Seamless Flight
            <br />
            Booking
          </div>
        </div>
        <div className={rightColClassName}>
          <div className={imgWrapperClassName}>
            <Image
              src={`${cdnBaseUrl}/Booking_1.webp`}
              alt="Seamless flight booking"
              title="Seamless flight booking"
              className={imgClassName}
              width={1920}
              height={1080}
            />
          </div>
        </div>
      </div>
      <div className={descRowClassName}>
        <div className={descSpacerClassName}></div>
        <div ref={descriptionRef} className={descClassName}>
          With Easevia, booking your next flight is easier than ever. Our platform provides real-time access to flight
          availability, allowing you to search, filter, and book flights instantly. Say goodbye to complicated booking
          processes and hello to stress-free travel planning.
        </div>
      </div>
    </section>
  );
};
