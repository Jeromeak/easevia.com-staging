import { ProfileTabIcon } from '@/icons/icon';
import { QuickSection } from './QuickSection';
import { PassengerDetailCard } from './PassengerDetailCard';
import type { UserProfile } from '@/lib/types/api/user';
import type { BookingPassenger } from '@/lib/types/api/booking';
import type { SelectedFlightData } from '@/lib/types/sessionStorage';
import { useState, useEffect } from 'react';

interface PassengersDetailsSectionProps {
  userProfile?: UserProfile | null;
  passengers?: BookingPassenger[];
  selectedFlightData?: SelectedFlightData | null;
  onPassengerSelection?: (passengers: number[]) => void;
}

export const PassengersDetailsSection = ({
  userProfile,
  passengers,
  onPassengerSelection,
}: PassengersDetailsSectionProps) => {
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([]);
  const [passengerCards, setPassengerCards] = useState<{ cardNumber: number; passengerId: number }[]>([]);

  // Handle passenger selection from QuickSection
  const handlePassengerSelection = (passengerIds: number[]) => {
    setSelectedPassengers(passengerIds);
    onPassengerSelection?.(passengerIds);
  };

  // Generate passenger cards based on selected passengers (not fixed count)
  useEffect(() => {
    // Create cards based on selected passengers
    const cards = selectedPassengers.map((passengerId, index) => ({
      cardNumber: index + 1,
      passengerId: passengerId,
    }));
    setPassengerCards(cards);
  }, [selectedPassengers]);

  // Get passenger data by ID
  const getPassengerById = (passengerId: number) => {
    return passengers?.find((passenger) => passenger.id === passengerId);
  };

  return (
    <div className="flex flex-col w-full mt-8 md:mt-0">
      <div className="md:text-40 text-2xl dark:text-white font-Neutra uppercase">
        Review flights & Passengers Details
      </div>
      <div className="p-4 md:p-5 my-3 md:my-6 w-full rounded-xl gap-4 bg-white dark:bg-neutral-50 flex flex-col">
        <div className="flex flex-col gap-1">
          <div className="text-Light text-xs md:text-sm font-normal uppercase">For all bookings</div>
          <div className="text-neutral-50 dark:text-white text-xl font-medium">Contact details</div>
          <div className="text-Light text-xs md:text-sm ">This is where your confirmation will be sent</div>
        </div>
        <div className="w-full bg-[#D5E9E9] dark:bg-Teal-150 p-4 md:p-6 rounded-[8px] flex justify-between items-center">
          <div className="flex flex-col gap-2 md:gap-4 w-[80%]">
            <div className="flex items-center gap-3">
              <div className=" text-Teal-500">
                <ProfileTabIcon width="20" height="20" />
              </div>
              <div className="text-xl text-white">{userProfile?.name || 'User'}</div>
            </div>
            <div className="flex flex-wrap pl-1 items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A4A4A4]" />
                <div className="text-sm text-[#A4A4A4]">{userProfile?.email || 'No email'}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A4A4A4]" />
                <div className="text-sm text-[#A4A4A4]">{userProfile?.phone || 'No phone'}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A4A4A4]" />
                <div className="text-sm text-[#A4A4A4]">India</div>
              </div>
            </div>
          </div>
          {/* <div className="w-12 h-12 flex justify-center cursor-pointer items-center hover:bg-Teal-500 hover:text-white duration-500  transition-colors border text-Teal-500 border-Teal-500 rounded-full">
            <EditIcon width="25" height="25" />
          </div> */}
        </div>
      </div>
      <QuickSection passengers={passengers} onPassengerSelection={handlePassengerSelection} />

      {/* Dynamic Passenger Detail Cards */}
      {passengerCards.length > 0 ? (
        passengerCards.map((card) => {
          const passenger = getPassengerById(card.passengerId);
          const isSelected = !!passenger;

          return (
            <PassengerDetailCard
              key={`${card.passengerId}-${card.cardNumber}`}
              passenger={passenger}
              passengerNumber={card.cardNumber}
              isSelected={isSelected}
            />
          );
        })
      ) : (
        <div className="p-5 my-6 w-full rounded-xl gap-4 bg-neutral-50 flex flex-col">
          <div className="flex flex-col gap-1">
            <div className="text-Light text-sm font-normal uppercase">Flight</div>
            <div className="text-white text-xl font-medium">No passengers selected</div>
            <div className="text-Light text-xm">
              Please select passengers from the Quick Selection above to view their details.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
