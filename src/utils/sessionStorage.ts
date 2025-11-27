/**
 * Session Storage Management Utilities
 * Handles cleanup and management of flight-related session storage
 */

import type { FlightSearchResults, SelectedFlightData, BookingCreationResponse } from '@/lib/types/sessionStorage';

// Session storage keys
export const SESSION_KEYS = {
  FLIGHT_SEARCH_RESULTS: 'flightSearchResults',
  SELECTED_FLIGHT_DATA: 'selectedFlightData',
  BOOKING_DATA: 'bookingData',
} as const;

/**
 * Clears all flight-related session storage
 */
export const clearFlightSessionStorage = () => {
  Object.values(SESSION_KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

/**
 * Clears specific session storage key
 */
export const clearSessionStorageKey = (key: string) => {
  sessionStorage.removeItem(key);
};

/**
 * Clears flight search results only
 */
export const clearFlightSearchResults = () => {
  clearSessionStorageKey(SESSION_KEYS.FLIGHT_SEARCH_RESULTS);
};

/**
 * Clears selected flight data only
 */
export const clearSelectedFlightData = () => {
  clearSessionStorageKey(SESSION_KEYS.SELECTED_FLIGHT_DATA);
};

/**
 * Clears booking data only
 */
export const clearBookingData = () => {
  clearSessionStorageKey(SESSION_KEYS.BOOKING_DATA);
};

/**
 * Gets flight search results from session storage
 */
export const getFlightSearchResults = (): FlightSearchResults | null => {
  try {
    const data = sessionStorage.getItem(SESSION_KEYS.FLIGHT_SEARCH_RESULTS);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing flight search results:', error);

    return null;
  }
};

/**
 * Gets selected flight data from session storage
 */
export const getSelectedFlightData = (): SelectedFlightData | null => {
  try {
    const data = sessionStorage.getItem(SESSION_KEYS.SELECTED_FLIGHT_DATA);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing selected flight data:', error);

    return null;
  }
};

/**
 * Sets flight search results in session storage
 */
export const setFlightSearchResults = (data: FlightSearchResults) => {
  try {
    sessionStorage.setItem(SESSION_KEYS.FLIGHT_SEARCH_RESULTS, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing flight search results:', error);
  }
};

/**
 * Sets selected flight data in session storage
 */
export const setSelectedFlightData = (data: SelectedFlightData) => {
  try {
    console.log('Storing selected flight data:', data);
    sessionStorage.setItem(SESSION_KEYS.SELECTED_FLIGHT_DATA, JSON.stringify(data));
    console.log('Successfully stored selected flight data in session storage');
  } catch (error) {
    console.error('Error storing selected flight data:', error);
  }
};

/**
 * Gets booking data from session storage
 */
export const getBookingData = (): BookingCreationResponse | null => {
  try {
    const data = sessionStorage.getItem(SESSION_KEYS.BOOKING_DATA);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing booking data:', error);

    return null;
  }
};

/**
 * Sets booking data in session storage
 */
export const setBookingData = (data: BookingCreationResponse) => {
  try {
    sessionStorage.setItem(SESSION_KEYS.BOOKING_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing booking data:', error);
  }
};
