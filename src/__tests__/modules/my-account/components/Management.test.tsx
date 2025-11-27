import React from 'react';
import { render, screen } from '@testing-library/react';
import { Management } from '@/app/my-account/components/Management';
import { useAuth } from '@/context/hooks/useAuth';

// Mock dependencies
jest.mock('@/context/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn((key: string) => {
      if (key === 'tab') return 'profile';
      if (key === 'id') return null;

      return null;
    }),
  }),
}));

jest.mock('@/app/my-account/components/ProfileTab', () => ({
  ProfileTab: () => <div data-testid="profile-tab">Profile Tab</div>,
}));

jest.mock('@/app/my-account/components/TripsTab', () => ({
  TripsTab: () => <div data-testid="trips-tab">Trips Tab</div>,
}));

jest.mock('@/app/my-account/components/PlanTab', () => ({
  PlanTab: ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => (
    <div data-testid="plan-tab">
      <button onClick={() => setActiveTab('My Profile')}>Go to Profile</button>
    </div>
  ),
}));

jest.mock('@/app/my-account/components/TravellersTab', () => ({
  TravellersTab: ({
    onAddPassenger,
    onEditPassenger,
  }: {
    onAddPassenger: () => void;
    onEditPassenger: (id: string) => void;
  }) => (
    <div data-testid="travellers-tab">
      <button onClick={onAddPassenger}>Add Passenger</button>
      <button onClick={() => onEditPassenger('1')}>Edit Passenger</button>
    </div>
  ),
}));

jest.mock('@/app/my-account/components/SupportTab', () => ({
  SupportTab: ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => (
    <div data-testid="support-tab">
      <button onClick={() => setActiveTab('My Profile')}>Go to Profile</button>
    </div>
  ),
}));

jest.mock('@/app/my-account/components/AddEditTraveller', () => ({
  AddEditTraveller: ({
    mode,
    setActiveTab,
    passengerId,
  }: {
    mode: string;
    setActiveTab: (tab: string) => void;
    passengerId?: string;
  }) => (
    <div data-testid="add-edit-traveller">
      <div>Mode: {mode}</div>
      <div>Passenger ID: {passengerId || 'none'}</div>
      <button onClick={() => setActiveTab('My Profile')}>Go to Profile</button>
    </div>
  ),
}));

jest.mock('@/app/my-account/components/UserData', () => ({
  UserData: ({ progress, activeTab }: { progress: number; activeTab: string }) => (
    <div data-testid="user-data">
      <div data-testid="progress">{progress}%</div>
      <div data-testid="active-tab">{activeTab}</div>
    </div>
  ),
}));

jest.mock('@/context/PassengerManagementContext', () => ({
  PassengerManagementProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Management - Profile Progress Calculation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate 0% progress when user is not available', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });

    render(<Management />);

    expect(screen.getByTestId('progress')).toHaveTextContent('0%');
  });

  it('should calculate 0% progress when no profile fields are filled', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
        phone: '+1234567890',
      },
    });

    render(<Management />);

    expect(screen.getByTestId('progress')).toHaveTextContent('0%');
  });

  it('should calculate 100% progress when all profile fields are filled', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
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
        city: 'Los Angeles',
      },
    });

    render(<Management />);

    expect(screen.getByTestId('progress')).toHaveTextContent('100%');
  });

  it('should calculate 50% progress when half of profile fields are filled', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        gender: 'male',
        date_of_birth: '1990-01-01',
        nationality: 'American',
        address: '123 Main St',
        billing_address: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
      },
    });

    render(<Management />);

    expect(screen.getByTestId('progress')).toHaveTextContent('50%');
  });

  it('should calculate 30% progress when 3 out of 10 fields are filled', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        gender: 'male',
        date_of_birth: '1990-01-01',
        nationality: '',
        address: '',
        billing_address: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
      },
    });

    render(<Management />);

    expect(screen.getByTestId('progress')).toHaveTextContent('30%');
  });

  it('should handle empty string values as unfilled fields', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
        phone: '+1234567890',
        name: '',
        gender: '',
        date_of_birth: '',
        nationality: '',
        address: '',
        billing_address: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
      },
    });

    render(<Management />);

    expect(screen.getByTestId('progress')).toHaveTextContent('0%');
  });

  it('should update progress when user data changes', () => {
    const { rerender } = render(<Management />);

    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
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
        city: 'Los Angeles',
      },
    });

    rerender(<Management />);

    expect(screen.getByTestId('progress')).toHaveTextContent('100%');
  });
});
