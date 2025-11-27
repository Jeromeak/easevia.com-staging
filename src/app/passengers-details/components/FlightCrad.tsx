import { EditIcon, FlightIcon } from '@/icons/icon';

export const FlightCard = () => {
  return (
    <div className="p-4 md:p-5 my-3 md:my-6 w-full rounded-xl gap-4 dark:md:border-b border-b-[#2F2F2F] bg-white dark:bg-neutral-50 flex flex-col ">
      <div className="flex flex-col gap-1">
        <div className="text-Light text-xs md:text-sm font-normal uppercase">Flight</div>
        <div className="text-neutral-50 dark:text-white text-xl font-medium">
          Passenger 1: (Adult, 18 years or older)
        </div>
        <div className="text-Light text-xs md:text-sm ">Passenger details must match your passport or photo ID</div>
      </div>
      <div className="w-full bg-[#D5E9E9] dark:bg-Teal-150 p-4 md:p-6 rounded-[8px] flex flex-col ">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-4 w-[80%]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-Teal-500 rounded-full flex justify-center items-center">
                <FlightIcon width="10" height="8" className="dark:text-black text-white" />
              </div>
              <div className="text-xl text-neutral-50 dark:text-white">James Williams</div>
            </div>
          </div>
          <div className="md:w-12 w-8 h-8 md:h-12 flex justify-center hover:bg-Teal-500 hover:text-white transition-colors duration-500  cursor-pointer items-center  border text-Teal-500 border-Teal-500 rounded-full">
            <EditIcon className="md:w-[25px]  md:h-[25px] w-[18px] h-[18px]" />
          </div>
        </div>
        <div className="flex justify-between gap-2 md:gap-5 flex-row items-start w-[70%] md:w-[60%]">
          <div className="flex flex-col">
            <div className="text-[#A4A4A4] text-sm md:text-base font-medium">Passport number</div>
            <div className="text-sm">E1234567G</div>
          </div>
          <div className="flex flex-col">
            <div className="text-[#A4A4A4] text-sm md:text-base font-medium">Passport expiry date</div>
            <div className="text-sm">15 July 2030</div>
          </div>
        </div>
      </div>
    </div>
  );
};
