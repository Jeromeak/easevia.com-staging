'use client';
import { FlyingBirds, StarIcon } from '@/icons/icon';
import { FindTicket } from './FindTicket';
import { Fragment, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import Image from 'next/image';
import { cdnBaseUrl } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export const HeroBanner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          scale: 1.1,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
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
          delay: 0.3,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        descriptionRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.6,
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        ratingRef.current,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 0.9,
          scrollTrigger: {
            trigger: ratingRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        formRef.current,
        {
          opacity: 0,
          x: 100,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.5,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.bg-element',
        {
          opacity: 0,
          scale: 0.8,
          rotation: -10,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.utils.toArray('.flying-bird').forEach((bird, index) => {
        gsap.to(bird as HTMLElement, {
          x: '+=50',
          y: '+=20',
          rotation: 5,
          duration: 3 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3,
        });
      });

      gsap.to('.parallax-slow', {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.parallax-fast', {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }
  }, []);
  useEffect(() => {
    const ctx = gsap.context(() => {
      setupGsapAnimations();
    }, sectionRef);

    return () => ctx.revert();
  }, [setupGsapAnimations]);

  return (
    <Fragment>
      <section
        ref={sectionRef}
        className={clsx(
          'relative bg-hero_banner_light dark:bg-hero_banner lg:block hidden !overflow-hidden  bg-cover bg-center  w-full h-[100rem]  md:h-[80.5rem] lg:h-[100vh]'
        )}
      >
        <div className={clsx('bg-element parallax-slow absolute right-[30%] top-24')}>
          <Image
            src={`${cdnBaseUrl}/rectangle_1x.webp`}
            className="w-full h-fit"
            alt="booking background"
            title="Booking Background"
            width={400}
            height={300}
          />
        </div>
        <div className={clsx('bg-element parallax-fast absolute right-[-12%] top-20 h-[200px]')}>
          <Image
            src={`${cdnBaseUrl}/rectangle_1x.webp`}
            className="w-full h-full"
            alt="booking background"
            title="Booking Background"
            width={400}
            height={300}
          />
        </div>
        <div className="top-30 left-40 absolute">
          <FlyingBirds className="flying-bird w-[60px] h-[40px]" />
        </div>
        <div className="mx-auto">
          <div className="flex lg:pb-38  lg:mt-28 justify-between flex-wrap items-start w-[90%] lg:w-[85%]  gap-10  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="xl:w-[calc(60%_-_20px)] lg:w-[calc(40%_-_20px)] w-full  flex flex-col">
              <div className={clsx('bg-element parallax-slow absolute right-[45%] hidden xl:block w-[350px] top-20')}>
                <Image
                  src={`${cdnBaseUrl}/flight.webp`}
                  width={500}
                  height={500}
                  className="w-full h-fit"
                  alt="Flight"
                  title="Flight"
                />
              </div>
              <div className="">
                <FlyingBirds className="flying-bird w-[31.238px] h-[7.835px] top-[-5%] left-[-2%] absolute" />
              </div>

              <div
                ref={titleRef}
                className={clsx(
                  'font-Neutra mix-blend-exclusion relative text-white text-5xl font-medium uppercase tracking-wider leading-[57.6px]'
                )}
              >
                Fly anywhere easily without<br></br> obstacles with easevia
                <div className="">
                  <FlyingBirds className="flying-bird w-[40px] h-[20px] top-[-70%] right-[40%] absolute" />
                  <FlyingBirds className="flying-bird w-[40px] h-[20px] top-[-40%] right-[36%] absolute" />
                  <FlyingBirds className="flying-bird w-[60px] h-[20px] top-[-20%] right-[40%] absolute" />
                </div>
              </div>
              <div className="relative mt-10">
                <div className="">
                  <FlyingBirds className="flying-bird w-[31.238px] h-[7.835px] top-[-10%] right-[60%] absolute" />
                </div>
                <p
                  ref={descriptionRef}
                  className={clsx('text-base text-white font-normal leading-[20.8px] w-full xl:w-[42%]')}
                >
                  We're here to make your travel dreams a reality. Our intuitive search engine scours thousands of
                  flights to bring you the best deals tailored to your preferences and budget.
                </p>
                <div ref={ratingRef} className="flex items-center gap-3 mt-8">
                  <div>
                    <Image
                      src={`${cdnBaseUrl}/frame_1.webp`}
                      className="w-full h-fit"
                      width={80}
                      height={80}
                      alt="rating frame"
                      title="Rating Frame"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <StarIcon className="text-orange-200" />
                    <div className="text-sm text-white">5.00 Ratings from 100+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
            <div ref={formRef} className="lg:w-[calc(60%_-_20px)] w-full xl:w-[calc(40%_-_20px)]">
              <FindTicket />
            </div>
          </div>
        </div>
        <div className="hidden">
          <h1></h1>
          <h2></h2>
          <h3></h3>
        </div>
      </section>
      <section className="pt-24 lg:hidden block">
        <FindTicket />
      </section>
    </Fragment>
  );
};
