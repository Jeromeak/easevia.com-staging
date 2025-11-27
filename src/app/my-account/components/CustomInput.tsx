'use client';

import React, { forwardRef, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { CalenderIcon } from '@/icons/icon';
import { Input } from './Input';
import 'react-datepicker/dist/react-datepicker.css';
import type { CustomDatePickerProps, CustomInputProps } from '@/lib/types/common.types';
import moment from 'moment';

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick }, ref) => (
  <Input
    icon={<CalenderIcon />}
    iconPosition="right"
    value={value}
    className="!w-full"
    onClick={onClick}
    onChange={() => {}}
    placeholder="Date of Birth"
    ref={ref}
  />
));

CustomInput.displayName = 'CustomInput';

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange }) => {
  const parsedDate = useMemo(() => {
    if (!value) return null;

    // Use moment.js to parse the date string to avoid timezone issues
    const momentDate = moment(value);

    return momentDate.isValid() ? momentDate.toDate() : null;
  }, [value]);

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        // Use moment.js to format date in local timezone to avoid UTC conversion issues
        const formattedDate = moment(date).format('YYYY-MM-DD');
        onChange(formattedDate);
      } else {
        onChange(null);
      }
    },
    [onChange]
  );

  return (
    <DatePicker
      selected={parsedDate}
      onChange={handleDateChange}
      customInput={<CustomInput />}
      dateFormat="dd MMMM yyyy"
      minDate={new Date('1900-01-01')}
      maxDate={new Date()}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      popperPlacement="bottom"
    />
  );
};

export default CustomDatePicker;
