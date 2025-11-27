import api from './axios';
import type {
  TravelPackage,
  ApiErrorResponse,
  PackageListRequest,
  PackageAirline,
  PackageClass,
  PackageAirlinesRequest,
  PackageClassesRequest,
  ComparePackageResponse,
} from '@/lib/types/api/package';
import type { AxiosError } from 'axios';

/**
 * Get travel packages between origin and destination cities.
 */
export const fetchPackages = async (payload: PackageListRequest): Promise<TravelPackage[]> => {
  try {
    // Build query parameters
    const params: Record<string, string | number> = {};

    // Add currency_id if provided
    if (payload.currency_id) {
      params.currency_id = payload.currency_id;
    }

    // Add origin if provided
    if (payload.origin) {
      params.origin = payload.origin;
    }

    // Add destination if provided
    if (payload.destination) {
      params.destination = payload.destination;
    }

    // Add class_type if provided
    if (payload.class_type) {
      params.class_type = payload.class_type;
    }

    // Add airline if provided
    if (payload.airline) {
      params.airline = payload.airline;
    }

    // Use trailing slash to avoid 301 redirect (/package -> /package/)
    const response = await api.get<TravelPackage[]>('/package/', {
      params,
    });

    return response.data;
  } catch (error) {
    handlePackageError(error, 'Failed to fetch travel packages');

    return [] as TravelPackage[]; //* added to satisfy TS
  }
};

/**
 * Get full details of a specific travel package by ID.
 */
export const fetchPackageById = async (id: string): Promise<TravelPackage> => {
  try {
    const response = await api.get<TravelPackage>(`/package/${id}/`);

    return response.data;
  } catch (error) {
    handlePackageError(error, 'Failed to fetch package details');

    return {} as TravelPackage; //* added to satisfy TS
  }
};

/**
 * Compare multiple travel packages by their IDs.
 * Returns only fields provided by the backend API.
 */
export const comparePackages = async (packageIds: string[], currencyId?: string): Promise<ComparePackageResponse[]> => {
  try {
    const params: Record<string, string> = {
      package_ids: packageIds.join(','),
    };

    if (currencyId) {
      params.currency_id = currencyId;
    }

    const response = await api.get<ComparePackageResponse[]>(`/package/compare/`, {
      params,
    });

    return response.data;
  } catch (error) {
    handlePackageError(error, 'Failed to compare packages');

    return [] as ComparePackageResponse[]; //* added to satisfy TS
  }
};

/**
 * Get package airlines between origin and destination cities.
 */
export const fetchPackageAirlines = async (payload: PackageAirlinesRequest): Promise<PackageAirline[]> => {
  try {
    const response = await api.get<PackageAirline[]>('/package/airlines/', {
      params: payload,
    });

    return response.data;
  } catch (error) {
    handlePackageError(error, 'Failed to fetch package airlines');

    return [] as PackageAirline[]; //* added to satisfy TS
  }
};

/**
 * Get package classes between origin and destination cities.
 */
export const fetchPackageClasses = async (payload?: PackageClassesRequest): Promise<PackageClass[]> => {
  try {
    const response = await api.get<PackageClass[]>('/package/classes/', {
      params: payload,
    });

    return response.data;
  } catch (error) {
    handlePackageError(error, 'Failed to fetch package classes');

    return [] as PackageClass[]; //* added to satisfy TS
  }
};

/**
 * Centralized error handling for package-related APIs.
 */
const handlePackageError = (error: unknown, defaultMessage: string): never => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const status = axiosError.response?.status;
  const data = axiosError.response?.data;

  if (status === 400 && data?.errors) {
    const validationMessages = Object.values(data.errors).flat().join(', ');
    throw new Error(`Validation failed: ${validationMessages}`);
  }

  // Some endpoints return a different shape
  if (data?.details || data?.error) {
    const detailMsg = Array.isArray(data.details) ? data.details.join(', ') : data.error;
    throw new Error(detailMsg || defaultMessage);
  }

  if (status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (status === 500) {
    throw new Error('Server error. Please try again later.');
  }

  throw new Error(data?.message || defaultMessage);
};
