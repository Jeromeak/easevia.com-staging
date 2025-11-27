// lib/api/currency.ts

import type { AxiosError } from 'axios';
import api from './axios';
import type { Currency, ApiErrorResponse } from '../types/api/currency';

/**
 * Fetch the list of currencies
 */
export const fetchCurrencies = async (): Promise<Currency[]> => {
  try {
    const response = await api.get<Currency[]>('/package/currencies/');

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      if (status === 400 && data?.errors) {
        const validationMessages = Object.values(data.errors).flat().join(', ');
        throw new Error(`Validation failed: ${validationMessages}`);
      }

      if (status === 401) {
        throw new Error('Unauthorized. Please login again.');
      }

      if (status === 500) {
        throw new Error('Server error. Please try again later.');
      }

      throw new Error(data?.message || 'Failed to fetch currencies');
    }

    throw new Error('Network error or server did not respond');
  }
};
