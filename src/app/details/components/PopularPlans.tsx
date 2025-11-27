'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRightUpIcon, ThunderIcon } from '@/icons/icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export const PopularPlans = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const [cards] = useState<
    { id: number; name: string; classType: string; description: string; price: string; tag: string }[]
  >([
    {
      id: 1,
      name: 'Basic Plan',
      classType: 'Economy',
      description: 'Perfect for occasional travelers',
      price: '$299',
      tag: 'Popular',
    },
    {
      id: 2,
      name: 'Premium Plan',
      classType: 'Business',
      description: 'Great for frequent business travelers',
      price: '$599',
      tag: 'Best Value',
    },
    {
      id: 3,
      name: 'VIP Plan',
      classType: 'First',
      description: 'Luxury travel experience',
      price: '$999',
      tag: 'Premium',
    },
  ]);

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, navigationRef.current, swiperContainerRef.current], {
          opacity: 0,
          visibility: 'visible',
        });

        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: -50,
            y: 20,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          navigationRef.current,
          {
            opacity: 0,
            x: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: 'back.out(1.2)',
            delay: 0.3,
            scrollTrigger: {
              trigger: navigationRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          swiperContainerRef.current,
          {
            opacity: 0,
            y: 40,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.5,
            scrollTrigger: {
              trigger: swiperContainerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.to(swiperContainerRef.current, {
          y: -10,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
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

  const handleSubscribe = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  const handleDetails = useCallback(() => {
    router.push('/details');
  }, [router]);

  // Show swiper only if we have 5+ cards on lg screens and above
  const shouldShowSwiper = cards.length >= 5;

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#fafafa] dark:bg-black">
      <div className="max-w-[85%] relative ml-4 md:mx-auto pb-0 dark:lg:pb-20 lg:pb-10 xl:py-10 dark:xl:py-30 mt-10 overflow-visible">
        <div className="flex justify-center flex-row md:flex-col lg:flex-row gap-5 md:justify-between flex-wrap h-full lg:items-start !w-full">
          <div
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-90 font-Neutra uppercase tracking-[2.88px] lg:tracking-[5.76px] text-Teal-500 leading-12 md:leading-22.5"
          >
            Popular <span className="text-orange-200">plans</span>
          </div>
          {shouldShowSwiper && (
            <div ref={navigationRef} className="hidden lg:flex items-center gap-6 overflow-visible">
              <div className="w-20 group swiper-button-prev-custom text-orange-200 cursor-pointer h-20 flex justify-center items-center rounded-full border-[2.571px] border-orange-200">
                <ArrowLeft className="group-hover:-translate-x-2 duration-500" />
              </div>
              <div className="w-20 group swiper-button-next-custom text-orange-200 cursor-pointer h-20 flex justify-center items-center rounded-full border-[2.571px] border-orange-200">
                <ArrowLeft className="transform rotate-180 group-hover:translate-x-2 duration-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conditional rendering: Swiper for 5+ cards on lg+, normal grid otherwise */}
      {shouldShowSwiper ? (
        <div className="lg:ml-auto lg:mx-0 mx-auto w-[90%] lg:w-[92%] overflow-visible">
          <div ref={swiperContainerRef} className="w-full pb-5 mt-10 lg:mt-20 overflow-visible">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              grabCursor={true}
              speed={1000}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 2, spaceBetween: 40 },
                1200: { slidesPerView: 3, spaceBetween: 40 },
                1400: { slidesPerView: 3, spaceBetween: 40 },
              }}
            >
              {cards.map(
                (plan: {
                  id: number;
                  name: string;
                  classType: string;
                  description: string;
                  price: string;
                  tag: string;
                }) => (
                  <SwiperSlide className="!w-" key={plan.id}>
                    <div className="bg-white dark:bg-gray-300 border flex flex-col w-full h-full border-Teal-500 p-5 xl:p-10 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="p-[8px] shadow-9xl bg-white dark:bg-black rounded-lg">
                          <div>
                            <ThunderIcon className="w-full h-full" id={`thunder-${plan.id}`} />
                          </div>
                        </div>
                        <div className="font-Neutra text-41 leading-[58.71px] tracking-[-0.419px] uppercase text-orange-200">
                          {plan.name}
                        </div>
                      </div>
                      <div className="py-0.5 px-3 bg-orange-200 w-fit mt-2 rounded-full text-white dark:text-black uppercase text-xs font-medium">
                        {plan.tag}
                      </div>
                      <div className="text-[#3F3F3F] dark:text-gray-600 mt-4 line-clamp-2">{plan.description}</div>
                      <div className="mt-6 text-neutral-800 text-xl">
                        <span className="font-Neutra text-5xl font-medium text-Teal-900">{plan.price}</span>/ Year
                      </div>
                      <div className="text-sm underline text-[#39A0F4] dark:text-blue-100 cursor-pointer mt-1">
                        Terms & Conditions
                      </div>
                      <div className="flex justify-start lg:justify-center items-center mt-10 gap-6 md:gap-10 lg:gap-8">
                        <button
                          type="button"
                          onClick={handleSubscribe}
                          className="flex gap-3 text-sm lg:text-lg xl:text-base cursor-pointer hover:bg-transparent dark:hover:bg-orange-200 border border-transparent hover:border-orange-200 hover:text-orange-200 duration-500 group items-center uppercase w-fit justify-center py-2 px-3 md:px-8 xl:px-3 rounded-full bg-orange-200 text-white dark:text-black"
                        >
                          Subscribe
                          <ArrowLeft
                            width="24"
                            height="24"
                            className="transform rotate-[-180deg] group-hover:translate-x-2 duration-300"
                          />
                        </button>
                        <button
                          onClick={handleDetails}
                          type="button"
                          className="w-12 flex text-Teal-500 hover:bg-Teal-500 duration-500 hover:text-white cursor-pointer group justify-center items-center h-12 border-2 border-Teal-500 rounded-full"
                        >
                          <ArrowRightUpIcon
                            width="26"
                            height="26"
                            className="group-hover:rotate-[45deg] duration-300"
                          />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>
      ) : (
        /* Normal grid view for less than 5 cards */
        <div className="max-w-[85%] mx-auto mt-10 lg:mt-20">
          <div ref={swiperContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cards.map(
              (plan: {
                id: number;
                name: string;
                classType: string;
                description: string;
                price: string;
                tag: string;
              }) => (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-gray-300 border flex flex-col w-full max-w-[400px] mx-auto h-full border-Teal-500 p-5 xl:p-10 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-[8px] shadow-9xl bg-white dark:bg-black rounded-lg">
                      <div>
                        <ThunderIcon className="w-full h-full" id={`thunder-${plan.id}`} />
                      </div>
                    </div>
                    <div className="font-Neutra text-41 leading-[58.71px] tracking-[-0.419px] uppercase text-orange-200">
                      {plan.name}
                    </div>
                  </div>
                  <div className="py-0.5 px-3 bg-orange-200 w-fit mt-2 rounded-full text-white dark:text-black uppercase text-xs font-medium">
                    {plan.tag}
                  </div>
                  <div className="text-[#3F3F3F] dark:text-gray-600 mt-4 line-clamp-2">{plan.description}</div>
                  <div className="mt-6 text-neutral-800 text-xl">
                    <span className="font-Neutra text-5xl font-medium text-Teal-900">{plan.price}</span>/ Year
                  </div>
                  <div className="text-sm underline text-[#39A0F4] dark:text-blue-100 cursor-pointer mt-1">
                    Terms & Conditions
                  </div>
                  <div className="flex justify-start lg:justify-center items-center mt-10 gap-6 md:gap-10 lg:gap-8">
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      className="flex gap-3 text-sm lg:text-lg xl:text-base cursor-pointer hover:bg-transparent dark:hover:bg-orange-200 border border-transparent hover:border-orange-200 hover:text-orange-200 duration-500 group items-center uppercase w-fit justify-center py-2 px-3 md:px-8 xl:px-3 rounded-full bg-orange-200 text-white dark:text-black"
                    >
                      Subscribe
                      <ArrowLeft
                        width="24"
                        height="24"
                        className="transform rotate-[-180deg] group-hover:translate-x-2 duration-300"
                      />
                    </button>
                    <button
                      onClick={handleDetails}
                      type="button"
                      className="w-12 flex text-Teal-500 hover:bg-Teal-500 duration-500 hover:text-white cursor-pointer group justify-center items-center h-12 border-2 border-Teal-500 rounded-full"
                    >
                      <ArrowRightUpIcon width="26" height="26" className="group-hover:rotate-[45deg] duration-300" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
};
