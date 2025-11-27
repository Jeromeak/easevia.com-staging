import api from './axios';
import type {
  DestinationBySubscriptionResponse,
  FlightSearchParams,
  FlightSearchResponse,
  FlightItem,
  FlightSegment,
  BookingPassenger,
  BookingCreationRequest,
  BookingCreationResponse,
  BookingItem,
  ActiveTicket,
  BookingResponse,
  SubscriptionAirport,
  SegmentAirport,
  Aircraft,
  OperatingCarrier,
  BaggageInfo,
  FareDetails,
  Amenity,
  TravelerPricingPayload,
} from '@/lib/types/api/booking';
import { AxiosError } from 'axios';
import { getErrorMessage } from '@/lib/utils/error';

/**
 * Get allowed origin and destination airports for a given subscription.
 */
export const getDestinationBySubscription = async (
  subscriptionId: string | number
): Promise<DestinationBySubscriptionResponse> => {
  try {
    // The API expects the subscription ID as-is, no need to convert
    const response = await api.get<DestinationBySubscriptionResponse>(`/subscription/${subscriptionId}/airports/`);

    return response.data;
  } catch (error) {
    handleBookingError(error, 'Failed to fetch destination airports for subscription');

    return {
      origin_airports: [],
      destination_airports: [],
    } as DestinationBySubscriptionResponse;
  }
};

/**
 * Search available flights based on subscription rules and filters.
 */

type RawFlightSegment = {
  departure: SegmentAirport;
  arrival: SegmentAirport;
  carrierCode: string;
  number: string;
  aircraft?: string | Aircraft | { code?: string; model?: string; description?: string };
  operating?: OperatingCarrier;
  duration: string;
  id?: string;
  numberOfStops?: number;
  blacklistedInEU?: boolean;
  airlineName?: string;
  fareDetails?: FareDetails;
  class?: string;
  fareBasis?: string;
  brandedFare?: string;
  brandedFareLabel?: string;
  includedCheckedBags?: BaggageInfo;
  includedCabinBags?: BaggageInfo;
  amenities?: Amenity[];
};

type RawFlightItinerary = {
  duration?: string;
  segments?: RawFlightSegment[];
};

type RawFlightPrice = {
  currency: string;
  total: string;
  base?: string;
  grandTotal?: string;
  fees?: Array<{
    amount: string;
    type: string;
  }>;
};

type RawFlightOffer = {
  id?: string;
  type?: string;
  source?: string;
  itineraries?: RawFlightItinerary[];
  price?: RawFlightPrice;
  validatingAirlineCodes?: string[];
  instantTicketingRequired?: boolean;
  nonHomogeneous?: boolean;
  oneWay?: boolean;
  lastTicketingDate?: string;
  lastTicketingDateTime?: string;
  numberOfBookableSeats?: number;
  pricingOptions?: {
    fareType?: string[];
    includedCheckedBagsOnly?: boolean;
  };
  travelerPricings?: TravelerPricingPayload[];
};

type RawFlightOfferContainer = {
  outbound?: RawFlightOffer[];
  return?: RawFlightOffer[];
};

type RawFlightSearchResponse = {
  success?: boolean;
  data?: RawFlightOfferContainer;
} & RawFlightOfferContainer;

const resolveFlightOfferContainer = (data: unknown): RawFlightOfferContainer | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const candidates = [
    data as Record<string, unknown>,
    (data as Record<string, unknown>).data as Record<string, unknown> | undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') {
      continue;
    }

    if (Array.isArray(candidate.outbound)) {
      return {
        outbound: candidate.outbound as RawFlightOffer[],
        return: Array.isArray(candidate.return) ? (candidate.return as RawFlightOffer[]) : undefined,
      };
    }
  }

  return null;
};

const normalizeAircraft = (aircraft: RawFlightSegment['aircraft']): Aircraft => {
  if (!aircraft) {
    return { code: 'UNKNOWN' };
  }

  if (typeof aircraft === 'string') {
    return { code: aircraft };
  }

  return {
    code: aircraft.code || aircraft.model || aircraft.description || 'UNKNOWN',
    model: aircraft.model,
    description: aircraft.description,
  };
};

const normalizeFareDetails = (segment: RawFlightSegment, fallbackId: string): FareDetails => {
  if (segment.fareDetails) {
    return {
      segmentId: segment.fareDetails.segmentId || fallbackId,
      cabin: segment.fareDetails.cabin || 'ECONOMY',
      fareBasis: segment.fareDetails.fareBasis || segment.fareBasis || '',
      brandedFare: segment.fareDetails.brandedFare || segment.brandedFare,
      brandedFareLabel: segment.fareDetails.brandedFareLabel || segment.brandedFareLabel,
      class: segment.fareDetails.class || segment.class || '',
      includedCheckedBags: segment.fareDetails.includedCheckedBags || segment.includedCheckedBags,
      includedCabinBags: segment.fareDetails.includedCabinBags || segment.includedCabinBags,
      amenities: segment.fareDetails.amenities || segment.amenities,
    };
  }

  return {
    segmentId: fallbackId,
    cabin: 'ECONOMY',
    fareBasis: segment.fareBasis || '',
    brandedFare: segment.brandedFare,
    brandedFareLabel: segment.brandedFareLabel,
    class: segment.class || '',
    includedCheckedBags: segment.includedCheckedBags,
    includedCabinBags: segment.includedCabinBags,
    amenities: segment.amenities,
  };
};

const normalizeSegment = (segment: RawFlightSegment, fallbackAirline?: string): FlightSegment | null => {
  if (!segment?.departure || !segment?.arrival) {
    return null;
  }

  const segmentId = segment.id || `${segment.carrierCode}-${segment.number}`;

  return {
    departure: segment.departure,
    arrival: segment.arrival,
    carrierCode: segment.carrierCode,
    number: segment.number,
    aircraft: normalizeAircraft(segment.aircraft),
    operating: segment.operating || { carrierCode: segment.carrierCode },
    duration: segment.duration,
    id: segmentId,
    numberOfStops: typeof segment.numberOfStops === 'number' ? segment.numberOfStops : 0,
    blacklistedInEU: Boolean(segment.blacklistedInEU),
    fareDetails: normalizeFareDetails(segment, segmentId),
    airlineName: segment.airlineName || fallbackAirline || segment.carrierCode,
  };
};

const normalizeFlightOfferList = (offers?: RawFlightOffer[]): FlightItem[] => {
  if (!Array.isArray(offers)) {
    return [];
  }

  return offers
    .map((offer) => {
      if (!offer?.itineraries || offer.itineraries.length === 0) {
        return null;
      }

      const itinerary = offer.itineraries[0];

      if (!itinerary?.segments || itinerary.segments.length === 0) {
        return null;
      }

      const normalizedSegments = itinerary.segments
        .map((segment) => normalizeSegment(segment, offer.validatingAirlineCodes?.[0]))
        .filter((segment): segment is FlightSegment => Boolean(segment));

      if (normalizedSegments.length === 0) {
        return null;
      }

      const flightItem: FlightItem = {
        id: offer.id,
        offerType: offer.type,
        source: offer.source,
        instantTicketingRequired: offer.instantTicketingRequired,
        nonHomogeneous: offer.nonHomogeneous,
        oneWay: offer.oneWay,
        lastTicketingDate: offer.lastTicketingDate,
        lastTicketingDateTime: offer.lastTicketingDateTime,
        numberOfBookableSeats: offer.numberOfBookableSeats,
        pricingOptions: offer.pricingOptions,
        validatingAirlineCodes: offer.validatingAirlineCodes,
        travelerPricings: offer.travelerPricings,
        duration: itinerary.duration || normalizedSegments[0].duration,
        segments: normalizedSegments,
        price: offer.price
          ? {
              currency: offer.price.currency,
              total: offer.price.total,
              base: offer.price.base,
              grandTotal: offer.price.grandTotal,
              fees: offer.price.fees,
            }
          : undefined,
      };

      return flightItem;
    })
    .filter((item): item is FlightItem => Boolean(item));
};

const normalizeFlightSearchResponse = (data: RawFlightSearchResponse): FlightSearchResponse => {
  const container = resolveFlightOfferContainer(data) || {};
  const outboundFlights = normalizeFlightOfferList(container.outbound);
  const returnFlights = normalizeFlightOfferList(container.return);

  return {
    outbound: outboundFlights,
    return: returnFlights.length > 0 ? returnFlights : undefined,
  };
};

export const searchFlights = async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
  try {
    const response = await api.get<RawFlightSearchResponse | FlightSearchResponse>('/booking/flight/search', {
      params,
    });

    const data = response.data;

    const container = resolveFlightOfferContainer(data);

    if (container) {
      const normalized = normalizeFlightSearchResponse(data);

      if (normalized.outbound.length === 0 && (!normalized.return || normalized.return.length === 0)) {
        throw new Error('No flights found for the selected criteria. Please try different dates or routes.');
      }

      return normalized;
    }

    // Fallback for legacy responses (already in expected format or double arrays)
    const legacyData = data as
      | FlightSearchResponse
      | {
          outbound?: FlightItem[] | FlightItem[][];
          return?: FlightItem[] | FlightItem[][];
        };

    const flattenLegacyFlights = (flights?: FlightItem[] | FlightItem[][]): FlightItem[] => {
      if (!flights) return [];

      if (Array.isArray(flights) && flights.length > 0 && Array.isArray(flights[0])) {
        return (flights as FlightItem[][]).flat().filter(Boolean);
      }

      return (flights as FlightItem[]).filter(Boolean);
    };

    return {
      outbound: flattenLegacyFlights(legacyData.outbound),
      return: flattenLegacyFlights(legacyData.return),
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    handleBookingError(error, 'Failed to search flights');

    // Provide more specific error message
    let userFriendlyMessage = errorMessage;

    if (error instanceof AxiosError) {
      // Handle specific HTTP status codes
      if (error.response?.status === 400) {
        userFriendlyMessage = 'Invalid search parameters. Please check your search criteria and try again.';
      } else if (error.response?.status === 401) {
        userFriendlyMessage = 'Authentication required. Please log in and try again.';
      } else if (error.response?.status === 404) {
        userFriendlyMessage = 'No flights found matching your criteria. Please try different search parameters.';
      } else if (error.response?.status === 500) {
        userFriendlyMessage = 'Server error. Please try again later.';
      } else if (error.response?.status === 503) {
        userFriendlyMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (!error.response) {
        userFriendlyMessage = 'Network error. Please check your internet connection and try again.';
      }
    }

    throw new Error(userFriendlyMessage || 'Failed to search flights. Please try again.');
  }
};

/**
 * Get passenger list linked to a subscription.
 */
export const getPassengersBySubscription = async (subscriptionId: string | number): Promise<BookingPassenger[]> => {
  try {
    const response = await api.get<BookingPassenger[]>(`/subscription/${subscriptionId}/passenger/`);

    return response.data;
  } catch (error) {
    handleBookingError(error, 'Failed to fetch passengers for subscription');

    return [];
  }
};

/**
 * Create a new booking under a subscription.
 */
export const createBooking = async (payload: BookingCreationRequest): Promise<BookingCreationResponse> => {
  try {
    const response = await api.post<BookingCreationResponse>('/booking/', payload);

    return response.data;
  } catch (error) {
    handleBookingError(error, 'Failed to create booking');

    // Extract user-friendly error message
    let userFriendlyMessage = 'Failed to create booking. Please try again.';

    if (error instanceof AxiosError) {
      // Check if there's a specific error message in the response
      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle different error response formats
        if (typeof errorData === 'string') {
          userFriendlyMessage = errorData;
        } else if (errorData.error) {
          userFriendlyMessage = errorData.error;
        } else if (errorData.message) {
          userFriendlyMessage = errorData.message;
        } else if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
          userFriendlyMessage = errorData.details[0];
        }

        // Handle specific HTTP status codes
        if (error.response.status === 400) {
          userFriendlyMessage =
            userFriendlyMessage || 'Invalid booking data. Please check your information and try again.';
        } else if (error.response.status === 401) {
          userFriendlyMessage = 'Authentication required. Please log in and try again.';
        } else if (error.response.status === 403) {
          userFriendlyMessage = 'You do not have permission to create this booking.';
        } else if (error.response.status === 404) {
          userFriendlyMessage = 'Booking service not found. Please try again later.';
        } else if (error.response.status === 500) {
          userFriendlyMessage = 'Server error. Please try again later.';
        } else if (!error.response) {
          userFriendlyMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
    } else if (error instanceof Error) {
      userFriendlyMessage = error.message;
    }

    // Throw the error so the component can catch it
    throw new Error(userFriendlyMessage);
  }
};

/**
 * Get booking details by one or multiple IDs.
 */
export const getBookingDetails = async (bookingIds: number[]): Promise<BookingItem[]> => {
  try {
    const idsParam = bookingIds.join(',');
    const response = await api.get<BookingItem[]>(`/booking/${idsParam}/`);

    return response.data;
  } catch (error) {
    handleBookingError(error, 'Failed to fetch booking details');

    return [];
  }
};

/**
 * Get a single booking by ID.
 */
export const getBookingById = async (bookingId: number): Promise<BookingItem | null> => {
  try {
    const response = await api.get<BookingItem[]>(`/booking/${bookingId}/`);

    return response.data[0] || null;
  } catch (error) {
    handleBookingError(error, 'Failed to fetch booking details');

    return null;
  }
};

/**
 * Get active tickets for the authenticated user.
 * Falls back to getAllBookings if the active-ticket endpoint is not available.
 */
export const getActiveTickets = async (): Promise<ActiveTicket[]> => {
  try {
    const response = await api.get<ActiveTicket[]>('/booking/active-ticket/');

    return response.data;
  } catch (error) {
    // If 404, the endpoint might not exist - try using getAllBookings instead
    if (error instanceof AxiosError && error.response?.status === 404) {
      try {
        const allBookings = await getAllBookings();

        // Return upcoming bookings as active tickets
        return allBookings.upcoming || [];
      } catch (fallbackError) {
        // If fallback also fails, log and return empty array
        handleBookingError(fallbackError, 'Failed to fetch active tickets (fallback)');

        return [];
      }
    }

    // For other errors, log and return empty array
    handleBookingError(error, 'Failed to fetch active tickets');

    return [];
  }
};

/**
 * Get all bookings organized by status (upcoming, completed, cancelled).
 */
export const getAllBookings = async (): Promise<BookingResponse> => {
  try {
    const response = await api.get<BookingResponse>('/booking/');

    return response.data;
  } catch (error) {
    handleBookingError(error, 'Failed to fetch bookings');

    return {
      upcoming: [],
      cancelled: [],
      completed: [],
    };
  }
};

/**
 * Centralized error handler for booking-related APIs.
 */
const handleBookingError = (error: unknown, defaultMessage: string): void => {
  const errorMessage = getErrorMessage(error);

  // Don't log 404 errors as errors - they might be expected (e.g., no active tickets)
  if (error instanceof AxiosError && error.response?.status === 404) {
    // Only log in development mode for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn(`${defaultMessage} (404):`, errorMessage);
    }

    return;
  }

  // Log other errors normally
  console.error(`${defaultMessage}:`, errorMessage);

  // Log the full error for debugging
  if (error instanceof AxiosError) {
    console.error('Full error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }

  // Don't throw errors in this function - let the calling functions handle fallbacks
};

/**
 * Get origin airports for a given subscription.
 */
export const getOriginAirportsBySubscription = async (subscriptionId: string): Promise<SubscriptionAirport[]> => {
  try {
    const response = await api.get<SubscriptionAirport[]>(`/subscription/${subscriptionId}/origin`);

    return response.data;
  } catch (error) {
    handleBookingError(error, 'Failed to fetch origin airports for subscription');

    return [];
  }
};

/**
 * Get destination airports for a given origin airport code.
 */
export const getDestinationAirportsByOrigin = async (airportCode: string): Promise<SubscriptionAirport[]> => {
  try {
    const response = await api.get<SubscriptionAirport[]>(`/subscription/${airportCode}/destination`);

    return response.data;
  } catch (error) {
    handleBookingError(error, 'Failed to fetch destination airports for origin');

    return [];
  }
};
