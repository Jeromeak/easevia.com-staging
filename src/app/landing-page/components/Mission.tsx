'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CountData } from '../../../common/components/Data';
import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export const Mission = () => {
  const countRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const animateCounts = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      countRefs.current.forEach((el, index) => {
        if (!el) return;
        const finalValue = parseInt(CountData[index].counts.replace(/\D/g, '') || '0');
        const obj = { val: 0 };

        gsap.to(obj, {
          val: finalValue,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
          onUpdate: () => {
            if (el) {
              el.innerText = CountData[index].counts.includes('+')
                ? Math.floor(obj.val).toLocaleString() + '+'
                : Math.floor(obj.val).toLocaleString();
            }
          },
        });
      });
    }
  }, []);

  const animateTitle = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && titleRef.current) {
      gsap.from(titleRef.current, {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }
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
    animateCounts();
    animateTitle();
    animateDescription();
  }, [animateCounts, animateTitle, animateDescription]);

  const setCountRef = useCallback((el: HTMLDivElement | null, index: number) => {
    countRefs.current[index] = el;
  }, []);

  const getCountRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      setCountRef(el, index);
    },
    [setCountRef]
  );

  return (
    <section className="pb-16 xl:pb-38" id="mission">
      <div className="flex gap-5">
        <div className="w-full lg:flex-row flex-col flex h-full">
          <div className="xl:w-[55%] lg:w-[60%] 2xl:w-[45%] xl:py-12 flex md:flex-row flex-col-reverse px-8 py-10 md:py-12 md:px-10 xl:pl-[80px] xl:pr-[40px] bg-Teal-900 dark:bg-Teal-500 gap-3">
            <div className="md:w-[70%] flex flex-col">
              <div
                ref={titleRef}
                className="uppercase text-[60px] lg:text-[55px] md:text-[72px] xl:text-1xl font-Neutra leading-[55px] md:leading-10 xl:leading-[108px] text-white dark:text-black"
              >
                Simplify <br className="md:hidden block" />
                Travel
              </div>
              <p
                ref={descriptionRef}
                className="text-base xl:text-xl mt-5 md:mt-10 font-normal tracking-[1.2px] uppercase text-white dark:text-black"
              >
                Easevia by Elyts LLC is dedicated to providing travelers with a seamless, surge-free experience through
                innovative subscription plans. We focus on flexibility, affordability, and convenience, ensuring every
                journey is effortless and enjoyable.
              </p>
              <div className="flex flex-wrap mt-5 xl:mt-10 justify-between items-center gap-5 xl:gap-[50px]">
                {CountData.map((counts, index) => (
                  <div key={index} className="w-full md:w-[calc(50%_-_25px)] flex flex-col">
                    <div
                      ref={getCountRef(index)}
                      className="text-white dark:text-black text-5xl leading-normal font-Neutra"
                    >
                      {counts.counts}
                    </div>
                    <div className="text-2xl font-normal text-white dark:text-black">{counts.content}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-[30%] relative">
              <div className="md:absolute md:text-end md:text-[69px] dark:xl:text-black dark:text-white text-white md:top-10 md:right-[-20%] md:leading-[69px] xl:top-14 xl:right-[-20%] uppercase leading-10 xl:leading-22.5 tracking-[2px] md:tracking-[4.35px] transform md:rotate-[-90deg] text-[40px] xl:text-87 font-Neutra">
                our <br className="xl:block hidden" /> Mission
              </div>
            </div>
          </div>
          <div className="xl:w-[45%] lg:w-[40%] 2xl:w-[55%] flex gap-5">
            <div className="w-full">
              <Image
                src={`${cdnBaseUrl}/our_mission.webp`}
                className="w-full h-full object-cover"
                alt="Our mission"
                title="Our mission"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
