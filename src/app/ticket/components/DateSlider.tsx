'use client';
import React, { useCallback, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { SwiperClass } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowDown } from '@/icons/icon';
import clsx from 'clsx';

const generateDates = (count = 30) => {
  const dates = [];

  for (let i = 0; i < count; i++) {
    dates.push(dayjs().add(i, 'day'));
  }

  return dates;
};

interface DateSliderProps {
  selectedDate?: string; // ISO date string (YYYY-MM-DD)
  onDateSelect?: (date: string) => void; // Callback when date is selected
}

export const DateSlider: React.FC<DateSliderProps> = ({ selectedDate, onDateSelect }) => {
  const dates = React.useMemo(() => generateDates(), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDateIndex, setActiveDateIndex] = useState(0);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex);
  }, []);

  const handleDateClick = useCallback(
    (index: number) => {
      setActiveDateIndex(index);

      // Get the selected date and format it as YYYY-MM-DD
      const selectedDateObj = dates[index];
      const formattedDate = selectedDateObj.format('YYYY-MM-DD');

      // Call the callback with the formatted date
      onDateSelect?.(formattedDate);
    },
    [dates, onDateSelect]
  );

  // Initialize active date index based on selectedDate prop
  useEffect(() => {
    if (selectedDate) {
      const selectedDateObj = dayjs(selectedDate);

      const index = dates.findIndex((date) => date.isSame(selectedDateObj, 'day'));

      if (index !== -1) {
        setActiveDateIndex(index);
      }
    }
  }, [selectedDate, dates]);

  const createDateClickHandler = useCallback((index: number) => () => handleDateClick(index), [handleDateClick]);

  return (
    <div className="mt-5 dark:max-w-full xl:max-w-[85%] max-w-[90%] mx-auto lg:mt-10 lg:border-t-2 lg:border-b border-neutral-50/10 dark:border-gray-150 lg:py-8">
      <div className="relative max-w-full pb-5 md:pb-0 lg:px-16">
        <Swiper
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 2.5 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
            1200: { slidesPerView: 8 },
          }}
          spaceBetween={12}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          speed={800}
          onSlideChange={handleSlideChange}
        >
          {dates.map((date, index) => (
            <SwiperSlide key={index}>
              <button
                className={clsx(
                  'w-full px-4 py-[14px] border duration-500 cursor-pointer text-sm dark:text-white',
                  activeDateIndex === index
                    ? 'bg-[#D5E9E9] dark:!bg-Teal-150 border-Teal-900 dark:border-Teal-500 text-Teal-900 dark:text-Teal-500'
                    : 'border-neutral-50/10 dark:border-gray-150 text-neutral-50',
                  'dark:hover:bg-Teal-150 hover:border-Teal-500 hover:text-Teal-500'
                )}
                onClick={createDateClickHandler(index)}
              >
                {date.format('ddd, D MMM')}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className={clsx(
            'swiper-button-prev-custom absolute hidden lg:block left-0 top-1/2 -translate-y-1/2 z-10 text-white px-2',
            activeIndex === 0 && 'opacity-50 cursor-not-allowed'
          )}
          disabled={activeIndex === 0}
        >
          <div className="w-10 h-10 rounded-full dark:hover:bg-Teal-150 duration-500 hover:border-Teal-500 cursor-pointer bg-white dark:bg-neutral-50 flex justify-center items-center border border-neutral-50/10 dark:border-gray-150">
            <ArrowDown className="text-[#28272D] dark:text-gray-50 rotate-90" />
          </div>
        </button>
        <button className="swiper-button-next-custom hidden lg:block  absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 z-10 text-white px-2">
          <div className="w-10 h-10 rounded-full dark:hover:bg-Teal-150 duration-500 hover:border-Teal-500 bg-white dark:bg-neutral-50 flex justify-center items-center border border-neutral-50/10 dark:border-gray-150">
            <ArrowDown className="text-[#28272D] dark:text-gray-50 -rotate-90" />
          </div>
        </button>
      </div>
    </div>
  );
};
