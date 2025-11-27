import api from './axios';
import type {
  Subscription,
  SubscriptionPassenger,
  SubscriptionPopularPlan,
  PackageODRoute,
  ApiErrorResponse,
  AddRemovePassengersRequest,
  AddRemovePassengersResponse,
} from '@/lib/types/api/subscription';
import type { AxiosError } from 'axios';

/**
 * Get all subscriptions for the authenticated user.
 */
export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const response = await api.get<Subscription[]>('/subscription/');

    return response.data;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to fetch subscriptions');

    return [] as Subscription[];
  }
};

/**
 * Add a new subscription for the given package.
 */
export const addSubscription = async (packageId: number): Promise<Subscription> => {
  try {
    const response = await api.post<Subscription>(`/subscription/${packageId}/`);

    return response.data;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to create subscription');

    return {} as Subscription;
  }
};

/**
 * Download subscription invoice (PDF blob).
 */
export const downloadSubscriptionInvoice = async (subscriptionId: string): Promise<Blob> => {
  try {
    const response = await api.get<Blob>(`/subscription/${subscriptionId}/invoice/`, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to download invoice');

    return new Blob();
  }
};

/**
 * Add passengers to a subscription.
 */
export const addPassengersToSubscription = async (
  subscriptionId: string,
  payload: AddRemovePassengersRequest
): Promise<AddRemovePassengersResponse> => {
  try {
    const response = await api.post<AddRemovePassengersResponse>(`/subscription/${subscriptionId}/passenger/`, payload);

    return response.data;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to add passengers');

    return { added: [], already_added: [], not_found: [], message: '' };
  }
};

/**
 * Remove passengers from a subscription.
 */
export const removePassengersFromSubscription = async (
  subscriptionId: number,
  payload: AddRemovePassengersRequest
): Promise<AddRemovePassengersResponse> => {
  try {
    const response = await api.delete<AddRemovePassengersResponse>(`/subscription/${subscriptionId}/passenger/`, {
      data: payload,
    });

    return response.data;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to remove passengers');

    return { removed: [], not_in_subscription: [], not_found: [], message: '' } as AddRemovePassengersResponse;
  }
};

/**
 * Get passengers of a subscription.
 */
export const fetchSubscriptionPassengers = async (subscriptionId: number): Promise<SubscriptionPassenger[]> => {
  try {
    const response = await api.get<{ passengers: SubscriptionPassenger[] }>(
      `/subscription/${subscriptionId}/passenger/`
    );

    return response.data.passengers;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to fetch subscription passengers');

    return [];
  }
};

/**
 * Get popular subscription plans.
 */
export const fetchPopularSubscriptionPlans = async (currencyId?: string): Promise<SubscriptionPopularPlan[]> => {
  try {
    const response = await api.get<SubscriptionPopularPlan[]>('/subscription/popular_plans/', {
      params: currencyId && currencyId.length > 0 ? { currency_id: currencyId } : undefined,
    });

    return response.data;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to fetch popular subscription plans');

    return [];
  }
};

/**
 * Get package origin-destination options for a specific subscription.
 * Returns an array of route labels to render in the existing dropdown UI.
 */
export const fetchSubscriptionPackageOD = async (subscriptionId: string): Promise<string[]> => {
  try {
    const response = await api.get<PackageODRoute[]>(`/subscription/${subscriptionId}/package-od/`);

    const data = response.data;

    // Handle array of PackageODRoute objects
    if (Array.isArray(data)) {
      return data.map((route: PackageODRoute) => {
        const originCity = route.origin_airport_city_name?.toUpperCase() || '';
        const originCode = route.origin_airport_code || '';
        const destCity = route.destination_airport_city_name?.toUpperCase() || '';
        const destCode = route.destination_airport_code || '';

        // Format: "ORIGIN_CITY (ORIGIN_CODE) → DESTINATION_CITY (DESTINATION_CODE)"
        if (originCity && originCode && destCity && destCode) {
          return `${originCity} (${originCode}) → ${destCity} (${destCode})`;
        }

        // Fallback format if city names are not available
        if (originCode && destCode) {
          return `${originCode} → ${destCode}`;
        }

        // Last resort: use airport names
        return `${route.origin_airport || ''} → ${route.destination_airport || ''}`;
      });
    }

    return [];
  } catch (error) {
    handleSubscriptionError(error, 'Failed to fetch subscription routes');

    return [];
  }
};

/**
 * Get package OD routes with full details for display.
 */
export const fetchSubscriptionPackageODPairs = async (subscriptionId: string): Promise<PackageODRoute[]> => {
  try {
    const response = await api.get<PackageODRoute[]>(`/subscription/${subscriptionId}/package-od/`);
    const data = response.data || [];

    return data;
  } catch (error) {
    handleSubscriptionError(error, 'Failed to fetch subscription routes');

    return [];
  }
};

/**
 * Link selected package OD ids to a subscription.
 */
export const linkSubscriptionPackageOD = async (subscriptionId: string, packageOdIds: string[]): Promise<void> => {
  try {
    await api.post(`/subscription/${subscriptionId}/linked-package-od/`, {
      package_od_ids: packageOdIds,
    });
  } catch (error) {
    // Surface API error message, e.g. "Exceeded allowed package OD count for this subscription"
    handleSubscriptionError(error, 'Failed to link routes to subscription');
  }
};

/**
 * Fetch linked package origin-destination routes for a subscription.
 * Returns all linked routes that can be used for origin/destination selection.
 */
export const fetchLinkedPackageODRoutes = async (subscriptionId: string): Promise<PackageODRoute[]> => {
  try {
    const response = await api.get<PackageODRoute[]>(`/subscription/${subscriptionId}/linked-package-od/`);

    return response.data || [];
  } catch (error) {
    handleSubscriptionError(error, 'Failed to fetch linked package routes');

    return [];
  }
};

/**
 * Centralized error handler for subscription-related APIs.
 */
const handleSubscriptionError = (error: unknown, defaultMessage: string): never => {
  const axiosError = error as AxiosError<ApiErrorResponse | string | unknown>;
  const status = axiosError.response?.status;
  let data = axiosError.response?.data as unknown;

  // If the backend returned a JSON string, try to parse it
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      // keep as string
    }
  }

  // Prefer explicit API error fields
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;

    // 1) explicit error string
    if (typeof obj.error === 'string' && obj.error.trim().length > 0) {
      throw new Error(obj.error);
    }

    // 2) details array
    if (Array.isArray(obj.details) && obj.details.length > 0) {
      const detailMsg = obj.details.map((d) => String(d)).join(', ');
      throw new Error(detailMsg);
    }

    // 3) message string
    if (typeof obj.message === 'string' && obj.message.trim().length > 0) {
      throw new Error(obj.message);
    }

    // 4) field errors map
    if (status === 400 && obj.errors && typeof obj.errors === 'object') {
      const validationMessages = Object.values(obj.errors as Record<string, string[]>)
        .flat()
        .join(', ');
      if (validationMessages) throw new Error(`Validation failed: ${validationMessages}`);
    }
  }

  if (status === 401) throw new Error('Unauthorized. Please login again.');
  if (status === 500) throw new Error('Server error. Please try again later.');

  // Fallback to default message if nothing usable was found
  throw new Error(defaultMessage);
};
