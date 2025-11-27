import type { UserProfile, UserProfileUpdatePayload, ApiErrorResponse } from '@/lib/types/api/user';

// Mock user profile data
export const mockUserProfile: UserProfile = {
  id: 1,
  email: 'john.doe@example.com',
  phone: '+1234567890',
  name: 'John Doe',
  gender: 'male',
  date_of_birth: '1990-01-01',
  nationality: 'American',
  address: '123 Main St',
  billing_address: '123 Main St',
  pincode: '12345',
  country: 'US',
  state: 'CA',
  city: 'San Francisco',
  is_verified: true,
  phone_verified: true,
  auth_provider: 'email',
  customer_id: 'cust_123',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock updated user profile
export const mockUpdatedUserProfile: UserProfile = {
  ...mockUserProfile,
  name: 'John Smith',
  gender: 'male',
  date_of_birth: '1990-05-15',
  nationality: 'Canadian',
  address: '456 Oak Ave',
  billing_address: '456 Oak Ave',
  pincode: '54321',
  country: 'CA',
  state: 'ON',
  city: 'Toronto',
  updated_at: '2024-01-02T00:00:00Z',
};

// Mock profile update payload
export const mockProfileUpdatePayload: UserProfileUpdatePayload = {
  name: 'John Smith',
  gender: 'male',
  date_of_birth: '1990-05-15',
  nationality: 'Canadian',
  address: '456 Oak Ave',
  billing_address: '456 Oak Ave',
  pincode: '54321',
  country: 'CA',
  state: 'ON',
  city: 'Toronto',
};

// Mock API responses
export const mockFetchUserInfoResponse = {
  data: mockUserProfile,
  status: 200,
  statusText: 'OK',
};

export const mockUpdateUserProfileResponse = {
  data: mockUpdatedUserProfile,
  status: 200,
  statusText: 'OK',
};

// Mock error responses
export const mockValidationError: ApiErrorResponse = {
  message: 'Validation failed',
  errors: {
    name: ['Name is required'],
    email: ['Email format is invalid'],
  },
};

export const mockUnauthorizedError: ApiErrorResponse = {
  message: 'Unauthorized. Please login again.',
};

export const mockServerError: ApiErrorResponse = {
  message: 'Server error. Please try again later.',
};

// Mock location data
export const mockCountries = [
  { id: '1', name: 'United States', code: 'US' },
  { id: '2', name: 'Canada', code: 'CA' },
  { id: '3', name: 'United Kingdom', code: 'UK' },
];

export const mockStates = [
  { id: '1', name: 'California', country_id: '1' },
  { id: '2', name: 'New York', country_id: '1' },
  { id: '3', name: 'Ontario', country_id: '2' },
];

export const mockCities = [
  { id: '1', name: 'San Francisco', state_id: '1' },
  { id: '2', name: 'Los Angeles', state_id: '1' },
  { id: '3', name: 'Toronto', state_id: '3' },
];

// Mock gender options
export const mockGenderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];
