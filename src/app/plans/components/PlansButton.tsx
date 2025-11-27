import type { PlansButtonProps } from '@/lib/types/common.types';
import clsx from 'clsx';
import React, { useCallback } from 'react';

export const PlansButton: React.FC<PlansButtonProps> = ({ label, icon, className = '', onClick, ...props }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
    },
    [onClick]
  );

  return (
    <button
      onClick={handleClick}
      {...props}
      className={clsx(
        'flex items-center gap-3 border-[1.5px] text-sm font-semibold leading-6 rounded-full px-4 py-3 cursor-pointer justify-center w-full bg-',
        className
      )}
    >
      {label}
      {icon}
    </button>
  );
};
