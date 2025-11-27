'use client';
import { CancelledIcon, CompleteIcon, SubscriptionSearch, UpcomingIcon } from '@/icons/icon';
import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import { TicketCard } from './Ticket';
import clsx from 'clsx';
import { TripsTabType } from '@/lib/types/common.types';
import type { BookingItem } from '@/lib/types/api/booking';

export const TripsTab = () => {
  const [activeTab, setActiveTab] = useState<TripsTabType>(TripsTabType.UPCOMING);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [bookingData] = useState<{
    upcoming: BookingItem[];
    cancelled: BookingItem[];
    completed: BookingItem[];
  }>({
    upcoming: [],
    cancelled: [],
    completed: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with empty data (API integration pending)
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsSearching(false);
      }
    };

    if (isSearching) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearching]);

  const handleSearchButtonClick = useCallback(() => {
    setIsSearching(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsSearching(false);
  }, []);

  const handleTabClick = useCallback((tab: TripsTabType) => {
    setActiveTab(tab);
  }, []);

  const handleUpcomingTabClick = useCallback(() => {
    handleTabClick(TripsTabType.UPCOMING);
  }, [handleTabClick]);

  const handleCompletedTabClick = useCallback(() => {
    handleTabClick(TripsTabType.COMPLETED);
  }, [handleTabClick]);

  const handleCancelledTabClick = useCallback(() => {
    handleTabClick(TripsTabType.CANCELLED);
  }, [handleTabClick]);

  // Get current tab's data
  const getCurrentTabData = useCallback(() => {
    switch (activeTab) {
      case TripsTabType.UPCOMING:
        return bookingData.upcoming;
      case TripsTabType.COMPLETED:
        return bookingData.completed;
      case TripsTabType.CANCELLED:
        return bookingData.cancelled;
      default:
        return [];
    }
  }, [activeTab, bookingData]);

  // Get tickets to display (only API data)
  const getTicketsToDisplay = useCallback(() => {
    return getCurrentTabData();
  }, [getCurrentTabData]);

  return (
    <Fragment>
      <div className="w-full lg:flex lg:static sticky z-100 top-[84px] hidden md:flex-row flex-col justify-center  md:justify-between rounded-e-sm items-center px-5 md:px-8 py-3 md:py-0 gap-2 md:gap-0 md:h-20 bg-[#E6F2F2] dark:bg-gray-300">
        <div className="md:text-32 text-2xl  md:leading-[32px] text-neutral-50 dark:text-white tracking-wider uppercase font-Neutra">
          My Trips
        </div>
        <div className="relative transition-all duration-300 ease-in-out">
          {!isSearching ? (
            <button
              onClick={handleSearchButtonClick}
              className="bg-transparent border text-Teal-500 flex items-center gap-3 border-Teal-500 px-8 uppercase text-sm cursor-pointer py-1.5 rounded-full transition-all duration-300 ease-in-out"
            >
              <div>Search for a booking</div>
              <SubscriptionSearch />
            </button>
          ) : (
            <div className="flex items-center gap-3 border border-Teal-500 rounded-full px-4 py-1.5 w-[250px] bg-transparent transition-all duration-300 ease-in-out">
              <SubscriptionSearch className="text-Teal-500 transition-transform duration-300" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for a booking"
                className="outline-none placeholder:uppercase placeholder:text-sm placeholder:text-Teal-500"
                onBlur={handleInputBlur}
              />
            </div>
          )}
        </div>
      </div>
      <div className=" lg:hidden sticky top-[129px] z-100 block transition-all duration-300 ease-in-out mt-14 bg-white dark:bg-black w-full">
        <div className="px-5 py-2">
          {!isSearching ? (
            <button
              onClick={handleSearchButtonClick}
              className="bg-transparent border justify-between text-Teal-500 flex items-center w-full gap-3 border-Teal-500 px-8 uppercase text-sm cursor-pointer py-1.5 rounded-full transition-all duration-300 ease-in-out"
            >
              <div>Search for a booking</div>
              <SubscriptionSearch />
            </button>
          ) : (
            <div className="flex items-center gap-3 border border-Teal-500 rounded-full px-4 py-1.5 w-full bg-transparent transition-all duration-300 ease-in-out">
              <SubscriptionSearch className="text-Teal-500 transition-transform duration-300" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for a booking"
                className="outline-none placeholder:uppercase placeholder:text-sm placeholder:text-Teal-500"
                onBlur={handleInputBlur}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-14 md:mt-0 p-5 md:p-8 w-full">
        <div className="flex w-full  md:static sticky top-[180px] dark:bg-gray-300 bg-white py-3 z-100 justify-between  dark:lg:bg-gray-360 p-1.5  rounded-[8.815px]">
          <button
            onClick={handleUpcomingTabClick}
            className={clsx(
              'w-1/3   cursor-pointer duration-500  py-3 gap-2 rounded-[8.815px] dark:shadow-11xl text-center flex items-center justify-center px-[17.139px]',
              activeTab === TripsTabType.UPCOMING
                ? 'dark:bg-[#161616]  bg-[#B0DFDF] text-neutral-50 dark:text-white'
                : 'bg-transparent text-[#5D5D5D]'
            )}
          >
            <UpcomingIcon className="md:w-[25px] md:h-[25px] w-[14px] h-[14px]" />
            <div className="md:text-xl text-xs uppercase">Upcoming</div>
          </button>
          <button
            onClick={handleCompletedTabClick}
            className={clsx(
              'w-1/3   cursor-pointer duration-500  py-3 gap-2 rounded-[8.815px] dark:shadow-11xl text-center flex items-center justify-center px-[17.139px]',
              activeTab === TripsTabType.COMPLETED
                ? 'dark:bg-[#161616] bg-[#B0DFDF] text-neutral-50 dark:text-white'
                : 'bg-transparent text-[#5D5D5D]'
            )}
          >
            <CompleteIcon className="md:w-[25px] md:h-[25px] w-[14px] h-[14px]" />
            <div className="md:text-xl text-xs uppercase">Completed</div>
          </button>
          <button
            onClick={handleCancelledTabClick}
            className={clsx(
              'w-1/3   cursor-pointer duration-500  py-3 gap-2 rounded-[8.815px] dark:shadow-11xl text-center flex items-center justify-center px-[17.139px]',
              activeTab === TripsTabType.CANCELLED
                ? 'dark:bg-[#161616] bg-[#B0DFDF] text-neutral-50 dark:text-white'
                : 'bg-transparent text-[#5D5D5D]'
            )}
          >
            <CancelledIcon className="md:w-[25px] md:h-[25px] w-[14px] h-[14px]" />
            <div className="md:text-xl text-xs uppercase">Cancelled</div>
          </button>
        </div>
        <div className="flex justify-between flex-wrap items-center gap-4 mt-5">
          {loading ? (
            <div className="w-full flex justify-center items-center py-20">
              <div className="text-lg text-gray-600">Loading your trips...</div>
            </div>
          ) : getTicketsToDisplay().length === 0 ? (
            <div className="w-full flex justify-center items-center py-20">
              <div className="text-center">
                <div className="text-lg text-gray-600 mb-2">No {activeTab.toLowerCase()} trips found</div>
                <div className="text-sm text-gray-500">
                  {activeTab === TripsTabType.UPCOMING && 'Your upcoming trips will appear here'}
                  {activeTab === TripsTabType.COMPLETED && 'Your completed trips will appear here'}
                  {activeTab === TripsTabType.CANCELLED && 'Your cancelled trips will appear here'}
                </div>
              </div>
            </div>
          ) : (
            getTicketsToDisplay().map((ticket: BookingItem, idx: number) => (
              <div key={idx} className="w-full xl:w-[calc(50%_-_8px)]">
                <TicketCard ticket={ticket} />
              </div>
            ))
          )}
        </div>
      </div>
    </Fragment>
  );
};
