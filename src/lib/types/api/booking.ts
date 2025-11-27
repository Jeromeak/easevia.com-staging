//* Airport interface for destination by subscription
export interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
  iata_code: string;
  icao_code: string;
  latitude: string;
  longitude: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

//* New airport interface for subscription-based APIs
export interface SubscriptionAirport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

//* Type guards to distinguish between Airport and SubscriptionAirport
export const isAirport = (airport: Airport | SubscriptionAirport): airport is Airport => {
  return 'iata_code' in airport;
};

export const isSubscriptionAirport = (airport: Airport | SubscriptionAirport): airport is SubscriptionAirport => {
  return 'code' in airport && !('iata_code' in airport);
};

//* Helper function to get airport code from either type
export const getAirportCode = (airport: Airport | SubscriptionAirport): string => {
  return isAirport(airport) ? airport.iata_code : airport.code;
};

//* Destination by subscription response
export interface DestinationBySubscriptionResponse {
  origin_airports: Airport[];
  destination_airports: Airport[];
}

//* Flight search query parameters
export interface FlightSearchParams {
  trip_type: 'ONE_WAY' | 'ROUND_TRIP';
  subscription_id: string;
  adult: number;
  child?: number;
  infant?: number;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  travel_class?: string;
  airlines?: string;
  transit?: string; // Comma-separated transit values: "1,2,3+"
  departure_time?: string; // Values: night, morning, afternoon, evening
  arrival_time?: string; // Values: night, morning, afternoon, evening
  min_duration?: number; // Minimum flight duration in minutes
  max_duration?: number; // Maximum flight duration in minutes
}

//* Airport information in segments
export interface SegmentAirport {
  iataCode: string;
  terminal?: string;
  at: string; // ISO datetime string
}

//* Aircraft information
export interface Aircraft {
  code: string;
  model?: string;
  description?: string;
}

//* Operating carrier information
export interface OperatingCarrier {
  carrierCode: string;
}

//* Baggage information
export interface BaggageInfo {
  weight?: number;
  weightUnit?: string;
  quantity?: number;
}

//* Amenity information
export interface Amenity {
  description: string;
  isChargeable: boolean;
  amenityType: string;
  amenityProvider: {
    name: string;
  };
}

//* Fare details for each segment
export interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare?: string;
  brandedFareLabel?: string;
  class: string;
  includedCheckedBags?: BaggageInfo;
  includedCabinBags?: BaggageInfo;
  amenities?: Amenity[];
}

//* Individual flight segment
export interface FlightSegment {
  departure: SegmentAirport;
  arrival: SegmentAirport;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: OperatingCarrier;
  duration: string; // ISO duration format (PT4H20M)
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
  fareDetails: FareDetails;
  airlineName: string;
}

//* New flight item structure from updated API
export interface FlightItem {
  id?: string;
  offerType?: string;
  source?: string;
  instantTicketingRequired?: boolean;
  nonHomogeneous?: boolean;
  oneWay?: boolean;
  lastTicketingDate?: string;
  lastTicketingDateTime?: string;
  numberOfBookableSeats?: number;
  validatingAirlineCodes?: string[];
  duration: string; // ISO duration format (PT4H20M)
  segments: FlightSegment[];
  price?: {
    currency: string;
    total: string;
    base?: string;
    grandTotal?: string;
    fees?: Array<{
      amount: string;
      type: string;
    }>;
  };
  pricingOptions?: {
    fareType?: string[];
    includedCheckedBagsOnly?: boolean;
  };
  travelerPricings?: TravelerPricingPayload[];
}

//* New flight search response structure
export interface FlightSearchResponse {
  outbound: FlightItem[];
  return?: FlightItem[]; // Optional for round trips
}

export interface FlightOfferPricingPrice {
  currency: string;
  total: string;
  base?: string;
  grandTotal?: string;
  fees?: Array<{
    amount: string;
    type: string;
  }>;
}

export interface TravelerPricingSegmentDetail {
  segmentId?: string;
  cabin?: string;
  fareBasis?: string;
  brandedFare?: string;
  brandedFareLabel?: string;
  class?: string;
  includedCheckedBags?: BaggageInfo;
  includedCabinBags?: BaggageInfo;
}

export interface TravelerPricingPayload {
  travelerId: string;
  fareOption?: string;
  travelerType?: string;
  price?: {
    currency: string;
    total: string;
    base?: string;
  };
  fareDetailsBySegment?: TravelerPricingSegmentDetail[];
}

export interface FlightOfferPricingItinerary {
  duration?: string;
  segments: FlightSegment[];
}

export interface FlightOfferPricingRequest {
  type: string;
  id?: string;
  source?: string;
  instantTicketingRequired?: boolean;
  nonHomogeneous?: boolean;
  oneWay?: boolean;
  lastTicketingDate?: string;
  lastTicketingDateTime?: string;
  numberOfBookableSeats?: number;
  itineraries: FlightOfferPricingItinerary[];
  price?: FlightOfferPricingPrice;
  pricingOptions?: {
    fareType?: string[];
    includedCheckedBagsOnly?: boolean;
  };
  validatingAirlineCodes?: string[];
  travelerPricings?: TravelerPricingPayload[];
}

export interface TravelerContactPhone {
  deviceType: string;
  countryCallingCode: string;
  number: string;
}

export interface TravelerContact {
  emailAddress?: string;
  phones?: TravelerContactPhone[];
}

export interface TravelerDocument {
  documentType: string;
  number: string;
  issuanceCountry?: string;
  expiryDate?: string;
  nationality?: string;
  holder?: boolean;
}

export interface TravelerName {
  firstName: string;
  lastName: string;
}

export interface TravelerPayload {
  id: string;
  dateOfBirth: string;
  name: TravelerName;
  gender?: string;
  contact?: TravelerContact;
  documents?: TravelerDocument[];
}

export interface FlightOfferPricingData {
  type: 'flight-offers-pricing' | 'flight-order';
  flightOffers: FlightOfferPricingRequest[];
  travelers: TravelerPayload[];
}

//* Passenger details for booking
export interface BookingPassenger {
  id: number;
  name: string;
  gender: string;
  nationality: string;
  date_of_birth: string;
  relationship_with_user: string;
  mobile_number: string;
  passport_number: string;
  passport_expiry: string;
  passport_issuing_country: string;
  email?: string;
}

//* Booking creation request
export interface BookingCreationRequest {
  subscription_id: string;
  passenger_ids: string[];
  trip_type: 'ONE_WAY' | 'ROUND_TRIP';
  data: FlightOfferPricingData;
}

//* Payment details in booking response
export interface BookingPaymentDetails {
  amount: number;
  currency: string;
  payment_status: string;
}

//* Flight details in booking response
export interface BookingFlightDetails {
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_airport_name?: string;
  arrival_airport_name?: string;
  departure_time?: string;
  stops?: number;
  stop_airports?: string[];
  layover_durations?: string[];
  // New fields for updated API structure
  duration?: string; // ISO duration format
  segments?: FlightSegment[];
}

//* Passenger details in booking response
export interface BookingResponsePassenger {
  id: number;
  name: string;
  email?: string;
  passport_number: string;
  passport_issuing_country?: string;
  nationality?: string;
  date_of_birth?: string;
  type?: string;
}

//* Individual booking in response
export interface BookingItem {
  id: number;
  booking_reference: string;
  user: string;
  subscription: string;
  passenger_details: BookingResponsePassenger[];
  payment_details: BookingPaymentDetails;
  flight_details: BookingFlightDetails;
  status: string;
  pnr_number: string;
  origin?: string;
  destination?: string;
  booking_date?: string;
}

//* Booking creation response
export interface BookingCreationResponse {
  message: string;
  bookings: BookingItem[];
}

//* Active ticket response types
export interface ActiveTicketPassenger {
  id: number;
  name: string;
  type: string;
  email: string;
  gender?: string;
  nationality: string;
  date_of_birth: string;
  passport_number: string;
  passport_issuing_country: string;
}

export interface ActiveTicketPaymentDetails {
  amount: number;
  currency: string;
  payment_status: string;
  transaction_id: string;
}

export interface ActiveTicketUserInfo {
  email: string;
  phone: string;
  customer_id: string;
}

export interface ActiveTicketSubscriptionInfo {
  subscription_number: string;
  package: {
    package_class: string[];
  };
}

// Flight order segment structure (from flightOffers)
export interface FlightOrderSegment {
  id: string;
  number: string;
  arrival: {
    at: string;
    iataCode: string;
    terminal?: string;
  };
  aircraft: {
    code: string;
  };
  duration: string;
  departure: {
    at: string;
    iataCode: string;
    terminal?: string;
  };
  carrierCode: string;
  operating?: {
    carrierCode: string;
  };
  co2Emissions?: Array<{
    cabin: string;
    weight: number;
    weightUnit: string;
  }>;
  numberOfStops: number;
}

// Flight order itinerary structure
export interface FlightOrderItinerary {
  segments: FlightOrderSegment[];
}

// Flight offer in flight order
export interface FlightOrderOffer {
  id: string;
  type: string;
  price: {
    base: string;
    fees: Array<{
      type: string;
      amount: string;
    }>;
    total: string;
    currency: string;
    grandTotal: string;
    billingCurrency: string;
  };
  source: string;
  itineraries: FlightOrderItinerary[];
  nonHomogeneous: boolean;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly?: boolean;
  };
  travelerPricings: Array<{
    price: {
      base: string;
      taxes: Array<{
        code: string;
        amount: string;
      }>;
      total: string;
      currency: string;
      refundableTaxes?: string;
    };
    fareOption: string;
    travelerId: string;
    travelerType: string;
    fareDetailsBySegment: Array<{
      cabin: string;
      class: string;
      fareBasis: string;
      segmentId: string;
      brandedFare?: string;
      includedCheckedBags?: {
        weight?: number;
        weightUnit?: string;
        quantity?: number;
      };
    }>;
  }>;
  lastTicketingDate: string;
  validatingAirlineCodes: string[];
}

// Flight details structure in active ticket
export interface ActiveTicketFlightDetails {
  id: string;
  type: string;
  travelers: Array<{
    id: string;
    name: {
      lastName: string;
      firstName: string;
    };
    gender: string;
    contact: {
      phones: Array<{
        number: string;
        deviceType: string;
        countryCallingCode: string;
      }>;
      purpose: string;
      emailAddress: string;
    };
    documents: Array<{
      holder: boolean;
      number: string;
      expiryDate: string;
      nationality: string;
      documentType: string;
      issuanceCountry: string;
    }>;
    dateOfBirth: string;
  }>;
  flightOffers: FlightOrderOffer[];
  queuingOfficeId?: string;
  automatedProcess?: Array<{
    code: string;
    queue: {
      number: string;
      category: string;
    };
    officeId: string;
  }>;
  associatedRecords?: Array<{
    reference: string;
    creationDate: string;
    flightOfferId: string;
    originSystemCode: string;
  }>;
  ticketingAgreement?: {
    option: string;
  };
}

// Legacy flight details structure (for backward compatibility)
export interface ActiveTicketFlightDetailsLegacy {
  id: string;
  number: string;
  arrival: {
    at: string;
    iataCode: string;
    terminal: string;
  };
  aircraft: {
    code: string;
  };
  duration: string;
  departure: {
    at: string;
    iataCode: string;
    terminal: string;
  };
  operating: {
    carrierCode: string;
  };
  airlineName: string;
  carrierCode: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface ActiveTicket {
  id: string;
  user: string;
  subscription: string;
  user_info?: ActiveTicketUserInfo;
  subscription_info?: ActiveTicketSubscriptionInfo;
  booking_reference: string;
  passenger_details: ActiveTicketPassenger[];
  payment_details: ActiveTicketPaymentDetails;
  flight_details: ActiveTicketFlightDetails | ActiveTicketFlightDetailsLegacy[];
  origin: string;
  destination: string;
  pnr_number: string;
  member_count: number;
  status: string;
  departure_date_time: string;
  arrival_date_time: string;
  booking_date: string;
  cancelation_date: string | null;
  created_at: string;
  updated_at: string;
}

//* Booking response with tabs structure
export interface BookingResponse {
  upcoming: ActiveTicket[];
  cancelled: ActiveTicket[];
  completed: ActiveTicket[];
}

//* Common API error response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
  details?: string[];
}
