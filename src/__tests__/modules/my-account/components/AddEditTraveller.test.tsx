import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddEditTraveller } from '@/app/my-account/components/AddEditTraveller';
import { usePassengerFlow } from '@/hooks/usePassengerFlow';
import { addPassenger, editPassenger } from '@/services/passengerCache';
import { useLocationDropdowns } from '@/hooks/useLocationDropdowns';
import { FormMode } from '@/lib/types/common.types';

// Mock dependencies
jest.mock('@/hooks/usePassengerFlow', () => ({
  usePassengerFlow: jest.fn(),
}));

jest.mock('@/lib/api/passenger', () => ({
  fetchPassengerById: jest.fn(),
}));

jest.mock('@/services/passengerCache', () => ({
  addPassenger: jest.fn(),
  editPassenger: jest.fn(),
}));

jest.mock('@/hooks/useLocationDropdowns', () => ({
  useLocationDropdowns: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

jest.mock('@/app/my-account/components/Input', () => ({
  Input: ({
    name,
    value,
    onChange,
    placeholder,
    maxLength,
  }: {
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    maxLength?: number;
  }) => (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      data-testid={`input-${name}`}
    />
  ),
}));

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

jest.mock('@/app/my-account/components/CustomInput', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input type="date" value={value} onChange={(e) => onChange(e.target.value)} data-testid="date-picker" />
  ),
}));

jest.mock('@/app/my-account/components/ExpiryDate', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input type="date" value={value} onChange={(e) => onChange(e.target.value)} data-testid="expiry-date-picker" />
  ),
}));

jest.mock('@/app/authentication/components/Button', () => ({
  Button: ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button onClick={onClick} data-testid="save-button">
      {label}
    </button>
  ),
}));

describe('AddEditTraveller - Validation', () => {
  const mockSetActiveTab = jest.fn();
  const mockHandlePassengerAdded = jest.fn();
  const mockHandlePassengerEdited = jest.fn();
  const mockNavigateToSubscriptionTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePassengerFlow as jest.Mock).mockReturnValue({
      handlePassengerAdded: mockHandlePassengerAdded,
      handlePassengerEdited: mockHandlePassengerEdited,
      navigateToSubscriptionTab: mockNavigateToSubscriptionTab,
    });
    (useLocationDropdowns as jest.Mock).mockReturnValue({
      countries: [
        { label: 'USA', value: 'USA' },
        { label: 'India', value: 'India' },
      ],
      states: [],
      cities: [],
    });
    (addPassenger as jest.Mock).mockResolvedValue({ id: '1' });
    (editPassenger as jest.Mock).mockResolvedValue({ id: '1' });
  });

  describe('Name Validation', () => {
    it('should enforce 20 character limit for passenger name', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const nameInput = screen.getByTestId('input-name') as HTMLInputElement;
      const longName = 'a'.repeat(21);

      await user.type(nameInput, longName);

      expect(nameInput.value.length).toBeLessThanOrEqual(20);
    });

    it('should only allow letters and spaces in passenger name', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const nameInput = screen.getByTestId('input-name') as HTMLInputElement;

      await user.type(nameInput, 'John@Doe123');

      // Should remove special characters and numbers
      expect(nameInput.value).not.toMatch(/[@#]/);
      expect(nameInput.value).not.toMatch(/\d/);
    });
  });

  describe('Mobile Validation', () => {
    it('should enforce 17 character limit for mobile number', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const mobileInput = screen.getByTestId('input-mobile') as HTMLInputElement;
      const longMobile = '+123456789012345678'; // 18 characters

      await user.type(mobileInput, longMobile);

      expect(mobileInput.value.length).toBeLessThanOrEqual(17);
    });

    it('should only allow numbers and one leading + for mobile', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const mobileInput = screen.getByTestId('input-mobile') as HTMLInputElement;

      await user.type(mobileInput, '+123abc456');

      // Should remove letters, keep only numbers and +
      expect(mobileInput.value).not.toMatch(/[a-zA-Z]/);
    });
  });

  describe('Email Validation', () => {
    it('should enforce 254 character limit for email', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const emailInput = screen.getByTestId('input-email') as HTMLInputElement;
      const longEmail = 'a'.repeat(255) + '@example.com';

      await user.type(emailInput, longEmail);

      expect(emailInput.value.length).toBeLessThanOrEqual(254);
    });
  });

  describe('Given Name and Surname Validation', () => {
    it('should enforce 20 character limit for given name', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const givenNameInput = screen.getByTestId('input-names') as HTMLInputElement;
      const longName = 'a'.repeat(21);

      await user.type(givenNameInput, longName);

      expect(givenNameInput.value.length).toBeLessThanOrEqual(20);
    });

    it('should enforce 20 character limit for surname', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const surnameInput = screen.getByTestId('input-Surname') as HTMLInputElement;
      const longName = 'a'.repeat(21);

      await user.type(surnameInput, longName);

      expect(surnameInput.value.length).toBeLessThanOrEqual(20);
    });

    it('should only allow letters and spaces in given name', async () => {
      const user = userEvent.setup();
      render(<AddEditTraveller setActiveTab={mockSetActiveTab} mode={FormMode.ADD} />);

      const givenNameInput = screen.getByTestId('input-names') as HTMLInputElement;

      await user.type(givenNameInput, 'John@Doe123');

      // Should remove special characters and numbers
      expect(givenNameInput.value).not.toMatch(/[@#]/);
      expect(givenNameInput.value).not.toMatch(/\d/);
    });
  });
});
