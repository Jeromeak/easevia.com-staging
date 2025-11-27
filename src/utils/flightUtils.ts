import type { FlightItem } from '@/lib/types/api/booking';

/**
 * Parse ISO duration string (PT4H20M) to human readable format (4h 20m)
 */
export const parseDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

  if (!match) return isoDuration;

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  }

  return isoDuration;
};

/**
 * Extract flight data from FlightItem with segments
 */
export const extractFlightData = (flight: FlightItem) => {
  const segments = flight.segments;

  if (!segments || segments.length === 0) {
    throw new Error('Flight item must have at least one segment');
  }

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  // Determine if it's a direct flight
  const isDirect = segments.length === 1;

  // Get departure and arrival information
  const departureAirport = firstSegment.departure.iataCode;
  const arrivalAirport = lastSegment.arrival.iataCode;
  const departureTime = firstSegment.departure.at;
  const arrivalTime = lastSegment.arrival.at;

  // Get airline information (use first segment's airline)
  const airline = firstSegment.airlineName;
  const flightNumber = `${firstSegment.carrierCode}${firstSegment.number}`;

  // Calculate stops and stop airports
  const stops = segments.length - 1;
  const stopAirports = segments.slice(0, -1).map((segment) => segment.arrival.iataCode);

  // Get fare information from first segment
  const fareDetails = firstSegment.fareDetails;
  const travelClass = fareDetails.cabin;
  const fareBasis = fareDetails.fareBasis;

  // Get baggage information
  const checkedBags = fareDetails.includedCheckedBags;
  const cabinBags = fareDetails.includedCabinBags;

  return {
    // Basic flight info
    airline,
    flightNumber,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    duration: parseDuration(flight.duration),
    isDirect,
    stops,
    stopAirports,

    // Fare and class info
    travelClass,
    fareBasis,
    brandedFare: fareDetails.brandedFare,
    brandedFareLabel: fareDetails.brandedFareLabel,

    // Baggage info
    checkedBags,
    cabinBags,

    // Amenities
    amenities: fareDetails.amenities || [],

    // Segment details
    segments,

    // For compatibility with existing code
    segment_id: firstSegment.id, // Use first segment ID as primary
    departure_airport: departureAirport,
    arrival_airport: arrivalAirport,
    departure_time: departureTime,
    arrival_time: arrivalTime,
    flight_duration: parseDuration(flight.duration),
    segment: 'outbound' as const, // This will be set by the calling code
  };
};

/**
 * Get all unique airline IATA codes from flight segments
 */
export const getAirlinesFromFlight = (flight: FlightItem): string[] => {
  const airlines = new Set<string>();

  flight.segments.forEach((segment) => {
    airlines.add(segment.carrierCode);
  });

  return Array.from(airlines);
};

/**
 * Check if flight matches airline filter
 */
export const flightMatchesAirline = (flight: FlightItem, selectedAirlines: string[]): boolean => {
  if (selectedAirlines.length === 0) return true;

  const flightAirlines = getAirlinesFromFlight(flight);

  return flightAirlines.some((airline) => selectedAirlines.includes(airline));
};

/**
 * Check if flight is direct (matches direct flight filter)
 */
export const isDirectFlight = (flight: FlightItem): boolean => {
  return flight.segments.length === 1;
};

/**
 * Get stop count for flight
 */
export const getStopCount = (flight: FlightItem): number => {
  return flight.segments.length - 1;
};
