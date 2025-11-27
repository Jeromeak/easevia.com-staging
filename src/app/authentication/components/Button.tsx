import React from 'react';
import clsx from 'clsx';
import type { ButtonProps } from '@/lib/types/common.types';

export const Button: React.FC<ButtonProps> = ({ children, label, className = '', ...rest }) => {
  return (
    <button
      className={clsx(
        'px-5 uppercase py-3 cursor-pointer dark:text-white dark:bg-Teal-900 dark:hover:bg-Teal-500 tracking-wide leading-5 w-full bg-[#00B2B2] text-white hover:bg-[#009999] transition duration-300',
        'rounded-[100px]',
        className
      )}
      {...rest}
    >
      {children ?? label}
    </button>
  );
};
