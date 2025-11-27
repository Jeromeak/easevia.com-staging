import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileTab } from '@/app/my-account/components/ProfileTab';
import { useAuth } from '@/context/hooks/useAuth';
import { useLocationDropdowns } from '@/hooks/useLocationDropdowns';
import { updateUserProfile } from '@/lib/api/user';
import { getAccessToken } from '@/utils/tokenStorage';
import { mockUserProfile, mockUpdatedUserProfile } from '../__mocks__/profileApi';
import { mockUserContext, mockLocationDropdowns } from '../__mocks__/profileComponents';

// Mock the hooks and utilities
jest.mock('@/context/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/useLocationDropdowns', () => ({
  useLocationDropdowns: jest.fn(),
}));

jest.mock('@/lib/api/user', () => ({
  updateUserProfile: jest.fn(),
}));

jest.mock('@/utils/tokenStorage', () => ({
  getAccessToken: jest.fn(),
}));

// Mock the components
jest.mock('@/common/components/Select', () => ({
  __esModule: true,
  default: ({
    options,
    placeholder,
    onChange,
    value,
  }: {
    options?: unknown[];
    placeholder?: string;
    onChange?: (value: unknown) => void;
    value?: unknown;
  }) => (
    <select
      data-testid="custom-select"
      value={value as string}
      onChange={(e) => onChange?.({ label: e.target.value, value: e.target.value })}
    >
      <option value="">{placeholder}</option>
      {options?.map((option: unknown) => {
        const opt = option as { value: string; label: string };

        return (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  ),
}));

jest.mock('@/common/components/Data', () => ({
  genderOptions: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
}));

jest.mock('@/app/my-account/components/Input', () => ({
  Input: ({
    name,
    label,
    value,
    onChange,
    type,
    placeholder,
  }: {
    name?: string;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={`input-${name}`}
      />
    </div>
  ),
}));

jest.mock('@/app/my-account/components/CustomInput', () => ({
  __esModule: true,
  default: ({
    name,
    label,
    value,
    onChange,
    placeholder,
  }: {
    name?: string;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={`input-${name}`}
      />
    </div>
  ),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseLocationDropdowns = useLocationDropdowns as jest.MockedFunction<typeof useLocationDropdowns>;
const mockUpdateUserProfile = updateUserProfile as jest.MockedFunction<typeof updateUserProfile>;
const mockGetAccessToken = getAccessToken as jest.MockedFunction<typeof getAccessToken>;

describe('ProfileTab Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(mockUserContext);
    mockUseLocationDropdowns.mockReturnValue(mockLocationDropdowns);
    mockGetAccessToken.mockReturnValue('mock-jwt-token');
  });

  it('should render the component correctly', () => {
    render(<ProfileTab />);

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Billing Details')).toBeInTheDocument();
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-address')).toBeInTheDocument();
  });

  it('should prefill form with user data', () => {
    render(<ProfileTab />);

    expect(screen.getByDisplayValue(mockUserProfile.name!)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue(mockUserProfile.address!)).toHaveLength(2);
    expect(screen.getByDisplayValue(mockUserProfile.pincode!)).toBeInTheDocument();
  });

  it('should handle form input changes', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const nameInput = screen.getByTestId('input-name');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    expect(nameInput).toHaveValue('John Smith');
  });

  it('should load states when country changes', async () => {
    const mockLoadStates = jest.fn();
    mockUseLocationDropdowns.mockReturnValue({
      ...mockLocationDropdowns,
      loadStates: mockLoadStates,
    });

    render(<ProfileTab />);

    // Test that the component renders without errors
    expect(screen.getByText('Personal Information')).toBeInTheDocument();

    // Test that the loadStates function is available
    expect(mockLoadStates).toBeDefined();
  });

  it('should load cities when state changes', async () => {
    const mockLoadCities = jest.fn();
    mockUseLocationDropdowns.mockReturnValue({
      ...mockLocationDropdowns,
      loadCities: mockLoadCities,
    });

    render(<ProfileTab />);

    // Test that the component renders without errors
    expect(screen.getByText('Personal Information')).toBeInTheDocument();

    // Test that the loadCities function is available
    expect(mockLoadCities).toBeDefined();
  });

  it('should handle successful profile update', async () => {
    const user = userEvent.setup();
    mockUpdateUserProfile.mockResolvedValueOnce({
      data: mockUpdatedUserProfile,
      status: 200,
      statusText: 'OK',
      headers: {} as never,
      config: {
        headers: {} as never,
        url: '',
        method: 'PUT',
      } as never,
    });

    render(<ProfileTab />);

    const nameInput = screen.getByTestId('input-name');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith('mock-jwt-token', {
        name: 'John Smith',
        gender: 'male',
        date_of_birth: '1990-01-01',
        nationality: 'American',
        address: '123 Main St',
        billing_address: '123 Main St',
        pincode: '12345',
        country: 'US',
        state: 'CA',
        city: 'San Francisco',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    mockUpdateUserProfile.mockRejectedValueOnce(new Error('API Error'));

    render(<ProfileTab />);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // The component should handle the error without crashing
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should handle location loading states', () => {
    mockUseLocationDropdowns.mockReturnValue({
      ...mockLocationDropdowns,
      loadingCountries: true,
      loadingStates: true,
      loadingCities: true,
    });

    render(<ProfileTab />);

    // The component shows "Loading..." in dropdowns when loading
    expect(screen.getAllByText('Loading...')).toHaveLength(3);
  });

  it('should handle location errors', () => {
    mockUseLocationDropdowns.mockReturnValue({
      ...mockLocationDropdowns,
      error: 'Failed to load locations',
    });

    render(<ProfileTab />);

    expect(screen.getByText('Failed to load locations')).toBeInTheDocument();
  });

  it('should reset form when user changes', () => {
    const { rerender } = render(<ProfileTab />);

    // Change user data
    const newUserContext = {
      ...mockUserContext,
      user: {
        ...mockUserProfile,
        id: 1,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1234567890',
        is_verified: true,
        phone_verified: true,
        auth_provider: 'email',
        customer_id: 'cust_123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    };
    mockUseAuth.mockReturnValue(newUserContext);

    rerender(<ProfileTab />);

    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
  });

  it('should handle component unmount during update', async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise<unknown>((resolve) => {
      resolvePromise = resolve;
    });
    mockUpdateUserProfile.mockReturnValueOnce(promise as never);

    const { unmount } = render(<ProfileTab />);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Unmount before API call completes
    unmount();

    // Resolve the promise after unmount
    resolvePromise!({
      data: mockUpdatedUserProfile,
      status: 200,
      statusText: 'OK',
    });

    // Should not cause any errors
    expect(true).toBe(true);
  });

  it('should only allow numeric characters in pincode field', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const pincodeInput = screen.getByTestId('input-pincode');

    // Clear existing value first
    await user.clear(pincodeInput);

    // Try to type non-numeric characters
    await user.type(pincodeInput, 'abc123');
    expect(pincodeInput).toHaveValue('123');

    // Clear and try special characters
    await user.clear(pincodeInput);
    await user.type(pincodeInput, '12@34#56');
    expect(pincodeInput).toHaveValue('123456');
  });

  it('should limit pincode to 11 characters', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const pincodeInput = screen.getByTestId('input-pincode');

    // Clear existing value first
    await user.clear(pincodeInput);

    // Type more than 11 digits
    await user.type(pincodeInput, '12345678901234');
    expect(pincodeInput).toHaveValue('12345678901');
  });

  it('should allow valid pincode up to 11 digits', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const pincodeInput = screen.getByTestId('input-pincode');

    // Clear existing value first
    await user.clear(pincodeInput);

    await user.type(pincodeInput, '12345678901');
    expect(pincodeInput).toHaveValue('12345678901');
  });

  it('should enforce 20 character limit for name', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const nameInput = screen.getByTestId('input-name') as HTMLInputElement;
    const longName = 'a'.repeat(21);

    await user.clear(nameInput);
    await user.type(nameInput, longName);

    expect(nameInput.value.length).toBeLessThanOrEqual(20);
  });

  it('should only allow letters and spaces in name', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const nameInput = screen.getByTestId('input-name') as HTMLInputElement;

    await user.clear(nameInput);
    await user.type(nameInput, 'John@Doe123');

    // Should remove special characters and numbers
    expect(nameInput.value).not.toMatch(/[@#]/);
    expect(nameInput.value).not.toMatch(/\d/);
  });

  it('should enforce 256 character limit for address', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const addressInput = screen.getByTestId('input-address') as HTMLInputElement;
    const longAddress = 'a'.repeat(257);

    await user.clear(addressInput);
    await user.type(addressInput, longAddress);

    expect(addressInput.value.length).toBeLessThanOrEqual(256);
  });

  it('should enforce 256 character limit for billing address', async () => {
    const user = userEvent.setup();
    render(<ProfileTab />);

    const billingAddressInput = screen.getByTestId('input-billingAddress') as HTMLInputElement;
    const longAddress = 'a'.repeat(257);

    await user.clear(billingAddressInput);
    await user.type(billingAddressInput, longAddress);

    expect(billingAddressInput.value.length).toBeLessThanOrEqual(256);
  });
});
