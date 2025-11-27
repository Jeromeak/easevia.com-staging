'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useRef } from 'react';
import { steps } from '../../../common/components/Data';

gsap.registerPlugin(ScrollTrigger);

export const Steps = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const heading = headingRef.current;

      if (heading) {
        gsap.from(heading.querySelectorAll('span'), {
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          duration: 1,
          delay: 0.2,
          stagger: 0.3,
          ease: 'power3.out',
        });
      }

      stepRefs.current.forEach((el, index) => {
        if (el) {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: index * 0.2,
            ease: 'power2.out',
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    setupGsapAnimations();
  }, [setupGsapAnimations]);

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    []
  );

  return (
    <section id="steps" ref={sectionRef}>
      <div className="max-w-[90%] mx-auto py-16 xl:py-38">
        <div className="flex flex-col lg:flex-row justify-between">
          <div
            ref={headingRef}
            className="xl:w-[60%] 2xl:w-[50%] lg:w-[50%] w-full text-Teal-900 dark:text-orange-200 dark:xl:text-Teal-500 text-[60px] leading-[60px] md:leading-[80px] lg:text-[80px] md:text-[80px] xl:text-10xl uppercase font-Neutra xl:leading-[101.471px] tracking-[3.548px]"
          >
            <span>Unlock Seamless</span>
            <br />
            <span>Travel with</span>
            <br /> <span>Easevia's Simple</span>
            <br /> <span>Steps</span>
          </div>
          <div className="xl:w-[40%] lg:w-[50%] 2xl:w-[30%] flex flex-col gap-5 lg:mt-0 mt-10 xl:items-end">
            {steps.map((step, index) => (
              <div key={index} ref={setStepRef(index)} className="flex flex-col">
                <h3 className="text-left lg:text-end uppercase text-Teal-500 lg:text-orange-450 dark:lg:text-orange-200 text-2xl font-Neutra lg:text-[50px] md:text-[55px] xl:text-xxl">
                  {step.title}
                </h3>
                <p className="text-left lg:text-end uppercase  text-base md:text-2xl mt-2 xl:mt-0 xl:text-2xl xl:leading-[41.819px] tracking-[1.44px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
