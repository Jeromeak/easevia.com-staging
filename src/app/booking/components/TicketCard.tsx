import { PlaneIcon, ScannerIcon, SingaporeAirlineLogo } from '@/icons/icon';
import { useMemo } from 'react';
import clsx from 'clsx';
import type { TicketCardProps } from '@/lib/types/common.types';

export const TicketCard: React.FC<TicketCardProps> = ({
  fromCity,
  fromCode,
  fromTime,
  toCity,
  toCode,
  toTime,
  date,
  duration,
  seatType,
  classType,
  className,
}) => {
  const fromSection = useMemo(
    () => (
      <div className="w-[calc(30%_-_4px)]  flex text-center md:text-left flex-col gap-1.5">
        <div className="text-xs lg:text-xl text-neutral-700 font-medium">
          {fromCity}, {fromCode}
        </div>
        <div className="uppercase text-sm lg:text-25 text-neutral-50 dark:text-white font-semibold lg:leading-[37.5px]">
          {fromCode}
        </div>
        <div className="text-xs lg:text-xl text-neutral-700 font-medium">{fromTime}</div>
      </div>
    ),
    [fromCity, fromCode, fromTime]
  );

  const middleSection = useMemo(
    () => (
      <div className="w-[calc(40%_-_4px)]  text-center flex flex-col gap-2 lg:gap-3">
        <div className="text-xs lg:text-xl text-neutral-50 dark:text-white font-medium leading-6">{date}</div>
        <div className="flex items-center justify-between relative">
          <div className="w-[75%] border border-dashed border-gray-500 absolute -translate-x-1/2 left-1/2" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[-5px] lg:top-[-22%]">
            <PlaneIcon className="text-orange-450 dark:text-orange-200 lg:w-[43px] lg:h-[43px] w-[28px] h-[28px]" />
          </div>
          <div className="lg:w-6 w-3 h-3 lg:h-6 border-gray-500 border-2 rounded-full" />
          <div className="lg:w-6 w-3 h-3 lg:h-6 border-gray-500 border-2 rounded-full" />
        </div>
        <div className="text-xs lg:text-xl text-neutral-50 dark:text-white font-medium">{duration}</div>
      </div>
    ),
    [date, duration]
  );

  const toSection = useMemo(
    () => (
      <div className="w-[calc(30%_-_4px)]  flex flex-col text-center md:text-end gap-1.5">
        <div className=" text-xs lg:text-xl text-neutral-700 font-medium truncate">
          {toCity}, {toCode}
        </div>
        <div className="uppercase text-sm lg:text-25 text-neutral-50 dark:text-white font-semibold lg:leading-[37.5px]">
          {toCode}
        </div>
        <div className="text-xs lg:text-xl text-neutral-700 font-medium">{toTime}</div>
      </div>
    ),
    [toCity, toCode, toTime]
  );

  const ticketFooter = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <ScannerIcon className="w-[28px] h-[28px] lg:w-[40px] md:h-[41px]" />
          </div>
          <div className="flex flex-col">
            <div className="lg:text-32 text-base lg:leading-[32px] font-Neutra uppercase text-orange-450 dark:text-orange-200">
              {seatType || 'Premium'}
            </div>
            <div className="text-[8px] lg:text-xs text-neutral-700 uppercase">{classType || 'Economy Class'}</div>
          </div>
        </div>
        <div>
          <SingaporeAirlineLogo className="lg:w-[159px] lg:h-[89px] w-[100px] h-[55px]" />
        </div>
      </div>
    ),
    [seatType, classType]
  );

  const cardClass = useMemo(
    () =>
      clsx(
        'w-full flex flex-col justify-between gap-5 lg:gap-20 dark:xl:shadow-14xl overflow-hidden relative bg-blue-150 dark:bg-gray-300 md:px-8 p-4 md:py-8 rounded-[18px]'
      ),
    []
  );

  return (
    <div className={clsx('w-full flex justify-between items-center overflow-hidden', className)}>
      <div className={cardClass}>
        <div className="lg:w-10 w-4 h-4 rounded-full lg:h-10 absolute top-[50%] lg:top-[60%] left-[-2%] z-10 bg-white dark:bg-black" />
        <div className="border border-dashed border-[#767676] w-full translate-x-1/2 right-1/2 transform absolute top-[56%] lg:top-[66%]" />
        <div className="lg:w-10 rounded-full w-4 h-4 lg:h-10 absolute top-[50%] lg:top-[60%] z-10 right-[-2%] bg-white dark:bg-black" />
        <div className="flex justify-between gap-2 flex-row">
          {fromSection}
          {middleSection}
          {toSection}
        </div>
        {ticketFooter}
      </div>
    </div>
  );
};
