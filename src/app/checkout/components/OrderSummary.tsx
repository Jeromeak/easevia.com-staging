'use client';
import { ThunderIcon } from '@/icons/icon';
import { useCheckout } from '@/context/hooks/useCheckout';

export const OrderSummary = () => {
  const { state } = useCheckout();
  const { selectedPlan } = state;

  if (!selectedPlan) {
    return (
      <div className="flex flex-col">
        <div className="text-32 text-semibold tracking-[-0.96px] border-b pb-3 border-b-gray-250 uppercase text-white font-Neutra">
          Order Summary
        </div>
        <div className="mt-8 text-gray-270 text-base">No plan selected</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="text-32 text-semibold tracking-[-0.96px] border-b pb-3 border-b-gray-250 uppercase text-neutral-50 dark:text-white font-Neutra">
        Order Summary
      </div>
      <div className="flex items-center gap-3 mt-8">
        <div className="p-[8px] shadow-9xl dark:bg-black rounded-lg">
          <div>
            <ThunderIcon id="thunder-icon" />
          </div>
        </div>
        <div className="font-Neutra text-41 leading-[58.71px] tracking-[-0.419px] uppercase text-orange-200">
          {selectedPlan.title}
        </div>
      </div>
      <div className="py-0.5 px-3 bg-orange-200 w-fit mt-2 rounded-full text-white dark:text-black uppercase text-xs font-medium">
        {selectedPlan.classLabel}
      </div>
      <div className="flex flex-col ">
        <div className="dark:text-gray-270 text-base font-medium leading-normal uppercase mt-8">Subscription plan</div>
        <div className=" text-neutral-800 text-xl">
          <span className="font-Neutra text-5xl  text-Teal-900">{selectedPlan.price}</span>/ 1 Year
        </div>
      </div>
      <div className="flex justify-between items-start mt-5 md:mt-10 border-b border-b-[#0D0D0D80] dark:border-b-gray-290 pb-8">
        <div className="flex flex-col">
          <div className="text-base font-medium leading-5 uppercase">Platform basic</div>
          <div className="text-base text-[#0D0D0D80] dark:text-gray-290 leading-5 font-medium mt-1 uppercase">
            Billed yearly
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-base font-medium leading-5">{selectedPlan.price}</div>
          <div className="text-[#0D0D0D80] dark:text-gray-290">Excl. 5% VAT</div>
        </div>
      </div>
      <div className="flex flex-col border-b border-b-gray-290" />
      <div className="flex justify-between items-start mt-5 md:mt-10">
        <div className="text-base font-medium leading-5 uppercase">Total</div>
        <div className="text-base font-medium leading-5 text-neutral-50 dark:text-white">{selectedPlan.price}</div>
      </div>
    </div>
  );
};
