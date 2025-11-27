'use client';
import { ArrowDown } from '@/icons/icon';
import type { CustomDropdownProps, Option } from '@/lib/types/common.types';
import clsx from 'clsx';
import React, { useState, useRef, useEffect, useCallback } from 'react';

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  className = '',
  bgColor = 'dark:bg-gray-500 bg-white ',
  labelColor = 'text-[#7C797E]',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<Option | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = useCallback(
    (option: Option) => {
      setSelected(option);
      onChange(option);
      setIsOpen(false);
      setSearch(option.label);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      if (!isOpen) setIsOpen(true);
    },
    [isOpen]
  );

  const handleInputClick = useCallback(() => {
    setIsOpen((prev) => !prev);
    setSearch('');
  }, []);

  const handleArrowClick = useCallback(() => {
    setIsOpen((prev) => !prev);
    setSearch('');
  }, []);

  useEffect(() => {
    if (value) {
      setSelected(value);
      setSearch(value.label);
    } else {
      setSelected(undefined);
      setSearch('');
    }
  }, [value]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (isOpen) {
          const match = options.find((opt) => opt.label.toLowerCase() === search.toLowerCase());

          if (match) {
            setSelected(match);
            onChange(match);
            setSearch(match.label);
          } else {
            setSelected(undefined);
            onChange({ label: '', value: '' });
            setSearch('');
          }
        }

        setIsOpen(false);
      }
    },
    [isOpen, search, options, onChange]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleOptionClick = useCallback(
    (option: Option) => () => {
      handleSelect(option);
    },
    [handleSelect]
  );

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative w-full">
        <label
          className={clsx('absolute', labelColor, 'left-4 transition-all duration-300 uppercase pb-2 px-1', {
            'top-0.5 text-xs': isOpen || search,
            'top-5 text-sm': !(isOpen || search),
          })}
        >
          {placeholder}
        </label>
        <input
          type="text"
          value={isOpen ? search : value ? value.label : selected ? selected.label : ''}
          readOnly={!isOpen}
          onChange={handleInputChange}
          onClick={handleInputClick}
          className={`w-full bg-white dark:bg-neutral-50 px-4 pt-6 pb-2 outline-none border border-inputsecondary placeholder-transparent ${className}`}
        />
        <div
          onClick={handleArrowClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#7C797E]"
        >
          <ArrowDown className={clsx({ 'rotate-180': isOpen, 'rotate-0': !isOpen }, 'transition-transform')} />
        </div>
      </div>

      {isOpen && (
        <ul
          className={clsx(
            'absolute z-50 mt-1',
            bgColor,
            'w-full max-h-60 border border-white shadow-2xl dark:border-inputsecondary rounded-md overflow-y-auto'
          )}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <li
                key={opt.value || index}
                className="px-3 py-2 hover:bg-teal-600 flex items-center gap-3 cursor-pointer dark:text-white"
                onClick={handleOptionClick(opt)}
              >
                {opt.icon && <span>{opt.icon}</span>}
                <span>{opt.label}</span>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-center text-black dark:text-white">No options</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
