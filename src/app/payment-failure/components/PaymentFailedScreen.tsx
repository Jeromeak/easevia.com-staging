import { OrderSummary } from '@/app/checkout/components/OrderSummary';
import { AccountInfo } from './AccountInfo';
import { PaymentError } from './PaymentError';
import { ContinueOptions } from './ContinueOptions';
import clsx from 'clsx';

export const PaymentFailedScreen = () => {
  return (
    <section className="mt-30 md:mt-40">
      <div className="max-w-[90%] mx-auto  pb-10 md:pb-30">
        <div className="flex justify-between flex-wrap items-start w-full gap-8 md:gap-12">
          <div className="w-full lg:w-[calc(50%_-_24px)] flex flex-col gap-10 dark:md:gap-30 lg:p-6 xl:p-14">
            <OrderSummary />
            <AccountInfo />
          </div>
          <div className={clsx('w-full lg:w-[calc(50%_-_24px)] gap-5 md:gap-10 flex flex-col')}>
            <PaymentError />
            <ContinueOptions />
          </div>
        </div>
      </div>
    </section>
  );
};
