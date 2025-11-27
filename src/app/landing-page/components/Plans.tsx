'use client';
import {
  ArrowLeft,
  ArrowRightUpIcon,
  LocationIcon,
  PlaneUpIcon,
  RightArrow,
  ThunderIcon,
  TickIcon,
} from '@/icons/icon';
import { plansData } from '../../../common/components/Data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCallback } from 'react';
import Link from 'next/link';
import { useAuthModal, AuthModalType } from '@/hooks/useAuthModal';

export const Plans = () => {
  const { openModal } = useAuthModal();
  const handleSubscribe = useCallback(() => {
    openModal(AuthModalType.LOGIN);
  }, [openModal]);

  return (
    <section className="md:pt-10 pb-16 md:pb-38" id="plans">
      <div className="max-w-[90%] mx-auto ">
        <div className="flex justify-between h-full items-start w-full flex-wrap">
          <div className="w-full xl:w-[51%] sm:w-1/2 text-5xl sm:text-6xl xl:text-90 md:leading-17.5 lg:leading-22.5 font-Neutra uppercase text-orange-200 lg:text-Teal-900 dark:lg:text-Teal-500 ">
            Pick your
            <br />
            affordable
            <br />
            subscription
            <br className="lg:hidden block" /> plans
          </div>
          <div className="xl:w-[49%] lg:w-1/2 md:w-1/2 sm:w-1/2 w-full flex mt-3 md:mt-0 flex-col gap-8 md:gap-24 items-end">
            <div className="text-left md:text-end tracking-[1.2px] uppercase font-normal lg:text-xl text-base lg:leading-7">
              designed to make your dollars
              <br className="hidden md:block" /> go further and bring your
              <br className="hidden md:block" /> favorite destinations closer.
            </div>
            <div className="lg:flex hidden items-center gap-6">
              <div className="w-15 sm:w-20 h-15 sm:h-20 group swiper-button-prev-custom text-orange-450 dark:text-orange-200 cursor-pointer flex justify-center items-center rounded-full border-[2.571px] border-orange-200">
                <ArrowLeft className="group-hover:-translate-x-2 duration-500" />
              </div>
              <div className="w-15 md:w-20 h-15 md:h-20 group swiper-button-next-custom text-orange-450 dark:text-orange-200 cursor-pointer flex justify-center items-center rounded-full border-[2.571px] border-orange-200">
                <ArrowLeft className="transform rotate-180 group-hover:translate-x-2 duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto md:ml-auto">
        <div className="flex justify-between items-stretch w-full gap-20 h-full mt-10 sm:mt-20">
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
            spaceBetween={40}
            breakpoints={{
              320: { slidesPerView: 1.3 },
              768: { slidesPerView: 1.5 },
              1024: { slidesPerView: 1.5 },
              1200: { slidesPerView: 3.5 },
            }}
          >
            {plansData.plans.map((plan) => (
              <SwiperSlide className="lg:pt-20">
                <div
                  key={plan.id}
                  className=" relative h-full  hover:border-orange-200 duration-500  flex flex-col border-2 rounded-2xl dark:bg-gray-300 lg:p-12 p-4 border-Teal-900"
                >
                  {['Premium', 'VIP'].includes(plan.name) && (
                    <div className="absolute lg:block hidden bg-Teal-900 dark:bg-Teal-500 w-fit px-8 text-center text-xl py-2 rounded-20 text-white dark:text-black uppercase font-semibold border- top-[-5.6%] right-20 ">
                      popular
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="p-[8px] shadow-9xl bg-white dark:bg-black rounded-lg">
                      <div>
                        <ThunderIcon />
                      </div>
                    </div>
                    <div className="font-Neutra text-32 leading-4 uppercase text-orange-450 dark:text-orange-200">
                      {' '}
                      {plan.name}
                    </div>
                  </div>
                  <div className="py-0.5 px-3 bg-orange-450 dark:bg-orange-200 w-fit mt-5 rounded-full text-white dark:text-black uppercase text-xs font-medium">
                    {plan.tag}
                  </div>
                  <div className="text-[#3F3F3F] dark:text-gray-600 mt-4">{plan.description}</div>
                  <div className="mt-5 text-neutral-800 text-xl">
                    <span className="font-Neutra text-5xl font-medium text-[#00CBCB] dark:text-Teal-900">
                      {plan.price}
                    </span>
                    / Year
                  </div>
                  <Link
                    href={'/terms-and-conditions'}
                    title="Terms and Conditions"
                    className="mt-3 lg:hidden block underline font-medium leading-4 text-blue-100 text-sm"
                  >
                    Teams & Conditions
                  </Link>
                  <div className="py-10 lg:block hidden">
                    <button
                      type="button"
                      role="button"
                      onClick={handleSubscribe}
                      className="w-full group hover:bg-Teal-500 duration-500 transform leading-4 cursor-pointer uppercase bg-orange-450 dark:bg-orange-200 text-white dark:text-black justify-center text-sm font-semibold flex items-center gap-2 rounded-full px-4 py-3 "
                    >
                      subscribe
                      <div className="transform transition-all duration-300 group-hover:translate-x-2">
                        <RightArrow />
                      </div>
                    </button>
                  </div>
                  <div className="hidden lg:flex flex-col gap-3 pb-10 border-b-[#D4D4D4] dark:border-b-neutral-900 border-b-2">
                    <div className="flex items-center gap-3">
                      <div className="text-[#0D0D0D] dark:text-gray-100 text-2xl">
                        <LocationIcon className="" />
                      </div>
                      <div className="text-base  font-medium ">{plan.location}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-[#0D0D0D] dark:text-gray-100 text-2xl">
                        <PlaneUpIcon className="" />
                      </div>
                      <div className="text-base  font-medium ">{plan.flight}</div>
                    </div>
                  </div>
                  <div className="pt-10 lg:block hidden">
                    <div className="text-base font-medium text-[#0D0D0D] dark:text-white">Additional Benefits :</div>
                    <div className="flex flex-col gap-2 mt-3">
                      {plan.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <TickIcon />
                          <div className="text-sm text-[#0D0D0D] dark:text-white">{benefit}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full mt-5">
                    <button
                      type="button"
                      role="button"
                      onClick={handleSubscribe}
                      className="px-8 group text-Teal-900 dark:text-Teal-500 hover:bg-Teal-500 w-full hover:text-white dark:hover:text-black duration-500 border-Teal-500 text-base cursor-pointer py-2 rounded-full border flex items-center justify-center gap-2"
                    >
                      Plan Detail
                      <ArrowRightUpIcon className="group-hover:rotate-[45deg] duration-500" />
                    </button>
                    <button
                      type="button"
                      role="button"
                      onClick={handleSubscribe}
                      className="w-full mt-3 lg:hidden group hover:bg-Teal-500 duration-500 transform leading-4 cursor-pointer uppercase bg-orange-450 dark:bg-orange-200 text-black justify-center text-sm font-semibold flex items-center gap-2 rounded-full px-4 py-3 "
                    >
                      subscribe
                      <div className="transform transition-all duration-300 group-hover:translate-x-2">
                        <RightArrow />
                      </div>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="max-w-[90%] lg:block hidden mx-auto mt-8 md:mt-20">
        <div className="w-full justify-end flex items-end">
          <button
            type="button"
            role="button"
            onClick={handleSubscribe}
            className="px-8 uppercase hover:bg-Teal-500 group hover:text-white dark:hover:text-black duration-500 text-Teal-900 dark:text-Teal-500 border-Teal-900 dark:border-Teal-500 text-base cursor-pointer py-2 rounded-full border flex items-center justify-center gap-2"
          >
            View all
            <ArrowLeft
              width="24"
              height="24"
              className="transform rotate-[180deg] group-hover:translate-x-2 duration-500"
            />
          </button>
        </div>
      </div>
    </section>
  );
};
