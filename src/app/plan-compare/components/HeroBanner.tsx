'use client';

import { ArrowLeft } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const HeroBanner = () => {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  return (
    <section>
      <div className="max-w-[90%] mx-auto mt-16 lg:mt-20 md:pb-6 pt-10 pb-6 lg:py-20">
        <div onClick={handleGoBack} className="flex items-center cursor-pointer w-fit">
          <ArrowLeft className="w-6 h-6 md:w-12 md:h-12 opacity-80 md:opacity-100" />
          <div className="text-sm md:text-2xl font-normal font-Futra text-black dark:text-white/90 dark:md:text-white uppercase md:leading-[24px] md:ml-2">
            subscription plans
          </div>
        </div>
        <div className="flex flex-col mt-5 lg:mt-10">
          <div className="text-base md:text-2xl text-orange-200 uppercase tracking-[1.44px]">
            Check your affordable plane
          </div>
          <div className="text-Teal-500 font-Neutra lg:text-90 uppercase text-5xl md:leading-[90px] mt-0 md:mt-[-20px] lg:mt-0">
            Plan Compare
          </div>
        </div>
      </div>
    </section>
  );
};
