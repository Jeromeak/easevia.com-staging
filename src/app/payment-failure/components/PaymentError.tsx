import { ErrorInfoIcon } from '@/icons/icon';

export const PaymentError = () => {
  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-gray-300 flex flex-col items-start gap-4 md:gap-5 self-stretch p-4 md:p-[30px] lg:p-4 lg:py-8 lg:gap-0 rounded-[20px]">
      <div className="flex justify-between w-full border-b-[#0D0D0D80] dark:border-b-[#ffffff80] pb-3 md:pb-5 border-b">
        <div className="flex flex-col">
          <div className="text-[#0D0D0D80] dark:text-[#ffffff80] text-sm md:text-base">Transaction ID</div>
          <div className="uppercase text-sm md:text-base">TXNYC6YQVX7P</div>
        </div>
        <div className="flex flex-col text-end">
          <div className="text-[#0D0D0D80] dark:text-[#ffffff80] text-sm md:text-base">Failed At</div>
          <div className="uppercase text-sm md:text-base">10:30:08 PM</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 md:justify-center md:gap-12 lg:justify-between lg:w-full lg:gap-3 xl:gap-8 items-center mt-5 md:mt-10">
        <div className="flex items-center gap-3 text-[#ACACAC] text-[16px] md:text-2xl tracking-[0.48px] leading-7">
          <ErrorInfoIcon className="w-[25px] h-[25px] md:w-auto md:h-auto" />
          PAYMENT ERROR
        </div>
        <button className="text-xs px-5 rounded-full font-medium border border-[#DD534E] dark:border-red-100 cursor-pointer py-1 bg-[#6F0D0A] dark:bg-red-50 text-white dark:text-black">
          CARD_DECLINED
        </button>
      </div>
      <div className="mt-4 md:mt-8 bg-red-200 flex flex-col items-start gap-3 md:gap-10 self-stretch p-5 md:p-4 md:py-8 w-full border-red-150 border rounded-[20px]">
        <div className="flex items-start gap-3 md:gap-5 md:justify-between w-full">
          <div className="flex-shrink-0">
            <ErrorInfoIcon className="w-[25px] h-[25px] md:w-auto md:h-auto" />
          </div>
          <div className="flex flex-col gap-2 md:gap-3 flex-1">
            <div className="text-red-150 text-xl md:text-4xl lg:text-3xl xl:text-4xl font-Neutra leading-tight md:leading-[44px] lg:leading-9 xl:leading-[44px] whitespace-nowrap overflow-hidden text-ellipsis lg:whitespace-nowrap">
              YOUR CARD WAS DECLINED
            </div>
            <div className="text-base md:text-2xl lg:text-xl xl:text-2xl leading-6 md:leading-7 lg:leading-6 xl:leading-7 text-red-150">
              Please check your card details or try a different payment method
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
