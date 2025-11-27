'use client';
import type { ToggleSwitchProps } from '@/lib/types/common.types';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle, disabled = false }) => {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onToggle();
    }
  }, [onToggle, disabled]);

  const buttonClass = useMemo(
    () =>
      clsx(
        'relative w-[51px] cursor-pointer h-[28px] flex items-center rounded-full p-1 transition-colors duration-300',
        enabled ? 'bg-Teal-900' : 'bg-[#E6F2F2] dark:bg-neutral-600'
      ),
    [enabled, disabled]
  );

  const knobClass = useMemo(
    () =>
      clsx(
        'bg-white dark:bg-secondary w-[21px] h-[21px] rounded-full shadow-md transform transition-transform duration-300',
        enabled ? 'translate-x-6' : 'translate-x-0'
      ),
    [enabled]
  );

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      className={buttonClass}
      aria-pressed={enabled}
      aria-disabled={disabled}
    >
      <div className={knobClass} />
    </button>
  );
};
