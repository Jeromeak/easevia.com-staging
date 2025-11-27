'use client';
import React from 'react';
import { ArrowLeft, CalenderIcon, CrownIcon, PlanEmailIcon, PlanPhoneIcon, ThunderIcon } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/hooks/useCheckout';
import type { SelectedPlan } from '@/context/checkout.types';

interface SubscriptionDetailProps {
  selectedPlan?: SelectedPlan | null;
  userEmail?: string;
  userPhone?: string;
}

export const SubscriptionDetail: React.FC<SubscriptionDetailProps> = ({ selectedPlan, userEmail, userPhone }) => {
  const router = useRouter();
  const { clearCheckoutData } = useCheckout();

  // Calculate renewal date (1 year from now)
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBookTicket = React.useCallback(() => {
    clearCheckoutData();
    router.push('/booking');
  }, [router, clearCheckoutData]);

  return (
    <section>
      <div className="max-w-[90%] mx-auto mb-10 md:mb-20">
        <div className="flex flex-col bg-[#FAFAFA] items-start gap-6 dark:md:gap-10 self-stretch px-4 py-6 md:px-10 md:py-10 md:gap-0 md:mb-0 mb-10 rounded-[20px] dark:bg-gray-300">
          <div className="flex items-center gap-3">
            <CrownIcon className="text-Teal-500" />
            <div className="text-[#ACACAC] text-[18px] md:text-[20px] lg:text-2xl font-bold tracking-[0.48px] leading-7">
              SUBSCRIPTION DETAILS
            </div>
          </div>
          <div className="flex justify-between w-full mt-2 md:mt-4 dark:lg:mt-8 border-b pb-3 md:pb-4 lg:pb-8 border-b-[#0D0D0D80] dark:border-b-[#ffffff80]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-[6px] md:p-[8px] shadow-9xl dark:bg-black rounded-lg">
                  <div>
                    <ThunderIcon className="w-full h-full" id="subscription-thunder-icon" />
                  </div>
                </div>
                <div className="font-Neutra text-[28px] md:text-41 leading-[32px] md:leading-[58.71px] tracking-[-0.419px] uppercase text-orange-200">
                  {selectedPlan?.title || 'Premium'}
                </div>
              </div>
              <div className="py-0.5 px-3 bg-orange-200 w-fit mt-1 rounded-full text-white dark:text-black uppercase text-xs font-medium">
                {selectedPlan?.classLabel || 'Economy Class'}
              </div>
            </div>
            <div className="flex flex-col text-right">
              <div className="font-Neutra text-[32px] md:text-50 text-Teal-500 leading-[36px] md:leading-[50px]">
                {selectedPlan?.price || '$499'}
              </div>
              <div className="text-gray-270 text-sm md:text-base">Total Amount</div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 md:gap-2 w-full md:flex-row md:justify-between md:w-full border-b dark:border-b-[#ffffff80] py-3 md:py-4 lg:py-8">
            <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-1 text-[#0D0D0D80] dark:text-[#ffffff80] text-sm md:text-base leading-[23px]">
              <div className="flex items-center gap-2 md:gap-2">
                <CalenderIcon />
                <span className="uppercase">Subscription Duration</span>
              </div>
              <span className="text-white md:text-Teal-500 md:mt-1">1 Year</span>
            </div>
            <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-1 text-[#0D0D0D80] dark:text-[#ffffff80] text-sm md:text-base leading-[23px]">
              <span className="uppercase">Renewal Date</span>
              <span className="text-neutral-50 dark:text-white md:mt-1">{formatDate(renewalDate)}</span>
            </div>
          </div>
          <div className="pt-4 md:pt-8 w-full flex  flex-col">
            <div className=" dark:text-[#ffffff80] text-base uppercase text-[#0D0D0D80] leading-[23px] pb-4">
              Account Information
            </div>
            <div className="flex items-center text-base text-neutral-50 dark:text-white gap-2">
              <PlanEmailIcon />
              <div>{userEmail || 'jameswilliam@gmail.com'}</div>
            </div>
            <div className="flex mt-2 items-center text-base text-neutral-50 dark:text-white gap-2">
              <PlanPhoneIcon />
              <div>{userPhone || '9123456789'}</div>
            </div>
          </div>
          <div className="w-full mt-5">
            <button
              type="button"
              role="button"
              onClick={handleBookTicket}
              className="flex justify-center group items-center hover:bg-Teal-600 duration-500 w-full gap-2 bg-Teal-500 rounded-full py-3 cursor-pointer text-white"
            >
              Book Ticket
              <ArrowLeft width="24" height="24" className="rotate-180 group-hover:translate-x-2 duration-500" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
