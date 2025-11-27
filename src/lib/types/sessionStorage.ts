//* Session Storage Data Types
//* Centralized types for session storage data structures

//* Flight data structure for session storage (use FlightItem from booking API)
import type { FlightItem } from './api/booking';

export type FlightData = FlightItem;

//* Selected flight data structure for session storage
export interface SelectedFlightData {
  selectedFlight?: FlightData; // For one-way trips
  selectedOutboundFlight?: FlightData; // For round trips
  selectedReturnFlight?: FlightData; // For round trips
  searchParams: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    trip_type: string;
    subscription_id: string;
    adult: number;
    child?: number;
    infant?: number;
  };
  tripType: string;
}

//* Flight search results structure for session storage
export interface FlightSearchResults {
  outbound: FlightData[];
  return?: FlightData[];
  searchParams: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    trip_type: string;
    subscription_id: string;
    adult: number;
    child?: number;
    infant?: number;
  };
}

//* Re-export booking types for convenience
export type { BookingCreationResponse } from './api/booking';
