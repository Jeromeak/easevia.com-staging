'use client';
import { DownloadIcon, SuccessIcon } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { BookingCreationResponse } from '@/lib/types/api/booking';
import { clearFlightSessionStorage, getBookingData } from '@/utils/sessionStorage';
import { useAuth } from '@/context/hooks/useAuth';

const BookingReferenceDetails = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<BookingCreationResponse | null>(null);
  const [, setLoading] = useState(true);

  // Load booking data from sessionStorage
  useEffect(() => {
    const storedBookingData = getBookingData();

    if (storedBookingData) {
      setBookingData(storedBookingData);
    }

    setLoading(false);
  }, []);

  // Clear all session storage after successful booking display
  useEffect(() => {
    // Clear all flight-related session storage after a short delay to ensure data is displayed
    const timer = setTimeout(() => {
      clearFlightSessionStorage();
    }, 2000); // 2 second delay to ensure user sees the data

    return () => clearTimeout(timer);
  }, []);

  const handleGoToBooking = useCallback(() => {
    router.push('/booking');
  }, [router]);

  // Get the first booking item for display (assuming single booking for now)
  const booking = bookingData?.bookings?.[0];

  // Get contact information from user profile or booking data
  const userEmail = user?.email || booking?.user || '';
  const userPhone = user?.phone || '';

  // Format phone number for display
  const formatPhoneNumber = (phone: string | undefined): string => {
    if (!phone) return '';

    // If phone already has +, return as is, otherwise add +
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  return (
    <section>
      <div className="max-w-[90%] mx-auto py-10 md:py-20 lg:pt-30">
        <div className="flex justify-between items-stretch w-full gap-[20px] md:gap-[30px] flex-wrap">
          <div className="w-full lg:w-[calc(50%_-_15px)] rounded-[20px] bg-white dark:bg-gray-300 p-5 md:p-7.5 flex flex-col">
            <div className="flex items-center gap-3 mb-3 md:mb-5">
              <SuccessIcon width="24" height="24" />
              <div className="text-base leading-5 text-Teal-900 dark:text-Teal-500">Booking Reference</div>
            </div>
            <div className="text-[#ACACAC] text-2xl tracking-[0.48px]">{booking?.booking_reference || 'CV2507221'}</div>
            <div className="bg-orange-200 text-black uppercase text-xs px-3 py-1 w-fit rounded-full mt-4 md:mt-5">
              {booking?.status || 'Confirmed'}
            </div>
            <div className="flex flex-col gap-2 md:gap-3 w-full md:w-[80%] mt-4 md:mt-8">
              <div className="flex justify-between">
                <div className="w-[50%] text-gray-290 uppercase">email</div>
                <div className="w-[50%] uppercase text-white break-all">{userEmail || 'N/A'}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-[50%] text-gray-290 uppercase">Mobile</div>
                <div className="w-[50%] uppercase text-white">{formatPhoneNumber(userPhone) || 'N/A'}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-[50%] text-gray-290 uppercase">Attempted</div>
                <div className="w-[50%] uppercase text-white">
                  {booking?.booking_date ? new Date(booking.booking_date).toLocaleDateString() : '7/19/2025'}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[calc(50%_-_15px)] rounded-[20px] bg-white dark:bg-gray-300 p-5 md:p-7.5 flex flex-col">
            <div className="text-base leading-5 text-Teal-900 dark:text-Teal-500">Flight Details</div>
            <div className="flex flex-col gap-2 md:gap-4 w-full md:w-[80%] mt-4 md:mt-8">
              <div className="flex justify-between">
                <div className="w-[50%] text-gray-290 uppercase">Flight</div>
                <div className="w-[50%] uppercase text-white">{booking?.flight_details?.flight_number || 'CV 245'}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-[50%] text-gray-290 uppercase">Route</div>
                <div className="w-[50%] uppercase text-white">
                  {booking?.flight_details?.departure_airport_name && booking?.flight_details?.arrival_airport_name
                    ? `${booking.flight_details.departure_airport_name} - ${booking.flight_details.arrival_airport_name}`
                    : booking?.origin && booking?.destination
                      ? `${booking.origin} - ${booking.destination}`
                      : 'New York (JFK) - London (LHR)'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-[50%] text-gray-290 uppercase">Date</div>
                <div className="w-[50%] uppercase text-white">
                  {booking?.flight_details?.departure_time
                    ? new Date(booking.flight_details.departure_time).toLocaleDateString()
                    : 'July 25, 2025'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-[50%] text-gray-290 uppercase">Time</div>
                <div className="w-[50%] uppercase text-white">
                  {booking?.flight_details?.departure_time
                    ? new Date(booking.flight_details.departure_time).toLocaleTimeString()
                    : '14:30 - 02:45 +1'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-[30%] md:w-[50%] text-neutral-50/50 dark:text-gray-290 uppercase">Seat</div>
                <div className="w-[70%] md:w-[50%] uppercase text-neutral-50 dark:text-white">12A (Economy)</div>
              </div>
              {booking?.flight_details?.stops !== undefined && booking.flight_details.stops > 0 && (
                <div className="flex justify-between">
                  <div className="w-[50%] text-gray-290 uppercase">Stops</div>
                  <div className="w-[50%] uppercase text-white">
                    {booking.flight_details.stops} stop{booking.flight_details.stops > 1 ? 's' : ''}
                    {booking.flight_details.stop_airports && booking.flight_details.stop_airports.length > 0 && (
                      <span className="text-sm text-gray-400 ml-2">
                        (Via: {booking.flight_details.stop_airports.join(', ')})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-[calc(50%_-_15px)] rounded-[20px] bg-gray-300 p-5 md:p-[30px] flex flex-col">
            <div className="text-base leading-5 text-Teal-500">
              Passenger Information
              {booking?.passenger_details && booking.passenger_details.length > 1 && (
                <span className="text-sm text-gray-290 ml-2">({booking.passenger_details.length} passengers)</span>
              )}
            </div>
            <div className="flex flex-col gap-4 w-[100%] mt-4 md:mt-8">
              {booking?.passenger_details && booking.passenger_details.length > 0 ? (
                booking.passenger_details.map((passenger, index) => (
                  <div key={passenger.id || index} className="border-b border-gray-400 pb-4 last:border-b-0">
                    {booking.passenger_details.length > 1 && (
                      <div className="text-sm text-Teal-500 mb-3 font-medium">Passenger {index + 1}</div>
                    )}
                    <div className="flex justify-between mb-2">
                      <div className="w-[50%] text-gray-290 uppercase">Name</div>
                      <div className="w-[50%] uppercase text-white">{passenger.name}</div>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div className="w-[50%] text-gray-290 uppercase">Passport</div>
                      <div className="w-[50%] uppercase text-white">{passenger.passport_number}</div>
                    </div>
                    {passenger.nationality && (
                      <div className="flex justify-between mb-2">
                        <div className="w-[50%] text-gray-290 uppercase">Nationality</div>
                        <div className="w-[50%] uppercase text-white">{passenger.nationality}</div>
                      </div>
                    )}
                    {passenger.date_of_birth && (
                      <div className="flex justify-between mb-2">
                        <div className="w-[50%] text-gray-290 uppercase">Date of Birth</div>
                        <div className="w-[50%] uppercase text-white">
                          {new Date(passenger.date_of_birth).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {index === 0 && (
                      <>
                        <div className="flex justify-between mb-2">
                          <div className="w-[50%] text-gray-290 uppercase">Email</div>
                          <div className="w-[50%] uppercase text-white break-all">
                            {passenger?.email || userEmail || 'N/A'}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="w-[50%] text-gray-290 uppercase">Phone</div>
                          <div className="w-[50%] uppercase text-white">{formatPhoneNumber(userPhone) || 'N/A'}</div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between">
                    <div className="w-[50%] text-gray-290 uppercase">Name</div>
                    <div className="w-[50%] uppercase text-white">{user?.name || 'N/A'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-[50%] text-gray-290 uppercase">Email</div>
                    <div className="w-[50%] uppercase text-white break-all">{userEmail || 'N/A'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-[50%] text-gray-290 uppercase">Phone</div>
                    <div className="w-[50%] uppercase text-white">{formatPhoneNumber(userPhone) || 'N/A'}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full lg:w-[calc(50%_-_15px)] rounded-[20px] bg-white dark:bg-gray-300 gap-4 p-5 md:p-7.5 flex flex-col">
            <button className="bg-transparent border cursor-pointer outline-none border-Teal-900 dark:border-Teal-500 text-Teal-900 dark:text-Teal-500 w-full py-3 gap-2 px-8 flex items-center justify-center rounded-full">
              <DownloadIcon />
              Download E-Ticket
            </button>
            <button
              onClick={handleGoToBooking}
              type="button"
              className="px-8 py-3 cursor-pointer outline-none bg-orange-200 text-black font-medium rounded-full "
            >
              Go to Booking
            </button>
            <div className="text-[#ACACAC] text-sm tracking-[0.28px]">Check-in opens 24 hours before departure</div>
          </div>
          <div className="w-full rounded-[20px] bg-white dark:bg-gray-300 gap-4 p-5 md:p-7.5 flex flex-col">
            <div className="text-base leading-5 text-Teal-900 dark:text-Teal-500">Important Information</div>
            <ul className="flex gap-2 flex-col list-disc pl-5 text-neutral-50/50 dark:text-gray-290 uppercase text-sm md:text-base">
              <li> Please arrive at the airport at least 2 hours before international flights</li>
              <li> Valid passport required for international travel</li>
              <li> Check-in online to save time at the airport</li>
              <li> Contact customer service for any changes or cancellations</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingReferenceDetails;
