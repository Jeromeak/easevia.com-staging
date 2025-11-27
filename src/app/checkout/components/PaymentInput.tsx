import React, { useCallback, useState, useMemo } from 'react';
import type { InputProps } from '@/common/components/Data';
import clsx from 'clsx';
import { IconPosition } from '@/lib/types/common.types';

export const PaymentInput = React.forwardRef<HTMLInputElement, InputProps>(
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
      iconPosition = IconPosition.LEFT,
      maxLength,
      inputMode,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const iconClass = 'absolute top-1/2 -translate-y-1/2 text-gray-400';

    const showFloating = isFocused || !!value;

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const handleIconClick = useCallback(() => {
      if (onClick) onClick();
    }, [onClick]);

    const leftIcon = useMemo(() => {
      if (icon && iconPosition === IconPosition.LEFT) {
        return (
          <div onClick={handleIconClick} className={clsx('cursor-pointer left-3', iconClass)}>
            {icon}
          </div>
        );
      }

      return null;
    }, [icon, iconPosition, handleIconClick]);

    const rightIcon = useMemo(() => {
      if (icon && iconPosition === IconPosition.RIGHT) {
        return (
          <div onClick={handleIconClick} className={clsx('cursor-pointer right-3', iconClass)}>
            {icon}
          </div>
        );
      }

      return null;
    }, [icon, iconPosition, handleIconClick]);

    return (
      <div className="flex flex-col gap-1 w-full relative">
        {leftIcon}
        {rightIcon}

        <label
          className={clsx(
            'absolute left-5 transition-all font-medium text-sm uppercase pointer-events-none',
            showFloating ? 'top-1 text-[#7C797E] text-xs' : 'top-5 text-[#7C797E]'
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(
            'px-5 py-4 rounded-sm bg-white dark:bg-black',
            'focus:border-orange-200 duration-300',
            'dark:text-white text-neutral-50 border border-[#9EA2AE] dark:border-[#343434] outline-none',
            'placeholder-transparent',
            icon ? (iconPosition === IconPosition.LEFT ? 'pl-10' : 'pr-10') : '',
            className
          )}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
        />
      </div>
    );
  }
);
