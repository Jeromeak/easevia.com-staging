'use client';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export const Flexible = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, bottomTextRef.current, imageRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: -80,
            y: 40,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.4,
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
            x: -150,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.6,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: imageRef.current,
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

        gsap.fromTo(
          bottomTextRef.current,
          {
            opacity: 0,
            x: 80,
            y: 40,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.4,
            ease: 'power2.out',
            delay: 0.6,
            scrollTrigger: {
              trigger: bottomTextRef.current,
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

  const sectionClassName = useMemo(() => clsx('pb-0 md:pb-5 lg:pb-20 dark:lg:pb-30 dark:xl:py-30 overflow-hidden'), []);
  const containerClassName = useMemo(() => clsx('ml-4 md:ml-auto w-[90%] lg:w-[85%]'), []);
  const titleClassName = useMemo(
    () =>
      clsx(
        'text-start w-full text-5xl md:text-7xl lg:text-96 lg:leading-24 uppercase font-Neutra text-orange-200 tracking-[2.88px]'
      ),
    []
  );
  const imageContainerClassName = useMemo(() => clsx('w-[95%] md:w-[85%] mt-10 md:mt-20 relative'), []);
  const overlayClassName = useMemo(
    () => clsx('absolute top-[-20%] md:top-[-10%] inset-0 bg-[#FE5E15] mix-blend-color-burn pointer-events-none z-10'),
    []
  );
  const imageClassName = useMemo(() => clsx('w-full h-fit relative z-0'), []);
  const bottomContainerClassName = useMemo(() => clsx('max-w-[85%] mx-auto mt-5 md:mt-10'), []);
  const bottomTextClassName = useMemo(
    () =>
      clsx(
        'text-end text-2xl md:text-4xl text-neutral-50 dark:text-white lg:text-64 leading-6 md:leading-10 lg:leading-16 font-Neutra tracking-[0.72px] md:tracking-[1.92px] uppercase'
      ),
    []
  );

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div className={containerClassName}>
        <div ref={titleRef} className={titleClassName}>
          Flexible
          <br /> ticket booking
        </div>
      </div>
      <div className={imageContainerClassName}>
        <div className={overlayClassName} />
        <Image
          ref={imageRef}
          src={`${cdnBaseUrl}/flexible.webp`}
          width={1200}
          height={800}
          priority
          className={imageClassName}
          alt="Flexible"
          title="Flexible"
        />
      </div>
      <div className={bottomContainerClassName}>
        <div ref={bottomTextRef} className={bottomTextClassName}>
          Booking Leadtime
          <br /> before 48 hours
        </div>
      </div>
    </section>
  );
};
