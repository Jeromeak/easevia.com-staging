'use client';
import { useEffect, useState } from 'react';

interface CustomCheckboxProps {
  label?: string;
  checked?: boolean;
  className?: string;
  labelClassName?: string;
  onChange?: (checked: boolean) => void;
  toggle?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked = false,
  onChange,
  className,
  labelClassName,
  toggle,
  children,
  disabled = false,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  // Keep internal state in sync with the controlled `checked` prop
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
    toggle?.();
  };

  return (
    <label
      onClick={handleToggle}
      className={`flex items-center gap-3 select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <div
        className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${className} duration-300 ${
          isChecked ? 'bg-Teal-500 border-Teal-500' : 'border-[#475569]'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        {isChecked && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={labelClassName || `text-sm ${disabled ? 'text-gray-400!' : 'dark:text-white!'}`}>{label}</span>
      <div>{children}</div>
    </label>
  );
};
