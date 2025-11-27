'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ArrowLeft } from '@/icons/icon';
import type { HeroBannerProps } from '@/lib/types/common.types';

export const HeroBanner: React.FC<HeroBannerProps> = ({ stepText }) => {
  const router = useRouter();

  const handleCancel = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/plans');
    }
  }, [router]);

  return (
    <section>
      <div className="max-w-[90%] xl:max-w-[85%] mx-auto mt-30 lg:mt-20 lg:py-30">
        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-end">
          <div className="flex flex-col">
            <div className="text-neutral-50 dark:text-white text-base md:text-xl lg:text-2xl uppercase tracking-[1.44px] leading-[33.6px]">
              Payment Detail
            </div>
            <div className="font-Neutra uppercase text-5xl md:text-90 md:leading-22.5 text-Teal-500">Checkout</div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 text-neutral-50 dark:text-white hover:text-Teal-500 dark:hover:text-Teal-500 transition-colors duration-300 cursor-pointer uppercase text-sm md:text-base tracking-[1.44px]"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              Cancel
            </button>
            <div className="text-base md:text-xl lg:text-2xl uppercase tracking-[1.44px] leading-[33.6px] text-neutral-400 dark:text-white self-end md:self-auto">
              {stepText}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
