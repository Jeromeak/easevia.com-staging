'use client';
import { BookingSummarySection } from './BookingSummarySection ';
import { PassengersDetailsSection } from './PassengerDetailsSection ';
import { TicketCardDetail } from './TicketCard';
import { useEffect, useState } from 'react';
import { fetchUserInfo } from '@/lib/api/user';
import { getPassengersBySubscription } from '@/lib/api/booking';
import { getAccessToken } from '@/utils/tokenStorage';
import type { UserProfile } from '@/lib/types/api/user';
import type { BookingPassenger } from '@/lib/types/api/booking';
import { getSelectedFlightData } from '@/utils/sessionStorage';
import type { SelectedFlightData } from '@/lib/types/sessionStorage';

export const BookingReview = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [passengers, setPassengers] = useState<BookingPassenger[]>([]);
  const [selectedFlightData, setSelectedFlightData] = useState<SelectedFlightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([]);

  const handlePassengerSelection = (passengers: number[]) => {
    setSelectedPassengers(passengers);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Get selected flight data from sessionStorage
        const parsedFlightData = getSelectedFlightData();

        if (parsedFlightData) {
          setSelectedFlightData(parsedFlightData);
        } else {
          console.log('No flight data found in session storage');
        }

        // Get access token
        const token = getAccessToken();

        if (!token) {
          console.error('No access token found');

          return;
        }

        // Call user profile API
        const userResponse = await fetchUserInfo(token);
        setUserProfile(userResponse.data);

        // Call getPassengersBySubscription API if we have subscription data
        let passengersResponse: BookingPassenger[] = [];

        if (parsedFlightData?.searchParams?.subscription_id) {
          const subscriptionId = parsedFlightData.searchParams.subscription_id;
          console.log('Fetching passengers for subscription:', subscriptionId);
          passengersResponse = await getPassengersBySubscription(subscriptionId);
          console.log('Passengers response:', passengersResponse);
        } else {
          console.log('No subscription ID found in flight data:', parsedFlightData);
        }

        // Set passengers from API response
        setPassengers(passengersResponse);

        // If no passengers found from API and we have a subscription ID, log this for debugging
        if (passengersResponse.length === 0 && parsedFlightData?.searchParams?.subscription_id) {
          console.log('No passengers found for subscription:', parsedFlightData.searchParams.subscription_id);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Note: Removed cleanup effect to prevent session storage clearing on page reload
  // Session storage will be cleared manually when navigating to booking success page

  if (loading) {
    return (
      <section>
        <div className="max-w-[90%] mx-auto pb-20 pt-30">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-blue-150 dark:bg-black">
      <div className="max-w-[95%] md:max-w-[90%]  mx-auto pb-20 pt-30">
        <div className="lg:hidden block">
          <TicketCardDetail />
        </div>
        <div className="flex justify-between items-start w-full gap-3 md:gap-6 flex-wrap">
          <div className="w-full lg:w-[calc(50%_-_12px)] xl:w-[calc(60%_-_12px)] ">
            <PassengersDetailsSection
              userProfile={userProfile}
              passengers={passengers}
              selectedFlightData={selectedFlightData}
              onPassengerSelection={handlePassengerSelection}
            />
          </div>
          <div className="w-full lg:w-[calc(50%_-_12px)] xl:w-[calc(40%_-_12px)] ">
            <BookingSummarySection
              selectedFlightData={selectedFlightData}
              selectedPassengers={selectedPassengers}
              passengers={passengers}
              userProfile={userProfile}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
