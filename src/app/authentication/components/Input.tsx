import React from 'react';
import clsx from 'clsx';
import type { InputBoxProps } from '@/lib/types/common.types';

export const InputBox: React.FC<InputBoxProps> = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  name,
  required = false,
  id,
  subText,
  autoComplete = 'off',
  maxLength,
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-base dark:text-white font-medium text-secondary uppercase">
          {label}
          {subText && <span className="text-[#737373] text-base font-medium pl-1">{subText}</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={clsx(
          'w-full mt-1 p-3 rounded-xl border outline-none',
          'placeholder:text-[#8E8E8E] placeholder:text-base placeholder:font-normal dark:text-white dark:placeholder:text-neutral-300 dark:bg-neutral-100 dark:border-neutral-200 text-black font-normal leading-6',
          'bg-inputcolor border-inputborder',
          'focus:ring-1 focus:ring-teal-500 transition-all',
          'text-base font-[Futura_PT]',
          className
        )}
      />
    </div>
  );
};
