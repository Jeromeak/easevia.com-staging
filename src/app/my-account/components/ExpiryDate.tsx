'use client';

import React, { forwardRef, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { CalenderIcon } from '@/icons/icon';
import { Input } from './Input';
import 'react-datepicker/dist/react-datepicker.css';
import type { CustomInputProps } from '@/lib/types/common.types';
import moment from 'moment';

const ExpiryDate = forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick, onChange }, ref) => (
  <Input
    icon={<CalenderIcon />}
    iconPosition="right"
    value={value}
    className="!w-full"
    onClick={onClick}
    onChange={onChange}
    placeholder="Expiry Date"
    ref={ref}
    readOnly
  />
));

ExpiryDate.displayName = 'CustomInput';

interface ExpiryDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ExpiryDatePicker: React.FC<ExpiryDatePickerProps> = ({ value, onChange }) => {
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
        onChange('');
      }
    },
    [onChange]
  );

  return (
    <DatePicker
      selected={parsedDate}
      onChange={handleDateChange}
      customInput={<ExpiryDate />}
      dateFormat="dd MMMM yyyy"
      minDate={new Date('1900-01-01')}
      maxDate={new Date(new Date().getFullYear() + 50, 11, 31)}
      showMonthDropdown
      showYearDropdown
      scrollableYearDropdown
      dropdownMode="select"
      popperPlacement="bottom"
    />
  );
};

export default ExpiryDatePicker;
