import React, { useState, useCallback } from 'react';
import type { InputProps } from '@/common/components/Data';
import { IconPosition } from '@/lib/types/common.types';
import clsx from 'clsx';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      name,
      value = '',
      placeholder = '',
      onChange,
      className = '',
      icon,
      onClick,
      disabled = false,
      readOnly = false,
      iconPosition = IconPosition.LEFT,
      maxLength,
      inputMode,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const iconClass = 'absolute top-1/2 -translate-y-1/2 text-gray-400';

    const showFloating = isFocused || !!value;

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const inputClassName = clsx(
      'px-5 py-4 rounded-sm dark:bg-black',
      'focus:border-orange-200 duration-300',
      'text-neutral-50 dark:text-white border border-[#9EA2AE] dark:border-[#343434] outline-none',
      'placeholder-transparent',
      icon ? (iconPosition === IconPosition.LEFT ? 'pl-10' : 'pr-10') : '',
      className
    );

    return (
      <div className="flex flex-col gap-1 w-full relative">
        {icon && iconPosition === IconPosition.LEFT && (
          <div onClick={onClick} className={clsx(iconClass, 'cursor-pointer left-3')}>
            {icon}
          </div>
        )}
        {icon && iconPosition === IconPosition.RIGHT && (
          <div onClick={onClick} className={clsx(iconClass, 'cursor-pointer right-3')}>
            {icon}
          </div>
        )}

        <label
          className={clsx(
            'absolute left-5 transition-all text-sm  uppercase',
            { 'top-1 text-[#7C797E] text-xs': showFloating, 'top-5 text-[#7C797E]': !showFloating },
            'pointer-events-none'
          )}
        >
          {placeholder}
        </label>

        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onClick={onClick}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClassName}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
        />
      </div>
    );
  }
);
