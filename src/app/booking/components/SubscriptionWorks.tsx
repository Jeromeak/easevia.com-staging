'use client';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export const SubscriptionWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageLeftRef = useRef<HTMLDivElement>(null);
  const imageRightRef = useRef<HTMLDivElement>(null);

  const stepTexts = useMemo(
    () => [
      ['Pick the plan best for', 'you & sign up'],
      ['Pay a fixed amount for', '12 months'],
      ['Receive roundtrip', 'flight credits monthly', 'or bi-monthly'],
    ],
    []
  );
  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return;
    }

    gsap.fromTo(
      imageLeftRef.current,
      {
        opacity: 0,
        x: -100,
        scale: 0.9,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: imageLeftRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.fromTo(
      imageRightRef.current,
      {
        opacity: 0,
        x: 100,
        scale: 0.9,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: imageRightRef.current,
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
        y: 80,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    gsap.fromTo(
      '.step-text',
      {
        opacity: 0,
        y: 50,
        x: 30,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
        delay: 0.6,
        scrollTrigger: {
          trigger: '.step-text',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.to(imageLeftRef.current, {
      y: -30,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    gsap.to(imageRightRef.current, {
      y: -50,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
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

  return (
    <section ref={sectionRef} className="overflow-hidden ">
      <div className="flex items-stretch flex-wrap w-full h-full lg:h-[55rem]">
        <div
          ref={imageLeftRef}
          className="w-full lg:w-1/2 h-[30rem] md:h-[40rem] lg:h-[60rem] xl:h-[63rem] dark:lg:h-[55rem]"
        >
          <Image
            src={`${cdnBaseUrl}/subscribe_works_1.webp`}
            className="w-full object-cover h-full"
            width={1000}
            height={1000}
            title="Subscription Works"
            alt="subscription_works"
          />
        </div>
        <div className="w-full lg:w-1/2 relative lg:py-32 dark:lg:py-0 py-10 dark:lg:h-[40rem] xl:h-full bg-Teal-500 dark:bg-black">
          <div ref={imageRightRef} className="absolute top-0 right-0 w-full lg:w-[80%]">
            <Image
              src={`${cdnBaseUrl}/subscribe_works_2.webp`}
              className="w-full"
              width={1000}
              height={1000}
              title="Subscription Works"
              alt="subscription_works"
            />
          </div>
          <div className="flex text-end gap-10 lg:gap-20 flex-col px-5 lg:px-0 lg:pr-20">
            <div
              ref={titleRef}
              className="lg:text-87 text-40 leading-10 md:leading-18 lg:leading-20 md:text-7xl font-Neutra text-white dark:text-Teal-500 uppercase text-end xl:leading-22.5"
            >
              How Flight
              <br /> Subscription
              <br className="hidden lg:block" /> works
            </div>
            <div className="flex flex-col gap-5  lg:gap-10">
              {stepTexts.map((lines, idx) => (
                <p
                  key={idx}
                  className={clsx('step-text md:text-32 text-2xl lg:text-end md:leading-[44.8px] uppercase')}
                >
                  {lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
