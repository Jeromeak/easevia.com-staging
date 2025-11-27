import type { Passenger, ApiErrorResponse } from '@/lib/types/api/passenger';

// Mock passenger data
export const mockPassengers: Passenger[] = [
  {
    id: '1',
    name: 'John Doe',
    nationality: 'American',
    gender: 'male',
    date_of_birth: '1990-01-01',
    relationship_with_user: 'self',
    mobile_number: '+1234567890',
    email: 'john.doe@example.com',
    passport_given_name: 'John',
    passport_surname: 'Doe',
    passport_number: 'A1234567',
    passport_expiry: '2030-01-01',
    passport_issuing_country: 'US',
    user: 1,
    user_name: 'John Doe',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    nationality: 'Canadian',
    gender: 'female',
    date_of_birth: '1985-05-15',
    relationship_with_user: 'spouse',
    mobile_number: '+1987654321',
    email: 'jane.smith@example.com',
    passport_given_name: 'Jane',
    passport_surname: 'Smith',
    passport_number: 'B7654321',
    passport_expiry: '2029-05-15',
    passport_issuing_country: 'CA',
    user: 1,
    user_name: 'John Doe',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    nationality: 'British',
    gender: 'male',
    date_of_birth: '1992-12-25',
    relationship_with_user: 'friend',
    mobile_number: '+447123456789',
    email: null,
    passport_given_name: 'Bob',
    passport_surname: 'Johnson',
    passport_number: 'C9876543',
    passport_expiry: '2028-12-25',
    passport_issuing_country: 'GB',
    user: 1,
    user_name: 'John Doe',
    created_at: '2024-01-03T00:00:00Z',
  },
];

export const mockEmptyPassengers: Passenger[] = [];

export const mockSinglePassenger: Passenger[] = [mockPassengers[0]];

// Mock API responses
export const mockFetchPassengersResponse = {
  data: mockPassengers,
  status: 200,
  statusText: 'OK',
  headers: {} as never,
  config: {
    headers: {} as never,
    url: '/passenger/',
    method: 'GET',
  } as never,
};

export const mockDeletePassengerResponse = {
  data: { message: 'Passenger deleted successfully' },
  status: 200,
  statusText: 'OK',
  headers: {} as never,
  config: {
    headers: {} as never,
    url: '/passenger/1',
    method: 'DELETE',
  } as never,
};

// Mock error responses
export const mockValidationError: ApiErrorResponse = {
  message: 'Validation failed',
  errors: {
    name: ['Name is required'],
    email: ['Invalid email format'],
  },
};

export const mockUnauthorizedError: ApiErrorResponse = {
  message: 'Unauthorized',
  error: 'Invalid token',
};

export const mockServerError: ApiErrorResponse = {
  message: 'Internal server error',
  error: 'Database connection failed',
};

export const mockNetworkError = {
  message: 'Network Error',
  isAxiosError: true,
  code: 'NETWORK_ERROR',
};

export const mockTimeoutError = {
  message: 'timeout of 5000ms exceeded',
  isAxiosError: true,
  code: 'ECONNABORTED',
};

// Mock Axios errors
export const mockAxiosValidationError = {
  response: {
    status: 400,
    data: mockValidationError,
  },
  message: 'Request failed with status code 400',
  isAxiosError: true,
};

export const mockAxiosUnauthorizedError = {
  response: {
    status: 401,
    data: mockUnauthorizedError,
  },
  message: 'Request failed with status code 401',
  isAxiosError: true,
};

export const mockAxiosServerError = {
  response: {
    status: 500,
    data: mockServerError,
  },
  message: 'Request failed with status code 500',
  isAxiosError: true,
};

export const mockAxiosNotFoundError = {
  response: {
    status: 404,
    data: { message: 'Passenger not found' },
  },
  message: 'Request failed with status code 404',
  isAxiosError: true,
};
