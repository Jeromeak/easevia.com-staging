'use client';
import { CalendarIcon, CloseIconTicket } from '@/icons/icon';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import type ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  onStartDateChange?: (date: Date | null) => void;
  onEndDateChange?: (date: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
}

export default function TwoInputDateRangePicker({
  onStartDateChange,
  onEndDateChange,
  initialStartDate = null,
  initialEndDate = null,
}: DateRangePickerProps = {}) {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  const startDateRef = useRef<ReactDatePicker>(null);
  const endDateRef = useRef<ReactDatePicker>(null);

  useEffect(() => {
    setStartDate(initialStartDate);
  }, [initialStartDate]);

  useEffect(() => {
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  const handleStartDateChange = useCallback(
    (date: Date | null) => {
      setStartDate(date);
      onStartDateChange?.(date);

      if (endDate && date && endDate < date) {
        setEndDate(null);
        onEndDateChange?.(null);
      }

      setTimeout(() => {
        endDateRef.current?.setFocus();
      }, 0);
    },
    [endDate, onStartDateChange, onEndDateChange]
  );

  const handleEndDateChange = useCallback(
    (date: Date | null) => {
      setEndDate(date);
      onEndDateChange?.(date);
    },
    [onEndDateChange]
  );

  const handleStartCalendarClick = useCallback(() => {
    startDateRef.current?.setFocus();
  }, []);

  const handleEndCalendarClick = useCallback(() => {
    endDateRef.current?.setFocus();
  }, []);

  const handleAddReturnClick = useCallback(() => {
    endDateRef.current?.setFocus();
  }, []);

  const handleClearEndDate = useCallback(() => {
    setEndDate(null);
    onEndDateChange?.(null);
  }, [onEndDateChange]);

  return (
    <div className="flex md:flex-row flex-col md:w-fit w-full gap-3 md:gap-5 xl:gap-2">
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Select start date"
          className="outline-none bg-blue-150 dark:plac dark:bg-neutral-50 md:w-fit w-full rounded-full border border-blue-150 dark:border-black pl-12 pr-0 py-2"
          dateFormat="EEE, dd MMM"
          ref={startDateRef}
        />
        <div className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer" onClick={handleStartCalendarClick}>
          <CalendarIcon width="24" height="24" className="text-[#28272D] dark:text-gray-50" />
        </div>
      </div>

      <div className="relative">
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate ?? undefined}
          placeholderText={endDate ? 'Select end date' : ''}
          className="outline-none bg-blue-150 dark:bg-neutral-50 md:w-fit w-full rounded-full border border-blue-150 dark:border-black pl-12 pr-8 py-2"
          dateFormat="EEE, dd MMM"
          ref={endDateRef}
        />

        {!endDate && (
          <div
            className="absolute top-1/2 left-5 -translate-y-1/2 text-Teal-500 text-base cursor-pointer"
            onClick={handleAddReturnClick}
          >
            Add return
          </div>
        )}

        {endDate && (
          <>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer" onClick={handleEndCalendarClick}>
              <CalendarIcon width="24" height="24" className="text-[#28272D] dark:text-gray-50" />
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-neutral-50 dark:text-[#E1E0E4]"
              onClick={handleClearEndDate}
            >
              <CloseIconTicket />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
