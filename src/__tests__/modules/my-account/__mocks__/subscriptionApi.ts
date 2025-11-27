import type {
  Subscription,
  SubscriptionPassenger,
  PackageODRoute,
  AddRemovePassengersResponse,
  ApiErrorResponse,
} from '@/lib/types/api/subscription';

// Mock subscription data
export const mockSubscription1: Subscription = {
  id: 1,
  subscription_number: 'SUB-001',
  date_change_count: 2,
  start_date: '2024-01-01T00:00:00Z',
  end_date: '2024-12-31T23:59:59Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  user: 'user-1',
  package: 'Premium Plan',
  price: 50000,
  trip_count: 12,
  travelled_trip_count: 3,
  member_count: 2,
  travelled_member_count: 1,
  allowed_date_change_count: 4,
  used_date_change_count: 1,
  expired: false,
  passengers: [
    {
      id: 'passenger-1',
      name: 'John Doe',
      nationality: 'US',
      gender: 'male',
      date_of_birth: '1990-01-01',
      relationship_with_user: 'self',
      mobile_number: '+1234567890',
      email: 'john@example.com',
    },
  ],
  package_od: [],
};

export const mockSubscription2: Subscription = {
  id: 2,
  subscription_number: 'SUB-002',
  date_change_count: 1,
  start_date: '2024-06-01T00:00:00Z',
  end_date: '2025-05-31T23:59:59Z',
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  user: 'user-1',
  package: 'Basic Plan',
  price: 25000,
  trip_count: 4,
  travelled_trip_count: 0,
  member_count: 1,
  travelled_member_count: 0,
  allowed_date_change_count: 2,
  used_date_change_count: 0,
  expired: false,
  passengers: [],
  package_od: [],
};

export const mockSubscriptions: Subscription[] = [mockSubscription1, mockSubscription2];

// Mock passengers
export const mockPassenger1: SubscriptionPassenger = {
  id: 'passenger-1',
  name: 'John Doe',
  nationality: 'US',
  gender: 'male',
  date_of_birth: '1990-01-01',
  relationship_with_user: 'self',
  mobile_number: '+1234567890',
  email: 'john@example.com',
};

export const mockPassenger2: SubscriptionPassenger = {
  id: 'passenger-2',
  name: 'Jane Doe',
  nationality: 'US',
  gender: 'female',
  date_of_birth: '1992-05-15',
  relationship_with_user: 'spouse',
  mobile_number: '+1234567891',
  email: 'jane@example.com',
};

export const mockPassenger3: SubscriptionPassenger = {
  id: 'passenger-3',
  name: 'Bob Smith',
  nationality: 'CA',
  gender: 'male',
  date_of_birth: '1985-03-20',
  relationship_with_user: 'other',
  mobile_number: '+1234567892',
  email: 'bob@example.com',
};

export const mockPassengers: SubscriptionPassenger[] = [mockPassenger1, mockPassenger2, mockPassenger3];

// Mock full Passenger objects (for fetchPassengersOnce)
import type { Passenger } from '@/lib/types/api/passenger';

export const mockFullPassenger1: Passenger = {
  id: 'passenger-1',
  name: 'John Doe',
  nationality: 'US',
  gender: 'male',
  date_of_birth: '1990-01-01',
  relationship_with_user: 'self',
  mobile_number: '+1234567890',
  email: 'john@example.com',
  passport_given_name: 'John',
  passport_surname: 'Doe',
  passport_number: 'US123456',
  passport_expiry: '2030-01-01',
  passport_issuing_country: 'US',
  user: 1,
};

export const mockFullPassenger2: Passenger = {
  id: 'passenger-2',
  name: 'Jane Doe',
  nationality: 'US',
  gender: 'female',
  date_of_birth: '1992-05-15',
  relationship_with_user: 'spouse',
  mobile_number: '+1234567891',
  email: 'jane@example.com',
  passport_given_name: 'Jane',
  passport_surname: 'Doe',
  passport_number: 'US123457',
  passport_expiry: '2032-05-15',
  passport_issuing_country: 'US',
  user: 1,
};

export const mockFullPassenger3: Passenger = {
  id: 'passenger-3',
  name: 'Bob Smith',
  nationality: 'CA',
  gender: 'male',
  date_of_birth: '1985-03-20',
  relationship_with_user: 'other',
  mobile_number: '+1234567892',
  email: 'bob@example.com',
  passport_given_name: 'Bob',
  passport_surname: 'Smith',
  passport_number: 'CA123456',
  passport_expiry: '2035-03-20',
  passport_issuing_country: 'CA',
  user: 1,
};

export const mockFullPassengers: Passenger[] = [mockFullPassenger1, mockFullPassenger2, mockFullPassenger3];

// Mock routes
export const mockRoute1: PackageODRoute = {
  id: 'route-1',
  origin_airport: 'Delhi Airport',
  destination_airport: 'Mumbai Airport',
  origin_airport_code: 'DEL',
  destination_airport_code: 'BOM',
  origin_airport_city_name: 'Delhi',
  destination_airport_city_name: 'Mumbai',
  origin_airport_country_name: 'India',
  destination_airport_country_name: 'India',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockRoute2: PackageODRoute = {
  id: 'route-2',
  origin_airport: 'Bangalore Airport',
  destination_airport: 'Chennai Airport',
  origin_airport_code: 'BLR',
  destination_airport_code: 'MAA',
  origin_airport_city_name: 'Bangalore',
  destination_airport_city_name: 'Chennai',
  origin_airport_country_name: 'India',
  destination_airport_country_name: 'India',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockRoute3: PackageODRoute = {
  id: 'route-3',
  origin_airport: 'Kolkata Airport',
  destination_airport: 'Hyderabad Airport',
  origin_airport_code: 'CCU',
  destination_airport_code: 'HYD',
  origin_airport_city_name: 'Kolkata',
  destination_airport_city_name: 'Hyderabad',
  origin_airport_country_name: 'India',
  destination_airport_country_name: 'India',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockRoutes: PackageODRoute[] = [mockRoute1, mockRoute2, mockRoute3];

// Mock API responses
export const mockFetchSubscriptionsResponse = {
  data: mockSubscriptions,
  status: 200,
  statusText: 'OK',
};

export const mockAddPassengersResponse: AddRemovePassengersResponse = {
  added: ['passenger-2'],
  already_added: [],
  not_found: [],
  message: 'Passengers added successfully',
};

export const mockAddPassengersPartialResponse: AddRemovePassengersResponse = {
  added: ['passenger-2'],
  already_added: ['passenger-1'],
  not_found: ['passenger-999'],
  message: 'Some passengers were added',
};

export const mockDownloadInvoiceBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });

export const mockFetchRoutesResponse = {
  data: mockRoutes,
  status: 200,
  statusText: 'OK',
};

export const mockLinkRoutesResponse = {
  data: { message: 'Routes linked successfully' },
  status: 200,
  statusText: 'OK',
};

// Mock error responses
export const mockUnauthorizedError: ApiErrorResponse = {
  message: 'Unauthorized. Please login again.',
};

export const mockServerError: ApiErrorResponse = {
  message: 'Server error. Please try again later.',
};

export const mockValidationError: ApiErrorResponse = {
  message: 'Validation failed',
  errors: {
    passenger_ids: ['Invalid passenger IDs'],
  },
};

export const mockRouteLimitError: ApiErrorResponse = {
  error: 'Exceeded allowed package OD count for this subscription',
  details: [],
};

export const mockPassengerLimitError: ApiErrorResponse = {
  error: 'Cannot add more passengers. Maximum allowed: 2',
  details: [],
};

// Mock network errors
export const mockNetworkError = new Error('Network Error');
export const mockTimeoutError = new Error('Request timeout');
