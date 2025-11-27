import { PaymentSuccessIcon, PaymentSuccessIconLight } from '@/icons/icon';

interface SuccessBannerProps {
  transactionId?: string;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ transactionId }) => {
  return (
    <section>
      <div className="max-w-[90%] mx-auto mt-28 md:mt-10 pb-5 md:pb-5 md:py-30">
        <div className="w-full  flex flex-col justify-center items-center ">
          <div className="dark:block hidden">
            <PaymentSuccessIcon className="md:w-[250px] md:h-[200px] h-[100px] w-[100px]" />
          </div>
          <div className="dark:hidden block">
            <PaymentSuccessIconLight className="md:w-[250px] md:h-[200px] h-[100px] w-[100px]" />
          </div>
          <div className="font-Neutra text-[36px] md:text-5xl uppercase  tracking-[0.96px] text-neutral-50 dark:text-white mt-5 text-center md:text-left">
            Payment Successful
          </div>
          <p className="text-center mt-3 md:mt-6 text-xl md:text-2xl tracking-[0.48px] md:leading-7 text-gray-250">
            Your payment was successful! You can now continue using application.
          </p>
          <div className="flex flex-col items-start self-stretch rounded-[12px] bg-[#FAFAFA] dark:bg-[#151515] p-5 md:py-3 md:px-5  w-full mt-3 md:mt-5 md:rounded-[20px] md:flex-row justify-between md:items-center">
            <div className="text-[#ACACAC] text-base md:text-2xl tracking-[0.48px] leading-7">Transaction ID</div>
            <div className="text-[#ACACAC] text-base md:text-2xl tracking-[0.48px] leading-7">
              {transactionId ? (
                <span className="text-white font-mono">{transactionId}</span>
              ) : (
                <span className="text-gray-400">Loading transaction ID...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
