import { PaymentProcess } from './PaymentProcess';
import React from 'react';
import { OrderSummary } from './OrderSummary';
import { BillingAddress } from './BillingAddress';
import type { PaymentProps } from '@/lib/types/common.types';

export const Payment: React.FC<PaymentProps> = ({ isSubmitted, setIsSubmitted }) => {
  return (
    <section>
      <div className="max-w-[90%] xl:max-w-[85%] mx-auto pb-0 md:pb-10 lg:pb-30">
        <div className="flex justify-between flex-wrap items-start w-full gap-12">
          <div className="w-full lg:w-[calc(50%_-_24px)] flex flex-col gap-10 md:gap-30 lg:p-6 xl:p-14">
            <OrderSummary />
            <BillingAddress />
          </div>
          <div className="w-full lg:w-[calc(50%_-_24px)]">
            <div className="md:max-w-none max-w-[calc(100vw)] -mx-[calc((100vw-100%)/2)] md:mx-0">
              <PaymentProcess isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
