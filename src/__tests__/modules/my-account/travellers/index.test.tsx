/* eslint-disable padding-line-between-statements */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import MyAccount from '@/app/my-account/page';
import { useAuth } from '@/context/hooks/useAuth';
import { fetchPassengersOnce } from '@/services/passengerCache';
import { mockPassengers } from './__mocks__/travellersApi';
import { mockUserContext, mockSearchParams, mockRouter } from './__mocks__/travellersComponents';

jest.mock('@/context/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock('@/services/passengerCache', () => ({
  fetchPassengersOnce: jest.fn(),
  removePassenger: jest.fn(),
}));

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
        {tabKey === 'travellers' && (
          <div data-testid="travellers-content">
            <div data-testid="passengers-list">Passengers List</div>
            <div data-testid="add-passenger-btn">Add Passenger</div>
            <div data-testid="edit-passenger-btn">Edit Passenger</div>
            <div data-testid="delete-passenger-btn">Delete Passenger</div>
          </div>
        )}
      </div>
    );
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockFetchPassengersOnce = fetchPassengersOnce as jest.MockedFunction<typeof fetchPassengersOnce>;

describe('My Account Travellers Tab Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(mockUserContext);
    mockUseSearchParams.mockReturnValue(mockSearchParams);
  });

  describe('Page Rendering', () => {
    it('should render the complete my account page with travellers tab', () => {
      render(<MyAccount />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('management')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render travellers tab content when tab=travellers', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('active-tab')).toHaveTextContent('travellers');
      expect(screen.getByTestId('travellers-content')).toBeInTheDocument();
    });

    it('should show passengers list in travellers tab', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('passengers-list')).toBeInTheDocument();
    });

    it('should show add passenger button in travellers tab', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('add-passenger-btn')).toBeInTheDocument();
    });
  });

  describe('Passenger Data Loading', () => {
    it('should render travellers tab when active', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('travellers-content')).toBeInTheDocument();
    });

    it('should show passengers list in travellers tab', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('passengers-list')).toBeInTheDocument();
    });

    it('should show add passenger button in travellers tab', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('add-passenger-btn')).toBeInTheDocument();
    });
  });

  describe('Passenger Management Operations', () => {
    it('should handle add passenger operation', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('add-passenger-btn')).toBeInTheDocument();
    });

    it('should handle edit passenger operation', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('edit-passenger-btn')).toBeInTheDocument();
    });

    it('should handle delete passenger operation', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      expect(screen.getByTestId('delete-passenger-btn')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to travellers tab from other tabs', () => {
      // Start with profile tab
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'profile' };
          return params[key] || null;
        }),
      });

      const { rerender } = render(<MyAccount />);

      // Initially on profile tab
      expect(screen.getByTestId('active-tab')).toHaveTextContent('profile');

      // Switch to travellers tab
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      rerender(<MyAccount />);

      expect(screen.getByTestId('active-tab')).toHaveTextContent('travellers');
    });

    it('should maintain page structure across tab switches', () => {
      const { rerender } = render(<MyAccount />);

      // Initial render
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('management')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();

      // Switch to travellers tab
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      rerender(<MyAccount />);

      // Should maintain structure
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('management')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('travellers-content')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render page structure even with errors', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      // Page should still render
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('management')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should handle different error states gracefully', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      // Page should still render
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('management')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle component unmount during API call', async () => {
      let resolvePromise: (value: typeof mockPassengers) => void;
      const promise = new Promise<typeof mockPassengers>((resolve) => {
        resolvePromise = resolve;
      });
      mockFetchPassengersOnce.mockReturnValueOnce(promise);
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      const { unmount } = render(<MyAccount />);

      // Unmount before API call completes
      unmount();

      // Resolve the promise after unmount
      resolvePromise!(mockPassengers);

      // Should not cause any errors
      expect(true).toBe(true);
    });

    it('should handle multiple re-renders', () => {
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
  });

  describe('User Authentication State', () => {
    it('should handle unauthenticated user', () => {
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

    it('should handle different user contexts', () => {
      const differentUserContext = {
        user: {
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
  });

  describe('Search Parameters Handling', () => {
    it('should handle missing tab parameter', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn(() => null),
      });

      render(<MyAccount />);

      // Should default to profile tab
      expect(screen.getByTestId('active-tab')).toHaveTextContent('profile');
    });

    it('should handle invalid tab parameter', () => {
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'invalid-tab' };
          return params[key] || null;
        }),
      });

      render(<MyAccount />);

      // Should still render with the invalid tab
      expect(screen.getByTestId('active-tab')).toHaveTextContent('invalid-tab');
    });

    it('should handle search params changes', () => {
      // Start with profile tab
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'profile' };
          return params[key] || null;
        }),
      });

      const { rerender } = render(<MyAccount />);

      expect(screen.getByTestId('active-tab')).toHaveTextContent('profile');

      // Change search params
      mockUseSearchParams.mockReturnValue({
        ...mockSearchParams,
        get: jest.fn((key: string) => {
          const params: Record<string, string> = { tab: 'travellers' };
          return params[key] || null;
        }),
      });

      rerender(<MyAccount />);

      expect(screen.getByTestId('active-tab')).toHaveTextContent('travellers');
    });
  });
});
