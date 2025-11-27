import clsx from 'clsx';
import { TicketSearchIcon, ArrowDown, CloseSquareIcon } from '@/icons/icon';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Customcheckbox } from '@/app/plans/components/Customcheckbox';

export interface DropdownMultiSelectCustomProps extends DropdownMultiSelectProps {
  className?: string;
  bgColor?: string;
  labelColor?: string;
  showTags?: boolean;
  showCheckbox?: boolean;
  singleSelect?: boolean;
}
export interface DropdownMultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}
export interface Option {
  label: string;
  value: string;
}

interface DropdownMultiSelectCustomPropsWithDirection extends DropdownMultiSelectCustomProps {
  dropdownDirection?: 'auto-up' | 'down';
}

const DropdownMultiSelect: React.FC<DropdownMultiSelectCustomPropsWithDirection> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  className = '',
  bgColor = 'bg-white',
  labelColor = 'text-Gray-100',
  showTags = true,
  showCheckbox = true,
  singleSelect = false,
  dropdownDirection = 'down',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownPos, setDropdownPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const [search, setSearch] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const filteredOptions = React.useMemo(() => {
    return searchable ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : options;
  }, [searchable, options, search]);

  const display = React.useMemo(() => {
    return value.length
      ? options
          .filter((o) => value.includes(o.value))
          .map((o) => o.label)
          .join(', ')
      : '';
  }, [value, options]);

  const handleCheck = useCallback(
    (checkedValue: string) => {
      if (value.includes(checkedValue)) {
        onChange(value.filter((v) => v !== checkedValue));
      } else {
        if (singleSelect) {
          onChange([checkedValue]);
        } else {
          onChange([...value, checkedValue]);
        }
      }
    },
    [onChange, value, singleSelect]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const dropdownEl = dropdownRef.current;
    const panelEl = panelRef.current;

    if (
      dropdownEl &&
      !dropdownEl.contains(event.target as Node) &&
      (!panelEl || !panelEl.contains(event.target as Node))
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleInputClick = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setSearch('');
    }
  }, [disabled]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      let top = rect.bottom + window.scrollY;

      if (dropdownDirection === 'auto-up' && window.innerWidth < 1024) {
        top = Math.max(0, rect.top + window.scrollY - 240);
      }

      setDropdownPos({
        left: rect.left + window.scrollX,
        top,
        width: rect.width,
      });
    } else if (!isOpen) {
      setDropdownPos(null);
    }
  }, [isOpen, dropdownDirection]);

  const optionHandlers = React.useMemo(() => {
    const handlers: Record<string, () => void> = {};
    options.forEach((opt) => {
      handlers[opt.value] = () => handleCheck(opt.value);
    });

    return handlers;
  }, [options, handleCheck]);

  const optionRowHandlers = React.useMemo(() => {
    const handlers: Record<string, () => void> = {};
    filteredOptions.forEach((opt) => {
      handlers[opt.value] = () => {
        if (!showCheckbox) {
          handleCheck(opt.value);
        }
      };
    });

    return handlers;
  }, [filteredOptions, showCheckbox, handleCheck]);

  const removeHandlers = React.useMemo(() => {
    const handlers: Record<string, () => void> = {};
    value.forEach((val) => {
      handlers[val] = () => {
        onChange(value.filter((v) => v !== val));
      };
    });

    return handlers;
  }, [value, onChange]);

  return (
    <div ref={dropdownRef} className={clsx('relative w-full', className)}>
      {label && <label className={clsx('block mb-1 px-1 font-medium', labelColor)}>{label}</label>}
      <div className="relative w-full">
        <button
          type="button"
          className={clsx(
            'text-[#CCC] text-sm leading-5 font-medium p-3 dark:bg-neutral-50 border-[#D9DEDF] dark:border-inputsecondary w-full ml-0 md:w-full px-2 pt-2 pb-2 outline-none focus:ring-0 focus:ring-primary focus:border-primary duration-500 rounded-[8px] border border-Gray-200 text-left flex items-center gap-2 cursor-pointer',
            bgColor,
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={handleInputClick}
          disabled={disabled}
        >
          <span
            className={clsx(
              display ? 'text-neutral-50/50 dark:text-[#CCC]' : 'text-neutral-50/50 dark:text-[#CCC]',
              'flex-1 truncate'
            )}
          >
            {display || placeholder}
          </span>
          <span
            className={clsx('text-neutral-50/50 dark:text-[#CCC] transition-transform', {
              'rotate-180': isOpen,
              'rotate-0': !isOpen,
            })}
          >
            <ArrowDown
              className={clsx(
                { 'rotate-180': isOpen, 'rotate-0': !isOpen },
                'transition-transform h-3.5 w-3.5 cursor-pointer'
              )}
            />
          </span>
        </button>
      </div>
      {showTags && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {options
            .filter((o) => value.includes(o.value))
            .map((o) => (
              <span
                key={o.value}
                className="flex items-center bg-[#F5F5F5] dark:bg-gray-300/100 text-neutral-50/50 dark:text-[#CCC] rounded-[4px] px-2 py-1 text-xs font-normal"
              >
                {o.label}
                <button
                  type="button"
                  className="ml-1 flex items-center"
                  onClick={removeHandlers[o.value]}
                  tabIndex={-1}
                >
                  <CloseSquareIcon className="w-4 h-4 text-neutral-50/50 dark:text-[#9EA2AE] hover:text-red-500 dark:hover:text-red-500 transition-500 cursor-pointer" />
                </button>
              </span>
            ))}
        </div>
      )}

      {createPortal(
        <div
          ref={panelRef}
          className={clsx(
            'z-[99999] h-[240px] overflow-y-auto scroll bg-white absolute dark:bg-gray-300 border border-[#D9DEDF] dark:border-inputsecondary outline-none rounded-md shadow-lg transition-all duration-200 transform origin-top',
            bgColor,
            isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'
          )}
          style={{
            left: dropdownPos?.left ?? 0,
            top: dropdownPos?.top ?? 0,
            width: dropdownPos?.width ?? 'auto',
            visibility: isOpen ? 'visible' : 'hidden',
          }}
          aria-hidden={!isOpen}
        >
          {searchable && (
            <div className="sticky top-0 bg-white dark:bg-black dark:text-[#CCC] border border-[#D9DEDF] dark:border-inputsecondary text-sm leading-5 font-medium p-3 dark:placeholder:text-[#CCC] outline-none z-10 px-4 pt-4 pb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pr-10 pl-3 bg-white dark:bg-gray-300 py-2 border border-[#D9DEDF] dark:border-inputsecondary text-black dark:text-[#CCC] outline-none duration-500 rounded-full text-sm [&::placeholder]:text-[#CCC]"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={handleSearchChange}
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] pointer-events-none">
                  <TicketSearchIcon />
                </span>
              </div>
            </div>
          )}
          {filteredOptions.length === 0 && (
            <div className="text-light-100 text-sm flex items-center justify-center py-2">No options</div>
          )}
          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              className={clsx('flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-primary/10')}
              onClick={optionRowHandlers[opt.value]}
            >
              {showCheckbox ? (
                <Customcheckbox
                  checked={value.includes(opt.value)}
                  onChange={optionHandlers[opt.value]}
                  label={<span className="text-neutral-50/50 dark:text-white text-[12px] font-urban">{opt.label}</span>}
                />
              ) : (
                <span
                  className={clsx(
                    'text-neutral-50/50 dark:text-white text-[12px] font-urban',
                    value.includes(opt.value) && 'font-bold text-Teal-500'
                  )}
                >
                  {opt.label}
                </span>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DropdownMultiSelect;
