'use client';
import { useCallback } from 'react';
import clsx from 'clsx';
import type { CustomCheckboxProps } from '@/lib/types/common.types';

export const Customcheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked = false,
  onChange,
  className,
  labelClassName = 'text-neutral-50 dark:text-white text-sm',
  toggle,
  children,
}) => {
  const handleToggle = useCallback(() => {
    onChange?.(!checked);
    toggle?.();
  }, [checked, onChange, toggle]);

  return (
    <label onClick={handleToggle} className="flex items-center gap-2 md:gap-3 cursor-pointer select-none">
      <div
        className={clsx(
          'w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-300',
          className,
          checked ? 'bg-Teal-500 border-Teal-500' : 'border-[#475569]'
        )}
      >
        {checked && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={labelClassName}>{label}</span>
      <div>{children}</div>
    </label>
  );
};
