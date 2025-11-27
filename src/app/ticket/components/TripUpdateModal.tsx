import { CloseIcon, DestinationIcon, FlightFrom, InfoIcon, OneWayIcon, RoundTripIcon, SwithIcon } from '@/icons/icon';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import PackSelect from '@/app/booking/components/SubscriptionPackDropdwon';
import { DestinationDropDown } from '@/app/booking/components/DestinationDropdown';
import { Button } from '@/app/authentication/components/Button';
import { PassengerSelector } from '@/app/booking/components/PassangerSelect';
import CustomDatePicker from '@/app/booking/components/DatePicker';
import type { TripUpdateModalProps } from '@/lib/types/common.types';
import { TripType } from '@/lib/types/common.types';
import { ClassData } from '@/common/components/Data';
import { useRouter } from 'next/navigation';

export const TripUpdateModal: React.FC<TripUpdateModalProps> = ({
  isOpen,
  onClose,
  children,
  initialType = TripType.ONEWAY,
  initialFrom = '',
  initialTo = '',
  initialDepartureDate = null,
  initialReturnDate = null,
}) => {
  const [, setType] = useState<TripType>(initialType);
  const [from, setFrom] = useState<string>(initialFrom);
  const [to, setTo] = useState<string>(initialTo);
  const [departureDate, setDepartureDate] = useState<string | null>(initialDepartureDate);
  const [returnDate, setReturnDate] = useState<string | null>(initialReturnDate);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TripType>(TripType.ONEWAY);

  const handleSetOneWay = useCallback(() => {
    setActiveTab(TripType.ONEWAY);
    setType(TripType.ONEWAY);
  }, []);

  const handleSetRoundTrip = useCallback(() => {
    setActiveTab(TripType.ROUND_TRIP);
    setType(TripType.ROUND_TRIP);
  }, []);

  const getButtonClass = (tab: TripType) =>
    clsx(
      'w-full gap-3 flex justify-center text-base font-medium leading-[23px] border-b-2 cursor-pointer pb-3 items-center',
      activeTab === tab ? 'text-Teal-900 border-b-Teal-900' : 'text-gray-200 border-b-transparent'
    );
  const handleSwap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const handleSubmit = useCallback(() => {
    router.push('/ticket');
  }, [router]);

  const handlePackSelect = useCallback(() => {}, []);

  const packSelectClass = useMemo(() => clsx('!w-full'), []);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[100000]">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm " aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 lg:hidden">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <DialogPanel className="h-fit w-full bg-white dark:bg-[#0D0D0D] shadow-xl flex flex-col">
              <div className="flex items-center justify-between border-b-[#262626] shadow-md p-4 dark:border-b border-gray-200">
                <div className="dark:text-white text-xl font-medium">Trip update</div>
                <button onClick={onClose} className="p-2 dark:text-gray-400 hover:text-gray-600 transition-colors">
                  <CloseIcon className="w-6 h-6 dark:text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {children || (
                  <div>
                    <div className="bg-transparent w-full ">
                      <div className="flex gap-2">
                        <div className="w-[50%]">
                          <button onClick={handleSetOneWay} className={getButtonClass(TripType.ONEWAY)}>
                            <div>
                              <OneWayIcon />
                            </div>
                            <div>One Way</div>
                          </button>
                        </div>
                        <div className="w-[50%]">
                          <button onClick={handleSetRoundTrip} className={getButtonClass(TripType.ROUND_TRIP)}>
                            <div>
                              <RoundTripIcon />
                            </div>
                            <div>Round Trip</div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-5">
                      <div className="flex justify-between flex-row items-start w-full md:mt-4 pb-5 gap-2">
                        <div className="w-1/2 flex flex-col">
                          <div className="text-gray-200 md:text-base text-sm  flex items-center gap-2 ">
                            Subscription pack
                            <span className="mt-5 md:block hidden">
                              <InfoIcon />
                            </span>
                          </div>
                          <PackSelect
                            options={ClassData}
                            mtClass={packSelectClass}
                            placeholder="Select subscription pack"
                            onChange={handlePackSelect}
                          />
                        </div>
                        <div className="w-1/2 flex flex-col ">
                          <div className="text-gray-200 ">Passengers</div>
                          <PassengerSelector MarginClass=" md:mt-4 mt-0" />
                        </div>
                      </div>
                      <div className="border-neutral-400 border rounded-xl p-6 lg:p-4 flex flex-col ">
                        <div className="text-[#8E8E8E] lg:text-lg text-sm font-normal leading-[21px]">
                          Origin and Destination
                        </div>
                        <div className="flex justify-between items-center gap-4 relative mt-2">
                          <div className="w-[45%]">
                            <DestinationDropDown
                              icon={FlightFrom}
                              value={from}
                              WidthClass="!w-[300px] !top-9"
                              onChange={setFrom}
                              preventList={[to]}
                            />
                          </div>
                          <div onClick={handleSwap} className={''}>
                            <SwithIcon className="rotate-90 transform" />
                          </div>
                          <div className="w-[45%]">
                            <DestinationDropDown
                              icon={DestinationIcon}
                              value={to}
                              WidthClass="!w-[300px] !top-9 !right-[-15px]"
                              onChange={setTo}
                              preventList={[from]}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-3 md:gap-0  mt-5 dark:border-b-neutral-400 border-Teal-300 border-b pb-5">
                        <div className="md:w-[40%] w-full flex flex-col">
                          <div className="text-gray-200">Departure Date</div>
                          <div>
                            <CustomDatePicker value={departureDate} onChange={setDepartureDate} />
                          </div>
                        </div>
                        {activeTab === TripType.ROUND_TRIP && (
                          <div className="flex  w-full md:w-[40%] flex-col">
                            <div className="text-gray-200">Return Date</div>
                            <div>
                              <CustomDatePicker value={returnDate} onChange={setReturnDate} />
                            </div>
                          </div>
                        )}
                        <div className="lg:flex hidden w-full md:w-[20%] flex-col">
                          <div className="text-gray-200">Round Trip</div>
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <Button
                          onClick={onClose}
                          className="!bg-transparent !text-Teal-500 !border !border-Teal-500"
                          label="CANCEL"
                        />
                        <Button onClick={handleSubmit} className="" label="UPDATE" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
