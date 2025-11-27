'use client';

import { CloseIcon, PlaneIcon, SingaporeAirlineIcon } from '@/icons/icon';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import Link from 'next/link';
import React, { Fragment, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import type { SelectedFlightData } from '@/lib/types/sessionStorage';
import { extractFlightData } from '@/utils/flightUtils';

interface ViewSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnableConfirm: (enabled: boolean) => void;
  selectedFlightData?: SelectedFlightData | null;
}

export const ViewSummaryModal: React.FC<ViewSummaryModalProps> = ({
  isOpen,
  onClose,
  onEnableConfirm,
  selectedFlightData,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Format time from ISO string to readable format using moment.js
  const formatTime = (isoString: string) => {
    return moment(isoString).format('HH:mm');
  };

  // Format date from ISO string to "DD MMM" format using moment.js
  const formatDate = (isoString: string) => {
    return moment(isoString).format('DD MMM');
  };

  // Transform selected flight data to the format expected by the modal
  const flightSummaryData = useMemo(() => {
    if (!selectedFlightData) {
      // Fallback to static data if no flight data is available
      return [
        {
          departureDate: '18 Apr',
          arrivalDate: '19 Apr',
          departureTime: '06:45',
          arrivalTime: '10:00',
          from: { city: 'Singapore', code: 'SIN' },
          to: { city: 'Tokyo', code: 'TYO' },
          duration: '1h 50min',
          isDirect: true,
          stops: 0,
          stopAirports: [],
        },
      ];
    }

    const flights = [];

    // For one-way trips
    if (selectedFlightData.selectedFlight) {
      const flightInfo = extractFlightData(selectedFlightData.selectedFlight);
      flights.push({
        departureDate: formatDate(flightInfo.departure_time),
        arrivalDate: formatDate(flightInfo.arrival_time),
        departureTime: formatTime(flightInfo.departure_time),
        arrivalTime: formatTime(flightInfo.arrival_time),
        from: {
          city: flightInfo.departure_airport,
          code: flightInfo.departure_airport,
        },
        to: {
          city: flightInfo.arrival_airport,
          code: flightInfo.arrival_airport,
        },
        duration: flightInfo.duration,
        isDirect: flightInfo.isDirect,
        stops: flightInfo.stops,
        stopAirports: flightInfo.stopAirports,
      });
    }

    // For round trips - outbound flight
    if (selectedFlightData.selectedOutboundFlight) {
      const flightInfo = extractFlightData(selectedFlightData.selectedOutboundFlight);
      flights.push({
        departureDate: formatDate(flightInfo.departure_time),
        arrivalDate: formatDate(flightInfo.arrival_time),
        departureTime: formatTime(flightInfo.departure_time),
        arrivalTime: formatTime(flightInfo.arrival_time),
        from: {
          city: flightInfo.departure_airport,
          code: flightInfo.departure_airport,
        },
        to: {
          city: flightInfo.arrival_airport,
          code: flightInfo.arrival_airport,
        },
        duration: flightInfo.duration,
        isDirect: flightInfo.isDirect,
        stops: flightInfo.stops,
        stopAirports: flightInfo.stopAirports,
      });
    }

    // For round trips - return flight
    if (selectedFlightData.selectedReturnFlight) {
      const flightInfo = extractFlightData(selectedFlightData.selectedReturnFlight);
      flights.push({
        departureDate: formatDate(flightInfo.departure_time),
        arrivalDate: formatDate(flightInfo.arrival_time),
        departureTime: formatTime(flightInfo.departure_time),
        arrivalTime: formatTime(flightInfo.arrival_time),
        from: {
          city: flightInfo.departure_airport,
          code: flightInfo.departure_airport,
        },
        to: {
          city: flightInfo.arrival_airport,
          code: flightInfo.arrival_airport,
        },
        duration: flightInfo.duration,
        isDirect: flightInfo.isDirect,
        stops: flightInfo.stops,
        stopAirports: flightInfo.stopAirports,
      });
    }

    return flights;
  }, [selectedFlightData]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedFlightData) return 593.6; // Fallback price

    // Since the new API structure doesn't include price in flight data,
    // we'll use a fallback price for now
    let total = 0;

    if (selectedFlightData.selectedFlight) {
      total += 450; // Fallback price for one-way flight
    }

    if (selectedFlightData.selectedOutboundFlight) {
      total += 450; // Fallback price for outbound flight
    }

    if (selectedFlightData.selectedReturnFlight) {
      total += 450; // Fallback price for return flight
    }

    return total || 593.6; // Fallback if no flights found
  }, [selectedFlightData]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    onEnableConfirm(isBottom);
  }, [onEnableConfirm]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useLayoutEffect(() => {
    const el = scrollRef.current;

    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className={clsx('relative z-[10000]')}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={clsx('fixed inset-0 bg-black/40 backdrop-blur-sm')} aria-hidden="true" />
        </TransitionChild>

        <div className={clsx('fixed inset-0 flex items-center justify-center lg:px-4')}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel
              className={clsx(
                'xl:w-[80%] lg:w-full text-black h-screen lg:h-[80vh] lg:rounded-lg overflow-hidden relative bg-[#f5f5f5] flex flex-col shadow-12xl'
              )}
            >
              <div className={clsx('bg-white p-5 sticky top-0 flex justify-between')}>
                <div className={clsx('text-secondary text-2xl')}>Your Trip Summary</div>
                <div onClick={handleClose}>
                  <CloseIcon className={clsx('text-black cursor-pointer')} />
                </div>
              </div>
              <div ref={scrollRef} className="p-3 md:p-5 flex-1 w-full overflow-y-scroll scroll">
                <div className="flex justify-between items-center w-full">
                  <div className="text-secondary text-32 font-medium">Itinerary</div>
                  <div className="text-secondary text-xl font-medium">
                    <span className="text-Light">USD</span> {totalPrice.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden my-10 bg-white rounded-3xl">
                  <div className="border-b border-b-[#F2F2F2]">
                    <div className="flex justify-between flex-wrap items-start xl:items-center p-6">
                      <div className="flex items-center text-center justify-center gap-5 md:w-fit w-full">
                        <div className="text-secondary text-base font-medium">Flights</div>
                        <div className="text-Light underline text-base font-medium">All flight details</div>
                      </div>
                      <div className="flex flex-col text-center md:justify-end md:!text-end">
                        <div className="text-secondary text-base font-medium">
                          <span className="text-Light">USD</span> {totalPrice.toFixed(2)}
                        </div>
                        <div className="text-Light underline text-base font-medium">
                          For{' '}
                          {(() => {
                            const adult = selectedFlightData?.searchParams?.adult || 1;
                            const child = selectedFlightData?.searchParams?.child || 0;
                            const infant = selectedFlightData?.searchParams?.infant || 0;

                            const total = adult + child + infant;

                            return total;
                          })()}{' '}
                          passenger
                          {(() => {
                            const adult = selectedFlightData?.searchParams?.adult || 1;
                            const child = selectedFlightData?.searchParams?.child || 0;
                            const infant = selectedFlightData?.searchParams?.infant || 0;

                            const total = adult + child + infant;

                            return total !== 1 ? 's' : '';
                          })()}{' '}
                          - Inclusive of airfare, taxes, fees, and carrier-imposed charges
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:p-8 p-4 overflow-hidden flex flex-col gap-5 md:gap-10">
                    {flightSummaryData.map((summary, index) => (
                      <div key={index} className="flex flex-col border border-[#f1f1f1] rounded-3xl">
                        <div className="flex justify-between flex-wrap items-center w-full md:px-8 px-4 py-4 md:py-8">
                          <div className="w-full lg:w-[45%]">
                            <div className="flex flex-col items-center">
                              <div className="flex justify-between w-full items-center">
                                <div className="text-Light text-sm">{summary.departureDate}</div>
                                <div className="text-Light text-sm">{summary.arrivalDate}</div>
                              </div>
                              <div className={clsx('flex justify-between items-center w-full')}>
                                <div className={clsx('text-xl md:text-3xl text-black')}>{summary.departureTime}</div>
                                <div
                                  className={clsx(
                                    'w-[55%] md:w-[calc(65%_-_8px)] flex justify-between gap-2 items-center'
                                  )}
                                >
                                  <div
                                    className={clsx(
                                      'border w-[calc(50%_-_4px)] relative border-[#94A3B8] border-dashed'
                                    )}
                                  />
                                  <div className={clsx('flex justify-center ml-2')}>
                                    <PlaneIcon width="40" height="40" className={clsx('text-[#94A3B8]')} />
                                  </div>
                                  <div
                                    className={clsx(
                                      'border w-[calc(50%_-_4px)] border-dashed border-[#94A3B8] relative'
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        'w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-[#94A3B8] absolute top-1/2 -translate-y-1/2 right-[-6px]'
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className={clsx('text-xl md:text-3xl text-black font-[450]')}>
                                  {summary.arrivalTime}
                                </div>
                              </div>
                              <div className={clsx('flex justify-between w-full items-center')}>
                                <div className={clsx('text-Light text-sm')}>
                                  {summary.from.city}, {summary.from.code}
                                </div>
                                <div className={clsx('text-Light text-xs md:text-sm flex items-center gap-2')}>
                                  <div>{summary.duration}</div>
                                  <div className="w-1 h-1 rounded-full bg-[#A3A3A3]" />
                                  <div>{summary.isDirect ? 'Direct Flight' : 'Non-direct Flight'}</div>
                                </div>
                                <div className={clsx('text-Light text-xs md:text-sm')}>
                                  {summary.to.city}, {summary.to.code}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-Teal-500 text-2xl font-medium">
                            {(() => {
                              const flight =
                                selectedFlightData?.selectedFlight || selectedFlightData?.selectedOutboundFlight;

                              const flightData = flight ? extractFlightData(flight) : null;

                              return flightData?.travelClass || 'Premium Economy';
                            })()}
                          </div>
                        </div>
                        <div className={clsx('w-full py-2 md:py-5 border-y border-y-Light border-dashed px-5 md:px-8')}>
                          <div className={clsx('flex items-center gap-3')}>
                            <SingaporeAirlineIcon width="20" height="28" />
                            <div className="text-Light uppercase text-sm">
                              {(() => {
                                const flight =
                                  selectedFlightData?.selectedFlight ||
                                  selectedFlightData?.selectedOutboundFlight ||
                                  selectedFlightData?.selectedReturnFlight;

                                const flightData = flight ? extractFlightData(flight) : null;

                                return flightData?.airline || 'Singapore Airline';
                              })()}
                            </div>
                          </div>
                        </div>
                        <div
                          className={clsx(
                            'py-3 md:py-10 flex flex-wrap justify-between gap-3 md:gap-5 items-start px-4 md:px-8'
                          )}
                        >
                          <div className={clsx('flex flex-col w-full lg:w-[calc(25%_-_15px)] font-futura')}>
                            <div className={clsx('text-base text-Light font-semibold')}>Checked baggage:</div>
                            <div className={clsx('text-base text-Light font-normal')}>25kg</div>
                          </div>
                          <div className={clsx('flex flex-col w-full lg:w-[calc(25%_-_15px)]')}>
                            <div className={clsx('text-base text-Light font-semibold')}>Change fee:</div>
                            <div className={clsx('text-base text-Light font-normal')}>USD 100.00</div>
                          </div>
                          <div className={clsx('flex flex-col w-full lg:w-[calc(25%_-_15px)]')}>
                            <div className={clsx('text-base text-Light font-semibold')}>Refund fee:</div>
                            <div className={clsx('text-base text-Light font-normal')}>
                              USD 150.00 before departure, not permitted after departure
                            </div>
                          </div>
                          <div className={clsx('flex flex-col w-full lg:w-[calc(25%_-_15px)]')}>
                            <div className={clsx('text-base text-Light font-semibold')}>No-show penalty:</div>
                            <div className={clsx('text-base text-Light font-normal')}>
                              If you miss a flight: To make a change: USD 200.00. To refund your booking: USD 300.00
                              before departure. Non-refundable after departure.
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-8 flex items-center gap-10 pb-8 md:pb-12">
                    <div className="underline text-Light">View detailed fare conditions</div>
                    <Link href={'/terms-and-conditions'}>
                      <div className="underline text-Light">Terms and conditions</div>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between mt-5 md:mt-10 bg-white p-8 rounded-2xl">
                  <div className="text-secondary text-xl">Total to be paid</div>
                  <div className="text-secondary text-xl font-medium">
                    <span className="text-Light">USD</span> {totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
