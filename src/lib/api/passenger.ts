import api from './axios';
import type {
  Passenger,
  PassengerCreateRequest,
  PassengerUpdateRequest,
  ApiErrorResponse,
} from '@/lib/types/api/passenger';
import type { AxiosError } from 'axios';

/**
 * Get all passengers for the authenticated user.
 */
export const fetchPassengers = async (): Promise<Passenger[]> => {
  try {
    const response = await api.get<Passenger[]>('/passenger/');

    return response.data;
  } catch (error) {
    handlePassengerError(error, 'Failed to fetch passengers');

    return [] as Passenger[];
  }
};

/**
 * Get passenger details by ID.
 */
export const fetchPassengerById = async (id: string): Promise<Passenger> => {
  try {
    const response = await api.get<Passenger>(`/passenger/${id}/`);

    return response.data;
  } catch (error) {
    handlePassengerError(error, 'Failed to fetch passenger details');

    return {} as Passenger;
  }
};

/**
 * Create a new passenger.
 */
export const createPassenger = async (payload: PassengerCreateRequest): Promise<Passenger> => {
  try {
    const response = await api.post<Passenger>('/passenger/', payload);

    return response.data;
  } catch (error) {
    handlePassengerError(error, 'Failed to create passenger');

    return {} as Passenger;
  }
};

/**
 * Update passenger details (partial update allowed).
 */
export const updatePassenger = async (id: string, payload: PassengerUpdateRequest): Promise<Passenger> => {
  try {
    const response = await api.patch<Passenger>(`/passenger/${id}/`, payload);

    return response.data;
  } catch (error) {
    handlePassengerError(error, 'Failed to update passenger');

    return {} as Passenger;
  }
};

/**
 * Delete a passenger by ID.
 */
export const deletePassenger = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/passenger/${id}/`);

    return response.data;
  } catch (error) {
    handlePassengerError(error, 'Failed to delete passenger');

    return { message: '' };
  }
};

/**
 * Centralized error handling for passenger-related APIs.
 */
const handlePassengerError = (error: unknown, defaultMessage: string): never => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const status = axiosError.response?.status;
  const data = axiosError.response?.data;

  if (status === 400 && data?.errors) {
    const validationMessages = Object.values(data.errors).flat().join(', ');
    throw new Error(`Validation failed: ${validationMessages}`);
  }

  if (data?.details || data?.error) {
    const detailMsg = Array.isArray(data?.details) && data?.details.length ? data.details.join(', ') : data?.error;
    throw new Error(detailMsg || defaultMessage);
  }

  if (status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (status === 500) {
    throw new Error('Server error. Please try again later.');
  }

  throw new Error(data?.message || data?.error || defaultMessage);
};
