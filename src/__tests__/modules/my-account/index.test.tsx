import React from 'react';
import { render, screen } from '@testing-library/react';
import MyAccount from '@/app/my-account/page';
import { useAuth } from '@/context/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { mockUserProfile } from './__mocks__/profileApi';
import { mockUserContext } from './__mocks__/profileComponents';

// Mock the hooks and utilities
jest.mock('@/context/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
}));

jest.mock('@/hooks/useLocationDropdowns', () => ({
  useLocationDropdowns: jest.fn(),
}));

jest.mock('@/lib/api/user', () => ({
  updateUserProfile: jest.fn(),
  fetchUserInfo: jest.fn(),
}));

jest.mock('@/utils/tokenStorage', () => ({
  getAccessToken: jest.fn(),
}));

// Mock the components
jest.mock('@/common/components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

jest.mock('@/common/components/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('@/app/my-account/components/Management', () => ({
  Management: () => {
    const mockUseSearchParams = jest.requireMock('next/navigation').useSearchParams;
    const searchParams = mockUseSearchParams();
    const tabKey = searchParams.get('tab') || 'profile';

    return (
      <div data-testid="management">
        <div data-testid="active-tab">{tabKey}</div>
      </div>
    );
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

// Helper function to create mock search params
const createMockSearchParams = (tab: string) =>
  ({
    get: jest.fn((key: string) => {
      const params: Record<string, string> = { tab };

      return params[key] || null;
    }),
    append: jest.fn(),
    delete: jest.fn(),
    set: jest.fn(),
    sort: jest.fn(),
    toString: jest.fn(() => `tab=${tab}`),
    entries: jest.fn(),
    forEach: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    [Symbol.iterator]: jest.fn(),
  }) as unknown as ReadonlyURLSearchParams;

describe('My Account Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(mockUserContext);
    mockUseSearchParams.mockReturnValue(createMockSearchParams('profile'));
  });

  it('should render the complete my account page', () => {
    render(<MyAccount />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('management')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle profile tab navigation', () => {
    render(<MyAccount />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('profile');
  });

  it('should handle different tab parameters', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams('trips'));

    render(<MyAccount />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('trips');
  });

  it('should handle missing tab parameter', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams(''));

    render(<MyAccount />);

    // Should default to profile tab
    expect(screen.getByTestId('active-tab')).toHaveTextContent('profile');
  });

  it('should handle user authentication state', () => {
    const unauthenticatedContext = {
      user: null,
      setUser: jest.fn(),
      logout: jest.fn(),
      accessToken: null,
    };
    mockUseAuth.mockReturnValue(unauthenticatedContext);

    render(<MyAccount />);

    // Should still render the page structure
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('management')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle multiple tab switches', () => {
    const { rerender } = render(<MyAccount />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('profile');

    // Switch to trips tab
    mockUseSearchParams.mockReturnValue(createMockSearchParams('trips'));

    rerender(<MyAccount />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('trips');

    // Switch to subscription tab
    mockUseSearchParams.mockReturnValue(createMockSearchParams('subscription'));

    rerender(<MyAccount />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('subscription');
  });

  it('should handle component unmount', () => {
    const { unmount } = render(<MyAccount />);

    expect(screen.getByTestId('header')).toBeInTheDocument();

    // Unmount should not cause errors
    unmount();

    expect(true).toBe(true);
  });

  it('should handle concurrent renders', () => {
    const { rerender } = render(<MyAccount />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('management')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Re-render
    rerender(<MyAccount />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('management')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle different user contexts', () => {
    const differentUserContext = {
      user: {
        ...mockUserProfile,
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1987654321',
        is_verified: true,
        phone_verified: true,
        auth_provider: 'email',
        customer_id: 'cust_456',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      setUser: jest.fn(),
      logout: jest.fn(),
      accessToken: 'mock-access-token',
    };
    mockUseAuth.mockReturnValue(differentUserContext);

    render(<MyAccount />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('management')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle search params changes', () => {
    const { rerender } = render(<MyAccount />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('profile');

    // Change search params
    mockUseSearchParams.mockReturnValue(createMockSearchParams('travellers'));

    rerender(<MyAccount />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('travellers');
  });

  it('should handle invalid tab parameters', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams('invalid-tab'));

    render(<MyAccount />);

    // Should still render with the invalid tab
    expect(screen.getByTestId('active-tab')).toHaveTextContent('invalid-tab');
  });

  it('should maintain page structure across different states', () => {
    const { rerender } = render(<MyAccount />);

    // Initial render
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('management')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Change user context
    const newUserContext = {
      user: {
        ...mockUserProfile,
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
        phone: '+1234567890',
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
    mockUseAuth.mockReturnValue(newUserContext);

    rerender(<MyAccount />);

    // Should still maintain structure
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('management')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
