import { SuccessIcon } from '@/icons/icon';

const HeroBanner = () => {
  return (
    <section>
      <div className="max-w-[90%] mx-auto pt-30">
        <div className="flex  justify-center items-center w-full flex-col">
          <div className="w-20 h-20 flex justify-center items-center bg-Teal-900/20 dark:bg-Teal-150 rounded-full">
            <SuccessIcon />
          </div>
          <div className="text-32 leading-10 md:text-5xl uppercase text-neutral-50 dark:text-white font-Neutra mt-4 text-center   md:mt-8">
            Your booking
            <br className="block md:hidden" /> Successfully Confirmed
          </div>
          <div className="text-[#A3A3A3] text-base md:text-2xl mt-2 md:mt-4 text-center ">
            Your ticket has been sent to your registered email address
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
