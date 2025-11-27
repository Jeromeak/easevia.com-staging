'use client';
import { SyncIcon, WarningIcon } from '@/icons/icon';
import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { TicketCardDetail } from './TicketCard';
import { CustomCheckbox } from '@/common/components/CustomCheckBox';
import { Button } from '@/app/authentication/components/Button';
import { useRouter } from 'next/navigation';
import { ViewSummaryModal } from '../view-summary-modal/view-summary-modal';
import Link from 'next/link';
import { createBooking } from '@/lib/api/booking';
import type {
  BookingCreationRequest,
  BookingCreationResponse,
  BookingPassenger,
  TravelerPayload,
  FlightOfferPricingRequest,
  FlightOfferPricingPrice,
} from '@/lib/types/api/booking';
import type { UserProfile } from '@/lib/types/api/user';
import type { SelectedFlightData } from '@/lib/types/sessionStorage';
import { setBookingData } from '@/utils/sessionStorage';
import { extractFlightData } from '@/utils/flightUtils';
import { getCountryISOCode } from '@/lib/constants/countryCodes';
import moment from 'moment';

interface BookingSummarySectionProps {
  selectedFlightData?: SelectedFlightData | null;
  selectedPassengers?: number[];
  passengers?: BookingPassenger[];
  userProfile?: UserProfile | null;
}

export const BookingSummarySection = ({
  selectedFlightData,
  selectedPassengers = [],
  passengers,
  userProfile,
}: BookingSummarySectionProps) => {
  // Log the data for debugging
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [canConfirm, setCanConfirm] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showValidationMessages, setShowValidationMessages] = useState<boolean>(false);
  const router = useRouter();

  // Helper function to format date to "DD MMM" format
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';

    return moment(dateString).format('DD MMM').toUpperCase();
  };

  // Get validation messages for user guidance
  const getValidationMessages = useCallback(() => {
    const messages = [];

    if (selectedPassengers.length === 0) {
      messages.push('Please select at least one passenger');
    }

    if (!termsAccepted) {
      messages.push('Please accept the Terms & Conditions');
    }

    return messages;
  }, [selectedPassengers.length, termsAccepted]);

  const handleOpenSummary = useCallback(() => {
    setIsSummaryOpen(true);
  }, []);

  const handleCloseSummary = useCallback(() => {
    setIsSummaryOpen(false);
    // setCanConfirm(false);
  }, []);

  const handleEnableConfirm = useCallback((value: boolean) => {
    setCanConfirm(value);
  }, []);

  const handleTermsAcceptance = useCallback((accepted: boolean) => {
    setTermsAccepted(accepted);
  }, []);

  // Update canConfirm based on both conditions
  const updateCanConfirm = useCallback(() => {
    const hasSelectedPassengers = selectedPassengers.length > 0;
    const canConfirmBooking = hasSelectedPassengers && termsAccepted;
    setCanConfirm(canConfirmBooking);
  }, [selectedPassengers, termsAccepted]);

  // Update canConfirm whenever dependencies change
  React.useEffect(() => {
    updateCanConfirm();
  }, [updateCanConfirm]);

  // Hide validation messages when requirements are met
  React.useEffect(() => {
    if (canConfirm && showValidationMessages) {
      setShowValidationMessages(false);
    }
  }, [canConfirm, showValidationMessages]);

  const getPassengerById = useCallback(
    (passengerId: number) => passengers?.find((passenger) => passenger.id === passengerId),
    [passengers]
  );

  const selectedPassengerDetails = useMemo(
    () =>
      selectedPassengers
        .map((passengerId) => getPassengerById(passengerId))
        .filter((passenger): passenger is BookingPassenger => Boolean(passenger)),
    [selectedPassengers, getPassengerById]
  );

  const splitFullName = useCallback((fullName?: string) => {
    const cleanedName = fullName?.trim();

    if (!cleanedName) {
      return { firstName: 'Traveler', lastName: 'Guest' };
    }

    const parts = cleanedName.split(/\s+/);
    const firstName = parts[0] || 'Traveler';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    return { firstName, lastName };
  }, []);

  const mapTravelerType = useCallback((passenger?: BookingPassenger) => {
    const relationship = passenger?.relationship_with_user?.toLowerCase();

    if (relationship?.includes('infant')) {
      return 'INFANT';
    }

    if (relationship?.includes('child')) {
      return 'CHILD';
    }

    return 'ADULT';
  }, []);

  const parsePhoneNumber = useCallback(
    (phone?: string) => {
      const fallbackNumber = userProfile?.phone || phone || '';
      const digits = fallbackNumber.replace(/[^\d]/g, '');

      if (!digits) {
        return { countryCallingCode: '91', number: '0000000000' };
      }

      if (digits.length <= 10) {
        return { countryCallingCode: '91', number: digits };
      }

      return {
        countryCallingCode: digits.slice(0, digits.length - 10) || '91',
        number: digits.slice(-10),
      };
    },
    [userProfile?.phone]
  );

  const buildTravelerPayloads = useCallback((): TravelerPayload[] => {
    return selectedPassengerDetails.map((passenger) => {
      const travelerId = passenger.id.toString();
      const { firstName, lastName } = splitFullName(passenger.name);
      const phoneInfo = parsePhoneNumber(passenger.mobile_number);

      const traveler: TravelerPayload = {
        id: travelerId,
        dateOfBirth: passenger.date_of_birth || '1990-01-01',
        name: {
          firstName: firstName.toUpperCase(),
          lastName: lastName.toUpperCase(),
        },
        gender: passenger.gender?.toUpperCase() || 'UNSPECIFIED',
        contact: {
          emailAddress: passenger.email || userProfile?.email || 'support@easevia.com',
          phones: [
            {
              deviceType: 'MOBILE',
              countryCallingCode: phoneInfo.countryCallingCode,
              number: phoneInfo.number,
            },
          ],
        },
      };

      if (passenger.passport_number) {
        traveler.documents = [
          {
            documentType: 'PASSPORT',
            number: passenger.passport_number,
            issuanceCountry: getCountryISOCode(passenger.passport_issuing_country || passenger.nationality),
            expiryDate: passenger.passport_expiry || '2030-12-31',
            nationality: getCountryISOCode(passenger.nationality),
            holder: true,
          },
        ];
      }

      return traveler;
    });
  }, [parsePhoneNumber, selectedPassengerDetails, splitFullName, userProfile?.email]);

  const buildFlightOffersPayload = useCallback(
    (travelerIds: string[]): FlightOfferPricingRequest[] => {
      if (!selectedFlightData) {
        return [];
      }

      const collectFlights = (): SelectedFlightData['selectedFlight'][] => {
        if (selectedFlightData.selectedFlight) {
          return [selectedFlightData.selectedFlight];
        }

        const flights = [];

        if (selectedFlightData.selectedOutboundFlight) {
          flights.push(selectedFlightData.selectedOutboundFlight);
        }

        if (selectedFlightData.selectedReturnFlight) {
          flights.push(selectedFlightData.selectedReturnFlight);
        }

        return flights;
      };

      const flights = collectFlights();

      if (flights.length === 0) {
        return [];
      }

      const itineraries = flights.map((flight) => ({
        duration: flight?.duration,
        segments:
          flight?.segments.map((segment) => ({
            departure: segment.departure,
            arrival: segment.arrival,
            carrierCode: segment.carrierCode,
            number: segment.number,
            aircraft: segment.aircraft,
            operating: segment.operating,
            duration: segment.duration,
            id: segment.id,
            numberOfStops: segment.numberOfStops,
            blacklistedInEU: segment.blacklistedInEU,
            airlineName: segment.airlineName,
            fareDetails: segment.fareDetails,
          })) || [],
      }));

      const referenceFlight = flights[0];

      const aggregatedSegments = flights.flatMap((flight) => (flight?.segments ? [...flight.segments] : [])) ?? [];

      const uniqueAirlineCodes = new Set<string>();
      flights.forEach((flight) => {
        flight?.validatingAirlineCodes?.forEach((code) => {
          if (code) {
            uniqueAirlineCodes.add(code);
          }
        });

        flight?.segments?.forEach((segment) => {
          if (segment.carrierCode) {
            uniqueAirlineCodes.add(segment.carrierCode);
          }
        });
      });

      const validatingAirlineCodes = Array.from(uniqueAirlineCodes);

      const computeAggregatedPrice = () => {
        let currency = referenceFlight?.price?.currency || 'USD';
        let totalAmount = 0;
        let baseAmount = 0;
        let hasBaseAmount = true;
        const feesMap = new Map<string, number>();

        flights.forEach((flight) => {
          const price = flight?.price;

          if (!price) {
            hasBaseAmount = false;

            return;
          }

          if (price.currency) {
            currency = price.currency;
          }

          const totalValue = parseFloat(price.total ?? '0');

          if (!Number.isNaN(totalValue)) {
            totalAmount += totalValue;
          }

          if (price.base) {
            const baseValue = parseFloat(price.base);

            if (!Number.isNaN(baseValue)) {
              baseAmount += baseValue;
            } else {
              hasBaseAmount = false;
            }
          } else {
            hasBaseAmount = false;
          }

          price.fees?.forEach((fee) => {
            const feeAmount = parseFloat(fee.amount ?? '0');

            if (!Number.isNaN(feeAmount)) {
              feesMap.set(fee.type, (feesMap.get(fee.type) || 0) + feeAmount);
            }
          });
        });

        const formattedTotal = totalAmount ? totalAmount.toFixed(2) : '0.00';
        const priceSummary: FlightOfferPricingPrice = {
          currency,
          total: formattedTotal,
          grandTotal: formattedTotal,
        };

        if (hasBaseAmount && baseAmount > 0) {
          priceSummary.base = baseAmount.toFixed(2);
        }

        if (feesMap.size > 0) {
          priceSummary.fees = Array.from(feesMap.entries()).map(([type, amount]) => ({
            type,
            amount: amount.toFixed(2),
          }));
        }

        const travelerCount = Math.max(travelerIds.length, 1);
        const perTravelerTotal = totalAmount / travelerCount;
        const perTravelerBase = hasBaseAmount && baseAmount > 0 ? baseAmount / travelerCount : undefined;

        const travelerPrice = {
          currency,
          total: perTravelerTotal ? perTravelerTotal.toFixed(2) : priceSummary.total,
          ...(perTravelerBase !== undefined ? { base: perTravelerBase.toFixed(2) } : {}),
        };

        return {
          priceSummary,
          travelerPrice,
        };
      };

      const { priceSummary, travelerPrice } = computeAggregatedPrice();

      const travelerFareDetails = aggregatedSegments.map((segment) => ({
        segmentId: segment.fareDetails?.segmentId || segment.id || '',
        cabin: segment.fareDetails?.cabin,
        fareBasis: segment.fareDetails?.fareBasis,
        brandedFare: segment.fareDetails?.brandedFare,
        brandedFareLabel: segment.fareDetails?.brandedFareLabel,
        class: segment.fareDetails?.class,
        includedCheckedBags: segment.fareDetails?.includedCheckedBags,
        includedCabinBags: segment.fareDetails?.includedCabinBags,
      }));

      const travelerPricings = travelerIds.map((travelerId) => ({
        travelerId,
        fareOption: 'STANDARD',
        travelerType: mapTravelerType(
          selectedPassengerDetails.find((passenger) => passenger.id.toString() === travelerId)
        ),
        price: travelerPrice,
        fareDetailsBySegment: travelerFareDetails,
      }));

      return [
        {
          type: 'flight-offer',
          id: referenceFlight?.id || '1',
          source: referenceFlight?.source || 'GDS',
          instantTicketingRequired: referenceFlight?.instantTicketingRequired ?? false,
          nonHomogeneous: referenceFlight?.nonHomogeneous ?? false,
          oneWay: selectedFlightData.tripType !== 'ROUND_TRIP',
          lastTicketingDate: referenceFlight?.lastTicketingDate || selectedFlightData.searchParams.departure_date,
          lastTicketingDateTime:
            referenceFlight?.lastTicketingDateTime || selectedFlightData.searchParams.departure_date,
          numberOfBookableSeats: referenceFlight?.numberOfBookableSeats || Math.max(travelerIds.length, 1),
          itineraries,
          price: priceSummary,
          pricingOptions: referenceFlight?.pricingOptions || {
            fareType: ['PUBLISHED'],
            includedCheckedBagsOnly: true,
          },
          validatingAirlineCodes: validatingAirlineCodes.length > 0 ? validatingAirlineCodes : undefined,
          travelerPricings,
        },
      ];
    },
    [mapTravelerType, selectedFlightData, selectedPassengerDetails]
  );

  const handleConfirmBooking = useCallback(async () => {
    // Show validation messages if requirements are not met
    if (!canConfirm) {
      setShowValidationMessages(true);

      return;
    }

    if (!selectedFlightData) {
      return;
    }

    const travelerPayloads = buildTravelerPayloads();

    if (travelerPayloads.length === 0) {
      setErrorMessage('Unable to load passenger details. Please reselect passengers.');

      return;
    }

    const flightOffersPayload = buildFlightOffersPayload(travelerPayloads.map((traveler) => traveler.id));

    if (flightOffersPayload.length === 0) {
      setErrorMessage('Unable to prepare flight information. Please try again.');

      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      // Prepare the booking request payload
      const bookingRequest: BookingCreationRequest = {
        subscription_id: selectedFlightData.searchParams.subscription_id,
        passenger_ids: travelerPayloads.map((traveler) => traveler.id),
        trip_type: selectedFlightData.tripType as 'ONE_WAY' | 'ROUND_TRIP',
        data: {
          type: 'flight-order',
          flightOffers: flightOffersPayload,
          travelers: travelerPayloads,
        },
      };

      // Call the createBooking API
      const response: BookingCreationResponse = await createBooking(bookingRequest);

      // Validate response before redirecting
      if (!response || !response.bookings || response.bookings.length === 0) {
        throw new Error('Booking was created but no booking details were returned. Please contact support.');
      }

      // Store the booking data in sessionStorage for the success page
      setBookingData(response);

      // Only redirect on successful booking creation
      router.push('/booking-success');
    } catch (error) {
      console.error('Failed to create booking:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create booking. Please try again.';
      setErrorMessage(errorMsg);
      // Do NOT redirect on error - stay on the page to show the error message
    } finally {
      setIsLoading(false);
    }
  }, [buildFlightOffersPayload, buildTravelerPayloads, canConfirm, router, selectedFlightData, selectedPassengers]);

  return (
    <Fragment>
      <div className="hidden lg:flex flex-col w-full">
        <div className="bg-Teal-500 px-4 flex justify-center items-center flex-col py-5 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="text-xl text-white">
              {selectedFlightData?.searchParams?.origin || 'Singapore'} (
              {(() => {
                const flight = selectedFlightData?.selectedFlight || selectedFlightData?.selectedOutboundFlight;

                const flightData = flight ? extractFlightData(flight) : null;

                return flightData?.departure_airport || 'SIN';
              })()}
              )
            </div>
            <SyncIcon />
            <div className="text-xl text-white">
              {selectedFlightData?.searchParams?.destination || 'Tokyo'},{' '}
              {(() => {
                const flight = selectedFlightData?.selectedFlight || selectedFlightData?.selectedOutboundFlight;

                const flightData = flight ? extractFlightData(flight) : null;

                return flightData?.arrival_airport || 'TYO';
              })()}
            </div>
          </div>
          <div className="text-sm text-white mt-5">
            {formatDate(selectedFlightData?.searchParams?.departure_date) || '18 JUL'} -{' '}
            {(() => {
              // For one-way trips: use arrival date from selectedFlight or selectedOutboundFlight
              if (selectedFlightData?.tripType === 'ONE_WAY' || !selectedFlightData?.selectedReturnFlight) {
                const flight = selectedFlightData?.selectedFlight || selectedFlightData?.selectedOutboundFlight;
                const flightData = flight ? extractFlightData(flight) : null;

                return flightData?.arrival_time ? formatDate(flightData.arrival_time) : '24 JUL';
              }

              // For round trips: use arrival date from selectedReturnFlight (last flight in return array)
              if (selectedFlightData?.selectedReturnFlight) {
                const returnFlightData = extractFlightData(selectedFlightData.selectedReturnFlight);

                return returnFlightData?.arrival_time ? formatDate(returnFlightData.arrival_time) : '24 JUL';
              }

              return '24 JUL';
            })()}
            ,{' '}
            {(() => {
              const adult = selectedFlightData?.searchParams?.adult || 1;
              const child = selectedFlightData?.searchParams?.child || 0;
              const infant = selectedFlightData?.searchParams?.infant || 0;

              const total = adult + child + infant;

              return total;
            })()}{' '}
            Passengers,{' '}
            {(() => {
              const flight = selectedFlightData?.selectedFlight || selectedFlightData?.selectedOutboundFlight;

              const flightData = flight ? extractFlightData(flight) : null;

              return flightData?.travelClass || 'Economy';
            })()}
          </div>
        </div>
      </div>
      <TicketCardDetail selectedFlightData={selectedFlightData} />
      <div className="flex items-center gap-3 px-4 rounded-[4px] py-2 bg-orange-300 mt-3">
        <div>
          <WarningIcon className="text-[#F7CB3C]" />
        </div>
        <p className="text-sm  text-[#312D27] dark:text-gray-460 leading-5">
          You have 2 trips remaining based on your subscription pack.
        </p>
      </div>
      <div className="flex items-center gap-3 mt-4 md:mt-8">
        <CustomCheckbox
          label=""
          className="!border-Teal-500 !rounded-[8px]"
          checked={termsAccepted}
          onChange={handleTermsAcceptance}
        >
          <div className="text-[#8E8E8E] text-base">
            By proceeding with this booking, <br /> I agree to Easevia{' '}
            <Link href={'/terms-and-conditions'} className="text-Teal-500">
              Terms & Conditions
            </Link>
          </div>
        </CustomCheckbox>
      </div>
      <Button onClick={handleOpenSummary} className=" !mt-5" label="View Summary" />
      <div className="text-center text-Light text-base mt-3">Please review your details before booking.</div>
      <Button
        onClick={handleConfirmBooking}
        className="!bg-orange-200 !text-black !mt-5"
        disabled={isLoading}
        label={isLoading ? 'Creating Booking...' : 'Confirm Booking'}
      />

      {/* Validation messages - only show after user clicks button */}
      {showValidationMessages && !canConfirm && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-amber-800 text-sm">
            <div className="font-medium mb-1">To proceed with booking:</div>
            <ul className="list-disc list-inside space-y-1">
              {getValidationMessages().map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Error message display - shown below the Confirm Booking button */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <WarningIcon className="text-red-600 dark:text-red-400 w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-red-800 dark:text-red-300 font-medium text-sm mb-1">Booking Failed</div>
              <div className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</div>
            </div>
          </div>
        </div>
      )}

      <ViewSummaryModal
        isOpen={isSummaryOpen}
        onClose={handleCloseSummary}
        onEnableConfirm={handleEnableConfirm}
        selectedFlightData={selectedFlightData}
      />
    </Fragment>
  );
};
