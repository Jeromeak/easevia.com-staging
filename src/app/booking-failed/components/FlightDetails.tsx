'use client';
import { EmailBookingIcon, MessageIcon, PhoneBookingIcon } from '@/icons/icon';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';

export const FlightDetails = () => {
  const flightDetails = useMemo(
    () => [
      { label: 'Flight', value: 'CV 245' },
      { label: 'Route', value: 'New York (JFK) - London (LHR)' },
      { label: 'Date', value: 'July 25, 2025' },
      { label: 'Time', value: '14:30 - 02:45 +1' },
    ],
    []
  );

  const renderFlightDetail = useCallback(
    (item: { label: string; value: string }) => (
      <div
        className={clsx('flex w-full justify-between text-[15px] font-normal leading-5.5 font-Futra')}
        key={item.label}
      >
        <div className={clsx('w-[30%] md:w-[50%] text-neutral-50/50 dark:text-gray-290 uppercase')}>{item.label}</div>
        <div className={clsx('w-[70%] md:w-[50%] uppercase text-Light')}>{item.value}</div>
      </div>
    ),
    []
  );

  const handleContactSupport = useCallback(() => {}, []);

  return (
    <section>
      <div className="max-w-[90%] mx-auto lg:py-30 py-10 md:py-15 xl:pt-15">
        <div className="lg:w-[70%] xl:w-[40%] mx-auto ">
          <div className="flex flex-col w-full pb-3 md:pb-8">
            <div className="w-full rounded-xl md:rounded-[20px] bg-white dark:bg-gray-300 p-5 md:p-7.5 flex flex-col">
              <div className="text-base leading-5 text-neutral-300 dark:text-Teal-500 dark:lg:text-neutral-300">
                Attempted Flight Details
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-[80%] mt-8">{flightDetails.map(renderFlightDetail)}</div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="w-full rounded-[20px] bg-white dark:bg-gray-300 p-5 md:p-7.5 flex flex-col">
              <div className="text-base leading-5 text-Teal-900 dark:text-Teal-500">Need Help?</div>
              <button
                type="button"
                className="bg-Teal-900 dark:bg-Teal-500 Teal flex text-white dark:text-white leading-5 text-base cursor-pointer justify-center items-center gap-2 py-1.5 md:py-3 px-8 rounded-full mt-4"
                onClick={handleContactSupport}
              >
                <MessageIcon />
                Contact Support
              </button>
              <div className="flex gap-5 items-center w-full mt-5">
                <div>
                  <PhoneBookingIcon className="text-Teal-900 dark:text-Teal-500" />
                </div>
                <div className="flex flex-col">
                  <div className="text-[#4D4D51] text-sm">Call us:</div>
                  <div className="text-[10px] md:text-sm uppercase font-medium text-neutral-50 dark:text-white">
                    +1 (800) 123-4567
                  </div>
                </div>
              </div>
              <div className="flex gap-5 items-center w-full mt-5">
                <div>
                  <EmailBookingIcon className="text-Teal-900 dark:text-Teal-500" />
                </div>
                <div className="flex flex-col">
                  <div className="text-[#4D4D51] text-sm">Email:</div>
                  <div className="text-[10px] md:text-sm uppercase font-medium text-neutral-50 dark:text-white">
                    support@easevia.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
