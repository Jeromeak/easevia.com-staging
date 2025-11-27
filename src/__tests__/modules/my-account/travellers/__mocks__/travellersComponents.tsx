import type { Passenger } from '@/lib/types/api/passenger';

// Mock component props
export const mockTravellersTabProps = {
  onAddPassenger: jest.fn(),
  onEditPassenger: jest.fn(),
};

// Mock passenger management context
export const mockPassengerManagementContext = {
  passengers: [],
  loading: false,
  error: null,
  addPassenger: jest.fn(),
  editPassenger: jest.fn(),
  removePassenger: jest.fn(),
  clearError: jest.fn(),
  refreshPassengers: jest.fn(),
};

// Mock router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
};

// Mock search params
export const mockSearchParams = {
  get: jest.fn((key: string) => {
    const params: Record<string, string> = {
      tab: 'travellers',
    };

    return params[key] || null;
  }),
  append: jest.fn(),
  delete: jest.fn(),
  set: jest.fn(),
  sort: jest.fn(),
  toString: jest.fn(() => 'tab=travellers'),
  entries: jest.fn(),
  forEach: jest.fn(),
  has: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  [Symbol.iterator]: jest.fn(),
};

// Mock icons
export const mockIcons = {
  AddIcon: ({ className }: { className?: string }) => (
    <svg data-testid="add-icon" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  PencilIcon: ({ className }: { className?: string }) => (
    <svg data-testid="pencil-icon" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  CloseIcon: ({ className }: { className?: string }) => (
    <svg data-testid="close-icon" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
};

// Mock passenger data for testing
export const mockPassengerForTesting: Passenger = {
  id: 'test-1',
  name: 'Test User',
  nationality: 'Test Country',
  gender: 'male',
  date_of_birth: '1990-01-01',
  relationship_with_user: 'self',
  mobile_number: '+1234567890',
  email: 'test@example.com',
  passport_given_name: 'Test',
  passport_surname: 'User',
  passport_number: 'TEST123456',
  passport_expiry: '2030-01-01',
  passport_issuing_country: 'US',
  user: 1,
  user_name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
};

// Mock error messages
export const mockErrorMessages = {
  fetchFailed: 'Failed to load passengers',
  deleteFailed: 'Failed to delete passenger',
  networkError: 'Network error. Please try again.',
  unauthorized: 'Unauthorized. Please login again.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Validation failed: Name is required, Invalid email format',
  notFound: 'Passenger not found',
  timeout: 'Request timeout. Please try again.',
};

// Mock success messages
export const mockSuccessMessages = {
  deleteSuccess: 'Passenger deleted successfully',
  loadSuccess: 'Passengers loaded successfully',
};

// Mock loading states
export const mockLoadingStates = {
  initial: true,
  loaded: false,
  error: false,
};

// Mock empty states
export const mockEmptyStates = {
  noPassengers: 'No passengers found',
  addFirstPassenger: 'Add your first passenger',
};

// Mock form data
export const mockFormData = {
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
};

// Mock validation errors
export const mockValidationErrors = {
  name: 'Name is required',
  email: 'Invalid email format',
  mobile_number: 'Invalid phone number',
  passport_number: 'Passport number is required',
  date_of_birth: 'Date of birth is required',
  nationality: 'Nationality is required',
  gender: 'Gender is required',
  relationship_with_user: 'Relationship is required',
  passport_given_name: 'Passport given name is required',
  passport_surname: 'Passport surname is required',
  passport_expiry: 'Passport expiry is required',
  passport_issuing_country: 'Passport issuing country is required',
};
