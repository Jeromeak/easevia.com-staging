'use client';
import { ArrowLeft, FailedIcon } from '@/icons/icon';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const HeroBanner = () => {
  const router = useRouter();
  const handleBack = useCallback(() => {
    router.push('/booking');
  }, [router]);

  return (
    <section>
      <div className="max-w-[85%] mx-auto pt-30">
        <div className="flex justify-center items-center w-full flex-col">
          <div className="w-20 h-20 flex justify-center items-center bg-red-250 rounded-full">
            <FailedIcon />
          </div>
          <div className="text-[32px] md:text-5xl uppercase text-red-100 font-Neutra mt-4 md:mt-8 text-center">
            BOOKING FAILED
          </div>
          <div className="text-[#A3A3A3] text-base font-normal md:text-2xl md:mt-4 text-center">
            We were unable to process your booking process.
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="px-8 py-3 orangeTransparent h-fit rounded-full w-fit cursor-pointer uppercase text-base bg-transparent border border-orange-200 text-orange-200 flex items-center gap-2"
              onClick={handleBack}
            >
              <ArrowLeft width="24" height="24" className="transform" />
              Back to Booking
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
