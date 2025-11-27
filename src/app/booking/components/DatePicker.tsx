'use client';

import { Calendar } from '@/icons/icon';
import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { CustomDatePickerProps, CustomInputProps } from '@/lib/types/common.types';
import moment from 'moment';

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick }, ref) => (
  <div className={clsx('relative w-full')}>
    <div onClick={onClick} className={clsx('flex items-center gap-2 cursor-pointer rounded w-full')}>
      <Calendar className={clsx('text-gray-200 text-2xl w-3 h-3 lg:w-6 lg:h-6')} />
      <input
        type="text"
        value={value}
        readOnly
        ref={ref}
        className={clsx('outline-none bg-transparent text-sm w-full cursor-pointer')}
        placeholder="Select a date"
      />
    </div>
  </div>
));
CustomInput.displayName = 'CustomInput';

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange }) => {
  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        // Use moment.js to format date in local timezone to avoid UTC conversion issues
        // Use a simple YYYY-MM-DD format for consistency
        const formattedDate = moment(date).format('YYYY-MM-DD');

        onChange(formattedDate);
      } else {
        onChange(null);
      }
    },
    [onChange]
  );

  const parsedDate = useMemo(() => {
    if (!value) return null;

    // Use moment.js to parse the date string to avoid timezone issues
    const momentDate = moment(value);

    return momentDate.isValid() ? momentDate.toDate() : null;
  }, [value]);

  return (
    <div className={clsx('relative mt-3')}>
      <DatePicker
        selected={parsedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        customInput={<CustomInput />}
        minDate={new Date()}
      />
    </div>
  );
};

export default CustomDatePicker;
