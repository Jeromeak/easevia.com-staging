'use client';

import type { FlightDurationSliderProps } from '@/lib/types/common.types';
import { useState, useCallback, useEffect } from 'react';
import { Range } from 'react-range';

export const FlightDurationSlider: React.FC<FlightDurationSliderProps> = ({
  min = 0,
  max = 20,
  step = 1,
  defaultValue = [0, 20],
  onChange,
}) => {
  const [values, setValues] = useState<[number, number]>(defaultValue);

  // Sync with defaultValue when it changes
  useEffect(() => {
    setValues(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback(
    (newValues: number[]) => {
      if (newValues.length === 2) {
        setValues([newValues[0], newValues[1]]);
        onChange?.([newValues[0], newValues[1]]);
      }
    },
    [onChange]
  );

  interface RenderTrackProps {
    props: React.HTMLAttributes<HTMLDivElement>;
    children: React.ReactNode;
  }

  interface RenderThumbProps {
    props: React.HTMLAttributes<HTMLDivElement> & { key?: string | number };
  }

  const renderTrack = useCallback(
    ({ props, children }: RenderTrackProps) => (
      <div {...props} className="h-1 w-full bg-neutral-700 rounded relative">
        <div
          style={{
            left: `${((values[0] - min) / (max - min)) * 100}%`,
            width: `${((values[1] - values[0]) / (max - min)) * 100}%`,
          }}
          className="absolute h-full bg-Teal-900 dark:bg-Teal-500 rounded"
        />
        {children}
      </div>
    ),
    [values, min, max]
  );

  const renderThumb = useCallback(({ props }: RenderThumbProps) => {
    const { key, ...restProps } = props;

    return (
      <div
        key={key}
        {...restProps}
        className="w-[36px] h-[35px] rounded-full bg-white dark:bg-neutral-50 border-2 border-[#C6D8E3] dark:border-white shadow-lg focus:outline-none"
      />
    );
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-10">
        <div className="text-neutral-50 dark:text-white text-base font-medium">Flight Duration</div>
        <div className="text-[#A3A3A3] text-base font-medium">
          {values[0]}h - {values[1]}h
        </div>
      </div>

      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={handleChange}
        renderTrack={renderTrack}
        renderThumb={renderThumb}
      />

      <div className="flex justify-between mt-5 text-sm text-neutral-50/30 dark:text-[#ffffff4d]">
        <span>{min}h</span>
        <span>{max}h</span>
      </div>
    </div>
  );
};
