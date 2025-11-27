'use client';
import { ArrowLeft, HomeIcon, RetryIcon, SettingsIcon } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import clsx from 'clsx';

export const ContinueOptions = () => {
  const router = useRouter();

  const handleRetryPayment = useCallback(() => {}, []);

  const handleManagePlan = useCallback(() => {}, []);

  const handleReturnDashboard = useCallback(() => {}, []);

  const handleBackToCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-gray-300 rounded-[20px] p-4 md:p-8">
      <div className="text-gray-250 text-lg md:text-xl lg:text-2xl uppercase tracking-[0.48px] leading-7 md:text-center lg:text-left whitespace-nowrap overflow-hidden text-ellipsis">
        WHAT WOULD YOU LIKE TO DO?
      </div>
      <p
        className={clsx(
          'text-gray-250 mt-1 text-sm md:text-base lg:text-2xl tracking-[0.48px] leading-7 md:text-center lg:text-left'
        )}
      >
        Choose an option below to continue
      </p>

      <div className={clsx('w-full py-4 md:py-8 border-b border-b-gray-290')}>
        <button
          type="button"
          role="button"
          className="flex Teal justify-center text-white items-center duration-500 w-full gap-2 bg-Teal-500 rounded-full py-3 cursor-pointer text-sm md:text-base"
          onClick={handleRetryPayment}
        >
          <RetryIcon />
          Retry Payment
        </button>
      </div>
      <div className={clsx('w-full flex flex-col gap-3 md:gap-5 py-4 md:py-8')}>
        <button
          type="button"
          role="button"
          className={clsx(
            'flex TealTransparent justify-center text-Teal-500 border-[1.5px] border-Teal-500 items-center duration-500 w-full gap-2 bg-transparent rounded-full py-3 cursor-pointer text-sm md:text-base'
          )}
          onClick={handleManagePlan}
        >
          <SettingsIcon />
          Manage Plan Option
        </button>
        <button
          type="button"
          role="button"
          className={clsx(
            'flex justify-center TealTransparent text-Teal-500 border-[1.5px] border-Teal-500 items-center duration-500 w-full gap-2 bg-transparent rounded-full py-3 cursor-pointer text-sm md:text-base'
          )}
          onClick={handleReturnDashboard}
        >
          <HomeIcon />
          Return to Dashboard
        </button>
      </div>
      <div
        onClick={handleBackToCheckout}
        className={clsx(
          'w-full flex justify-center text-sm md:text-base mt-5 hover:text-Teal-500 duration-500 md:mt-10 text-[#737373] cursor-pointer items-center gap-2'
        )}
      >
        <ArrowLeft width="24" height="24" />
        Back to Checkout
      </div>
    </div>
  );
};
