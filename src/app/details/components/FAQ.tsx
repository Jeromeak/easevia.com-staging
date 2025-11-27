'use client';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faqData } from '@/common/components/Data';
import { FAQItem } from './FAQitem';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sideTitleRef = useRef<HTMLDivElement>(null);
  const faqContainerRef = useRef<HTMLDivElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([sideTitleRef.current, faqContainerRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          sideTitleRef.current,
          {
            opacity: 0,
            x: -200,
            y: 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.to(sideTitleRef.current, {
          y: -50,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.fromTo(
          faqContainerRef.current,
          {
            opacity: 0,
            x: 100,
            y: 50,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.3,
            ease: 'power2.out',
            delay: 0.3,
            scrollTrigger: {
              trigger: faqContainerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        const faqItems = gsap.utils.toArray(faqContainerRef.current?.children || []) as HTMLElement[];
        faqItems.forEach((item, index) => {
          gsap.set(item, { opacity: 0, x: 80, y: 30 });

          gsap.to(item, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.6 + index * 0.1,
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

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  return (
    <section ref={sectionRef} className={clsx('bg-white dark:bg-gray-300 overflow-hidden')}>
      <div className="max-w-[90%] relative mx-auto pb-10 lg:pb-30 pt-13 lg:pt-10">
        <div
          ref={sideTitleRef}
          className={clsx(
            'lg:absolute md:top-[300px] text-orange-200 text-left',
            'lg:text-end md:left-[-30%] xl:left-[-15%] text-5xl md:text-6xl lg:text-96',
            'lg:leading-24 font-Neutra tracking-[5.76px]',
            'uppercase lg:whitespace-nowrap rotate-none md:rotate-0 lg:-rotate-90'
          )}
        >
          <span className="text-Teal-500">frequently</span> <br className="hidden md:block" /> asked question
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <div className="lg:w-[30%] w-full xl:w-[50%]" />
          <div
            ref={faqContainerRef}
            className={clsx('lg:w-[70%] w-full xl:w-[50%] flex flex-col justify-end items-end')}
          >
            {useMemo(() => {
              const handlers = faqData.map((_, idx) => () => handleToggle(idx));

              return faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  isOpen={openIndex === index}
                  onToggle={handlers[index]}
                  answer={item.answer}
                />
              ));
            }, [faqData, openIndex, handleToggle])}
          </div>
        </div>
      </div>
    </section>
  );
};
