'use client';
import { PartnerData } from '@/common/components/Data';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Experience = () => {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const boxesRef = useRef<HTMLDivElement[]>([]);

  const setBoxRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) boxesRef.current[index] = el;
  }, []);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (titleRef.current) {
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

      boxesRef.current.forEach((el, i) => {
        if (el) {
          gsap.from(el, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            overwrite: 'auto',
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      setupGsapAnimations();
    });

    const handleResize = () => {
      ctx.revert();
      setupGsapAnimations();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [setupGsapAnimations]);

  const partnerBoxClassName = useMemo(
    () =>
      clsx(
        'partner-box w-[calc(50%_-_10px)] md:w-[calc(33.33%_-_16.66px)] flex justify-center items-center duration-500 rounded-2xl px-5 lg:px-10 h-[6rem] md:h-[10rem] bg-white dark:bg-gray-300 shadow-8xl transition-all',
        'dark:grayscale dark:hover:grayscale-0'
      ),
    []
  );

  const renderPartnerBox = useCallback(
    (Partner: { id: string | number; icon: React.ReactNode }, index: number) => (
      <div key={Partner.id} ref={(el) => setBoxRef(el, index)} className={partnerBoxClassName}>
        {Partner.icon}
      </div>
    ),
    [setBoxRef, partnerBoxClassName]
  );

  const sectionClassName = useMemo(() => clsx(), []);
  const containerClassName = useMemo(() => clsx('max-w-[90%] mx-auto pb-16 xl:pt-20 xl:pb-38'), []);
  const flexClassName = useMemo(() => clsx('w-full flex justify-between items-start gap-5 flex-wrap'), []);
  const leftColClassName = useMemo(
    () =>
      clsx(
        'w-full lg:w-[calc(30%_-_10px)] uppercase md:text-90 text-[40px] leading-[40px] md:leading-[90px] font-Neutra text-orange-200 lg:text-Teal-500'
      ),
    []
  );
  const rightColClassName = useMemo(() => clsx('w-full sm:w-full lg:w-[calc(50%_-_10px)]'), []);
  const partnersFlexClassName = useMemo(
    () => clsx('w-full flex justify-between flex-wrap items-center lg:gap-[25px] gap-[20px]'),
    []
  );

  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <div className={flexClassName}>
          <div className={leftColClassName}>
            <div ref={titleRef}>
              Experience
              <br className="lg:hidden block" /> Flying with Our
              <br className="lg:hidden block" /> Airline Partners
            </div>
          </div>
          <div className={rightColClassName}>
            <div className={partnersFlexClassName}>{PartnerData.map(renderPartnerBox)}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
