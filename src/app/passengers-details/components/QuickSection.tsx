'use client';

import { CustomCheckbox } from '@/common/components/CustomCheckBox';
import { useState } from 'react';
import type { BookingPassenger } from '@/lib/types/api/booking';

interface QuickSectionProps {
  passengers?: BookingPassenger[];
  onPassengerSelection?: (passengers: number[]) => void;
}

export const QuickSection = ({ passengers = [], onPassengerSelection }: QuickSectionProps) => {
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([]);

  const handlePassengerSelect = (passengerId: number, isSelected: boolean) => {
    let newSelectedPassengers: number[];

    if (isSelected) {
      newSelectedPassengers = [...selectedPassengers, passengerId];
    } else {
      newSelectedPassengers = selectedPassengers.filter((id) => id !== passengerId);
    }

    setSelectedPassengers(newSelectedPassengers);
    onPassengerSelection?.(newSelectedPassengers);
  };

  return (
    <div className="p-5 bg-white dark:bg-neutral-50 rounded-xl flex flex-col">
      <div className="flex flex-col gap-1">
        <div className="text-Light text-xs md:text-sm font-normal uppercase">Quick SELECTION</div>
        <div className="text-neutral-50 dark:text-white text-xl font-medium">Select Saved Passenger</div>
        <div className="text-Light text-xs md:text-sm ">Choose from your previously saved passengers details</div>
      </div>

      {passengers.length > 0 ? (
        <div className="flex items-center gap-5 md:gap-10 flex-wrap mt-5">
          {passengers.map((passenger) => (
            <CustomCheckbox
              key={passenger.id}
              label={passenger.name}
              checked={selectedPassengers.includes(passenger.id)}
              onChange={(isSelected) => handlePassengerSelect(passenger.id, isSelected)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 text-Light text-sm">
          No saved passengers found. Please add passengers to your subscription.
        </div>
      )}
    </div>
  );
};
