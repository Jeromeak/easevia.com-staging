'use client';

import { FlightIcon } from '@/icons/icon';
import type { BookingPassenger } from '@/lib/types/api/booking';

interface PassengerDetailCardProps {
  passenger?: BookingPassenger;
  passengerNumber: number;
  isSelected: boolean;
}

export const PassengerDetailCard = ({ passenger, passengerNumber, isSelected }: PassengerDetailCardProps) => {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Determine passenger type based on age
  const getPassengerType = (age: number) => {
    if (age < 2) return 'Infant (under 2 years)';
    if (age < 12) return 'Child (2-11 years)';

    return 'Adult (18 years or older)';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="p-5 my-6 w-full rounded-xl gap-4 border-b border-b-[#2F2F2F] bg-neutral-50 flex flex-col">
      <div className="flex flex-col gap-1">
        <div className="text-Light text-sm font-normal uppercase">Flight</div>
        <div className="text-white text-xl font-medium">
          Passenger {passengerNumber}:{' '}
          {isSelected && passenger
            ? getPassengerType(calculateAge(passenger.date_of_birth))
            : '(Adult, 18 years or older)'}
        </div>
        <div className="text-Light text-xm">Passenger details must match your passport or photo ID</div>
      </div>

      <div className="w-full bg-Teal-150 p-6 rounded-[8px] flex flex-col">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-4 w-[80%]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-Teal-500 rounded-full flex justify-center items-center">
                <FlightIcon width="10" height="8" />
              </div>
              <div className="text-xl text-white">
                {isSelected && passenger ? passenger.name : 'Select a passenger'}
              </div>
            </div>
          </div>
          {/* <div className="w-12 h-12 flex justify-center hover:bg-Teal-500 hover:text-white transition-colors duration-500 cursor-pointer items-center border text-Teal-500 border-Teal-500 rounded-full">
            <EditIcon width="25" height="25" />
          </div> */}
        </div>

        {isSelected && passenger ? (
          <div className="flex justify-between gap-5 flex-wrap items-start w-[60%] mt-4">
            <div className="flex flex-col">
              <div className="text-[#A4A4A4] text-base font-medium">Passport number</div>
              <div className="text-sm text-white">{passenger.passport_number}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-[#A4A4A4] text-base font-medium">Passport expiry date</div>
              <div className="text-sm text-white">{formatDate(passenger.passport_expiry)}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-[#A4A4A4] text-base font-medium">Nationality</div>
              <div className="text-sm text-white">{passenger.nationality}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-[#A4A4A4] text-base font-medium">Date of Birth</div>
              <div className="text-sm text-white">{formatDate(passenger.date_of_birth)}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-[#A4A4A4] text-base font-medium">Gender</div>
              <div className="text-sm text-white capitalize">{passenger.gender}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-[#A4A4A4] text-base font-medium">Relationship</div>
              <div className="text-sm text-white">{passenger.relationship_with_user}</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-[#A4A4A4] text-sm">
            Please select a passenger from the Quick Selection above to view their details.
          </div>
        )}
      </div>
    </div>
  );
};
