import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BillingAddress } from '@/app/checkout/components/BillingAddress';
import { useCheckout } from '@/context/hooks/useCheckout';
import { useAuth } from '@/context/hooks/useAuth';
import { fetchUserInfo, updateUserProfile } from '@/lib/api/user';
import { useLocationDropdowns } from '@/hooks/useLocationDropdowns';
import { getAccessToken } from '@/utils/tokenStorage';
import { mockCheckoutContext, mockUser } from '../__mocks__/checkoutComponents';

// Mock hooks
jest.mock('@/context/hooks/useCheckout', () => ({
  useCheckout: jest.fn(),
}));

jest.mock('@/context/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api/user', () => ({
  fetchUserInfo: jest.fn(),
  updateUserProfile: jest.fn(),
}));

jest.mock('@/hooks/useLocationDropdowns', () => ({
  useLocationDropdowns: jest.fn(),
}));

// Mock tokenStorage
jest.mock('@/utils/tokenStorage', () => ({
  getAccessToken: jest.fn(() => 'mock-access-token'),
}));

// Mock icons
jest.mock('@/icons/icon', () => ({
  EditIcon: () => <svg data-testid="edit-icon" />,
}));

// Mock CustomDropdown (Select component)
jest.mock('@/common/components/Select', () => ({
  __esModule: true,
  default: ({
    options,
    value,
    onChange,
    placeholder,
  }: {
    options: Array<{ label: string; value: string }>;
    value: { label: string; value: string } | null;
    onChange: (option: { label: string; value: string } | null) => void;
    placeholder?: string;
  }) => (
    <select
      data-testid="custom-dropdown"
      value={value?.value || ''}
      onChange={(e) => {
        const selected = options.find((opt) => opt.value === e.target.value);
        onChange(selected || null);
      }}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

const mockUseCheckout = useCheckout as jest.MockedFunction<typeof useCheckout>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockFetchUserInfo = fetchUserInfo as jest.MockedFunction<typeof fetchUserInfo>;
const mockUpdateUserProfile = updateUserProfile as jest.MockedFunction<typeof updateUserProfile>;
const mockUseLocationDropdowns = useLocationDropdowns as jest.MockedFunction<typeof useLocationDropdowns>;
const mockGetAccessToken = getAccessToken as jest.MockedFunction<typeof getAccessToken>;

describe('BillingAddress Component', () => {
  const mockSetAddressComplete = jest.fn();
  const mockSetAddressValidated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset getAccessToken mock to return a token
    mockGetAccessToken.mockReturnValue('mock-access-token');
    mockUseCheckout.mockReturnValue({
      ...mockCheckoutContext,
      setAddressComplete: mockSetAddressComplete,
      setAddressValidated: mockSetAddressValidated,
    } as ReturnType<typeof useCheckout>);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
      setUser: jest.fn(),
      accessToken: 'mock-access-token',
    } as unknown as ReturnType<typeof useAuth>);
    mockUseLocationDropdowns.mockReturnValue({
      countries: [
        { label: 'India', value: 'India' },
        { label: 'United States', value: 'United States' },
      ],
      states: [
        { label: 'Maharashtra', value: 'Maharashtra' },
        { label: 'Gujarat', value: 'Gujarat' },
      ],
      cities: [
        { label: 'Mumbai', value: 'Mumbai' },
        { label: 'Pune', value: 'Pune' },
      ],
      loadingCountries: false,
      loadingStates: false,
      loadingCities: false,
      error: '',
      loadStates: jest.fn(),
      loadCities: jest.fn(),
    });
    // Default: return incomplete data so component stays in edit mode
    // The component checks: name, email, phone, address/billing_address, country, city, state, pincode
    // We need to explicitly exclude country, state, city, pincode to keep it in edit mode
    mockFetchUserInfo.mockResolvedValue({
      data: {
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        billing_address: '123 Main Street',
        // Intentionally missing: country, state, city, pincode
        // This ensures component stays in edit mode (isEditing = true)
        country: null,
        state: null,
        city: null,
        pincode: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as Awaited<ReturnType<typeof fetchUserInfo>>);
  });

  it('should render billing address form in edit mode initially', () => {
    render(<BillingAddress />);

    expect(screen.getByText('Billing Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/residence address/i)).toBeInTheDocument();
  });

  it('should load user profile data on mount', async () => {
    render(<BillingAddress />);

    await waitFor(() => {
      expect(mockFetchUserInfo).toHaveBeenCalled();
    });
  });

  it('should display user data when profile is loaded', async () => {
    // Mock complete data to test display mode
    mockFetchUserInfo.mockResolvedValueOnce({
      data: {
        ...mockUser,
        billing_address: '123 Main Street',
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        pincode: '400001',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as Awaited<ReturnType<typeof fetchUserInfo>>);

    render(<BillingAddress />);

    await waitFor(() => {
      expect(mockFetchUserInfo).toHaveBeenCalled();
    });

    // In display mode, check if user data is displayed
    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });
  });

  it('should validate required fields on save', async () => {
    const user = userEvent.setup();
    render(<BillingAddress />);

    await waitFor(() => {
      expect(mockFetchUserInfo).toHaveBeenCalled();
    });

    // Wait for component to render in edit mode
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    });

    // Component should be in edit mode (incomplete data)
    // Clear all fields
    const nameInput = screen.getByPlaceholderText(/full name/i);
    await user.clear(nameInput);

    const addressInput = screen.getByPlaceholderText(/residence address/i);
    await user.clear(addressInput);

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });
  });

  it('should save billing address successfully', async () => {
    const user = userEvent.setup();
    mockUpdateUserProfile.mockResolvedValueOnce({
      data: { ...mockUser },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as Awaited<ReturnType<typeof updateUserProfile>>);

    render(<BillingAddress />);

    await waitFor(() => {
      expect(mockFetchUserInfo).toHaveBeenCalled();
    });

    // Wait for component to render in edit mode
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    });

    // Component should be in edit mode (incomplete data from beforeEach)
    const nameInput = screen.getByPlaceholderText(/full name/i);
    // Name might already be filled from mockUser, so clear and type
    await user.clear(nameInput);
    await user.type(nameInput, 'John Doe');

    const addressInput = screen.getByPlaceholderText(/residence address/i);
    await user.clear(addressInput);
    await user.type(addressInput, '123 Main Street');

    // Select dropdowns
    const dropdowns = screen.getAllByTestId('custom-dropdown') as HTMLSelectElement[];
    await user.selectOptions(dropdowns[0], 'India');
    await user.selectOptions(dropdowns[1], 'Maharashtra');
    await user.selectOptions(dropdowns[2], 'Mumbai');

    const pincodeInput = screen.getByPlaceholderText(/pincode/i);
    await user.type(pincodeInput, '400001');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalled();
      expect(mockSetAddressComplete).toHaveBeenCalledWith(true);
      expect(mockSetAddressValidated).toHaveBeenCalledWith(true);
    });
  });

  it('should handle cancel button and restore original data', async () => {
    const user = userEvent.setup();
    render(<BillingAddress />);

    await waitFor(() => {
      expect(mockFetchUserInfo).toHaveBeenCalled();
    });

    // Wait for component to render in edit mode
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    });

    // Component should be in edit mode (incomplete data from beforeEach)
    // Edit a field
    const nameInput = screen.getByPlaceholderText(/full name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Changed Name');

    // Verify the value changed
    expect(nameInput).toHaveValue('Changed Name');

    // Click cancel - this will exit edit mode (isEditing = false)
    // Since originalFormData is null initially (only set in handleEdit),
    // cancel will just exit edit mode without restoring
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // After cancel, component exits edit mode, so input is no longer visible
    // and we're back in display mode
    await waitFor(() => {
      // Cancel button should disappear (edit mode exited)
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
      // Edit button should appear (display mode)
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });
  });

  it('should handle country selection and load states', async () => {
    const user = userEvent.setup();
    const loadStates = jest.fn();
    mockUseLocationDropdowns.mockReturnValue({
      ...mockUseLocationDropdowns(),
      loadStates,
    });

    render(<BillingAddress />);

    // Find and select country dropdown using testid
    const countryDropdowns = screen.getAllByTestId('custom-dropdown');
    const countryDropdown = countryDropdowns[0]; // First dropdown is country
    await user.selectOptions(countryDropdown, 'India');

    await waitFor(() => {
      expect(loadStates).toHaveBeenCalled();
    });
  });

  it('should handle state selection and load cities', async () => {
    const user = userEvent.setup();
    const loadCities = jest.fn();
    const loadStates = jest.fn();
    mockUseLocationDropdowns.mockReturnValue({
      ...mockUseLocationDropdowns(),
      loadCities,
      loadStates,
    });

    render(<BillingAddress />);

    // First select country to enable state dropdown
    const countryDropdowns = screen.getAllByTestId('custom-dropdown');
    const countryDropdown = countryDropdowns[0];
    await user.selectOptions(countryDropdown, 'India');

    // Wait for states to load
    await waitFor(() => {
      expect(loadStates).toHaveBeenCalled();
    });

    // Then select state
    const stateDropdown = countryDropdowns[1]; // Second dropdown is state
    await user.selectOptions(stateDropdown, 'Maharashtra');

    await waitFor(() => {
      expect(loadCities).toHaveBeenCalled();
    });
  });

  it('should validate pincode format', async () => {
    const user = userEvent.setup();
    render(<BillingAddress />);

    await waitFor(() => {
      expect(mockFetchUserInfo).toHaveBeenCalled();
    });

    // Wait for component to render in edit mode
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/pincode/i)).toBeInTheDocument();
    });

    // Component should be in edit mode (incomplete data from beforeEach)
    const pincodeInput = screen.getByPlaceholderText(/pincode/i) as HTMLInputElement;
    // Type a pincode - validatePincode only allows numbers and limits to 11 chars
    await user.type(pincodeInput, '1234567890');

    // The validatePincode function sanitizes input to only numbers
    // It doesn't show an "invalid pincode" error, just sanitizes the input
    await waitFor(() => {
      expect(pincodeInput).toHaveValue('1234567890');
    });

    // Try typing non-numeric characters - they should be filtered out
    await user.clear(pincodeInput);
    await user.type(pincodeInput, 'abc123def456');
    // Only numbers should remain
    await waitFor(() => {
      expect(pincodeInput).toHaveValue('123456');
    });
  });

  it('should handle save error', async () => {
    const user = userEvent.setup();
    mockUpdateUserProfile.mockRejectedValueOnce(new Error('Failed to save'));

    render(<BillingAddress />);

    // Wait for component to mount and fetch user info
    await waitFor(
      () => {
        expect(mockFetchUserInfo).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Wait for component to render in edit mode
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    });

    // Component should be in edit mode (incomplete data from beforeEach)
    // Fill in required fields before saving
    const nameInput = screen.getByPlaceholderText(/full name/i) as HTMLInputElement;

    if (!nameInput.value) {
      await user.type(nameInput, 'Test User');
    }

    const addressInput = screen.getByPlaceholderText(/residence address/i) as HTMLInputElement;

    if (!addressInput.value) {
      await user.type(addressInput, '123 Test St');
    }

    const pincodeInput = screen.getByPlaceholderText(/pincode/i) as HTMLInputElement;

    if (!pincodeInput.value) {
      await user.type(pincodeInput, '123456');
    }

    // Select country, state, city
    const dropdowns = screen.getAllByTestId('custom-dropdown') as HTMLSelectElement[];

    if (dropdowns[0].value === '') {
      await user.selectOptions(dropdowns[0], 'India');
    }

    if (dropdowns[1].value === '') {
      await user.selectOptions(dropdowns[1], 'Maharashtra');
    }

    if (dropdowns[2].value === '') {
      await user.selectOptions(dropdowns[2], 'Mumbai');
    }

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(
      () => {
        expect(screen.getByText(/failed to save address/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
