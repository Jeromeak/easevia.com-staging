'use client';
import { ArrowDown, ThunderWhiteIcon } from '@/icons/icon';
import type { PackSelectProps, Option } from '@/lib/types/common.types';
import clsx from 'clsx';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const PackSelect: React.FC<PackSelectProps> = ({
  options,
  placeholder = 'Select',
  onChange,
  className,
  mtClass = 'mt-4',
  leftIconWrapperClass,
  thunderIconClass,
  arrowWrapperClass,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option>(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (option: Option) => {
      setSelected(option);
      onChange(option);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleDropdownClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (options.length > 0) {
      setSelected(options[0]);
      onChange(options[0]);
    }
  }, [options]);

  const dropdownClass = useMemo(
    () =>
      clsx(
        'absolute left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-300 overflow-hidden shadow-12xl transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-64' : 'max-h-0'
      ),
    [isOpen]
  );

  const arrowClass = useMemo(() => clsx(isOpen ? 'rotate-180' : 'rotate-0', 'transition-transform'), [isOpen]);

  const handleSelectItem = useCallback(
    function (option: Option): () => void {
      return function () {
        handleSelect(option);
      };
    },
    [handleSelect]
  );

  return (
    <div ref={dropdownRef} className={clsx('relative  md:w-fit w-full', mtClass)}>
      <div
        onClick={handleDropdownClick}
        className={clsx('w-full xl:mt-4 mt-1 md:mt-4 pl-7 xl:pl-6 py-2 cursor-pointer', className)}
      >
        {selected ? selected.label : placeholder}
      </div>

      <div
        className={clsx('absolute left-1 xl:left-0 top-1/2 md:top-9 xl:top-9 -translate-y-1/2', leftIconWrapperClass)}
      >
        <ThunderWhiteIcon className={clsx('', thunderIconClass)} />
      </div>

      <div className={clsx('absolute right-3 top-6 md:top-9 -translate-y-1/2 cursor-pointer', arrowWrapperClass)}>
        <ArrowDown className={arrowClass} />
      </div>

      <div className={dropdownClass}>
        <ul>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={clsx('p-3 hover:bg-Teal-900 dark:hover:bg-teal-600 hover:text-white cursor-pointer')}
              onClick={handleSelectItem(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PackSelect;
