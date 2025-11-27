// Mock environment variables for contact module tests
export const mockEnv = {
  NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000',
  NODE_ENV: 'test',
  NEXT_PUBLIC_APP_NAME: 'EaseVia',
  NEXT_PUBLIC_APP_VERSION: '1.0.0',
};

// Mock API endpoints
export const mockApiEndpoints = {
  CONTACT_US: '/inquiry/',
  CONTACT_US_LEGACY: '/contact_us/',
};

// Mock API configuration
export const mockApiConfig = {
  timeout: 10000,
  retries: 3,
  baseURL: mockEnv.NEXT_PUBLIC_API_BASE_URL,
};

// Mock validation rules
export const mockValidationRules = {
  PHONE_REGEX: /^(\+91)?[0-9]{10}$/,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_SUBJECT_LENGTH: 5,
  MAX_SUBJECT_LENGTH: 200,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
};

// Mock form field limits
export const mockFormLimits = {
  PASSENGER_LIMIT: 9,
  AUTO_ERROR_REMOVAL_DELAY: 5000,
  DEBOUNCE_DELAY: 300,
};
