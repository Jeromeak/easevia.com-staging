// Mock component props
export const mockProfileTabProps = {
  // No props needed for ProfileTab as it's self-contained
};

// Mock form data
export const mockFormData = {
  name: 'John Doe',
  gender: 'male',
  date_of_birth: '1990-01-01',
  nationality: 'American',
  address: '123 Main St',
  billingAddress: '123 Main St',
  pincode: '12345',
  country: 'US',
  state: 'CA',
  city: 'San Francisco',
};

export const mockUpdatedFormData = {
  name: 'John Smith',
  gender: 'male',
  date_of_birth: '1990-05-15',
  nationality: 'Canadian',
  address: '456 Oak Ave',
  billingAddress: '456 Oak Ave',
  pincode: '54321',
  country: 'CA',
  state: 'ON',
  city: 'Toronto',
};

// Mock user context
export const mockUserContext = {
  user: {
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
  },
  setUser: jest.fn(),
  logout: jest.fn(),
  accessToken: 'mock-access-token',
};

// Mock location dropdowns hook
export const mockLocationDropdowns = {
  countries: [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
  ],
  states: [
    { label: 'California', value: 'CA' },
    { label: 'New York', value: 'NY' },
  ],
  cities: [
    { label: 'San Francisco', value: 'SF' },
    { label: 'Los Angeles', value: 'LA' },
  ],
  loadingCountries: false,
  loadingStates: false,
  loadingCities: false,
  error: '',
  loadStates: jest.fn(),
  loadCities: jest.fn(),
};

// Mock gender options
export const mockGenderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Mock token storage
export const mockToken = 'mock-jwt-token';

// Mock form validation errors
export const mockFormErrors = {
  name: 'Name is required',
  email: 'Email format is invalid',
  phone: 'Phone number is required',
  date_of_birth: 'Date of birth is required',
  nationality: 'Nationality is required',
  address: 'Address is required',
  pincode: 'Pincode is required',
  country: 'Country is required',
  state: 'State is required',
  city: 'City is required',
};

// Mock success messages
export const mockSuccessMessages = {
  profileUpdated: 'Profile updated successfully',
  profileSaved: 'Profile saved successfully',
  changesSaved: 'Your changes have been saved',
};

// Mock error messages
export const mockErrorMessages = {
  updateFailed: 'Failed to update profile',
  validationFailed: 'Please check your input and try again',
  networkError: 'Network error. Please try again.',
  unauthorized: 'Unauthorized. Please login again.',
  serverError: 'Server error. Please try again later.',
};
