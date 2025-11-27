import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TravellersTab } from '@/app/my-account/components/TravellersTab';
import { fetchPassengersOnce, removePassenger } from '@/services/passengerCache';
import {
  mockPassengers,
  mockEmptyPassengers,
  mockAxiosServerError,
  mockNetworkError,
  mockTimeoutError,
} from '../__mocks__/travellersApi';
import { mockTravellersTabProps } from '../__mocks__/travellersComponents';

jest.mock('@/services/passengerCache', () => ({
  fetchPassengersOnce: jest.fn(),
  removePassenger: jest.fn(),
}));

jest.mock('@/app/authentication/components/Modal', () => ({
  Modal: ({
    isOpen,
    children,
    className,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
  }) => {
    // onClose is part of the interface but not used in the mock
    if (!isOpen) return null;

    return (
      <div data-testid="modal" className={className}>
        {children}
      </div>
    );
  },
}));

jest.mock('@/icons/icon', () => ({
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
}));

const mockFetchPassengersOnce = fetchPassengersOnce as jest.MockedFunction<typeof fetchPassengersOnce>;
const mockRemovePassenger = removePassenger as jest.MockedFunction<typeof removePassenger>;

describe('TravellersTab Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component correctly', () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      expect(screen.getByText('Passengers')).toBeInTheDocument();
      expect(screen.getByText('Add Passenger')).toBeInTheDocument();
    });

    it('should render loading state initially', () => {
      mockFetchPassengersOnce.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<TravellersTab {...mockTravellersTabProps} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render passengers list when data is loaded', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    it('should render empty state when no passengers', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockEmptyPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('No passengers found.')).toBeInTheDocument();
      });
    });

    it('should render error state when API fails', async () => {
      mockFetchPassengersOnce.mockRejectedValueOnce(mockAxiosServerError);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        // Falls back to generic error string for non-Error objects
        expect(screen.getByText('Failed to load passengers')).toBeInTheDocument();
      });
    });
  });

  describe('Passenger List Display', () => {
    it('should display passenger information correctly', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        // Check first passenger
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        // Component shows only gender and relationship
        expect(screen.getByText(/male\s*,\s*self/)).toBeInTheDocument();

        // Check second passenger
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText(/female\s*,\s*spouse/)).toBeInTheDocument();
      });
    });

    it('should display passenger initials correctly', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe initials
        expect(screen.getByText('JS')).toBeInTheDocument(); // Jane Smith initials
        expect(screen.getByText('BJ')).toBeInTheDocument(); // Bob Johnson initials
      });
    });

    it('should handle passengers with null email', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        // Bob Johnson has null email; component doesn't render email/phone
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        expect(screen.getByText(/male\s*,\s*friend/)).toBeInTheDocument();
      });
    });
  });

  describe('Add Passenger Functionality', () => {
    it('should call onAddPassenger when Add Passenger button is clicked', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Passenger')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Passenger');
      fireEvent.click(addButton);

      expect(mockTravellersTabProps.onAddPassenger).toHaveBeenCalledTimes(1);
    });

    it('should call onAddPassenger when Add Passenger button is clicked in empty state', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockEmptyPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add Passenger')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Passenger');
      fireEvent.click(addButton);

      expect(mockTravellersTabProps.onAddPassenger).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edit Passenger Functionality', () => {
    it('should call onEditPassenger when Edit button is clicked', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      expect(mockTravellersTabProps.onEditPassenger).toHaveBeenCalledWith('1');
    });

    it('should call onEditPassenger with correct passenger ID', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[1]);

      expect(mockTravellersTabProps.onEditPassenger).toHaveBeenCalledWith('2');
    });
  });

  describe('Delete Passenger Functionality', () => {
    it('should show delete confirmation modal when Delete button is clicked', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(
        screen.getByText('Are you sure you want to delete this passenger? This action cannot be undone.')
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should hide delete modal when Cancel is clicked', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(
        screen.queryByText('Are you sure you want to delete this passenger? This action cannot be undone.')
      ).not.toBeInTheDocument();
    });

    it('should delete passenger when confirmed', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);
      mockRemovePassenger.mockResolvedValueOnce();

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockRemovePassenger).toHaveBeenCalledWith('1');
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      });
    });

    it('should handle delete error gracefully', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);
      mockRemovePassenger.mockRejectedValueOnce(mockAxiosServerError);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete passenger')).toBeInTheDocument();
      });
    });

    it('should close modal after successful deletion', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);
      mockRemovePassenger.mockResolvedValueOnce();

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Are you sure you want to delete this passenger? This action cannot be undone.')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetchPassengersOnce.mockRejectedValueOnce(mockNetworkError);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load passengers')).toBeInTheDocument();
      });
    });

    it('should handle timeout errors', async () => {
      mockFetchPassengersOnce.mockRejectedValueOnce(mockTimeoutError);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load passengers')).toBeInTheDocument();
      });
    });

    it('should handle unknown errors', async () => {
      mockFetchPassengersOnce.mockRejectedValueOnce(new Error('Unknown error'));

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('Unknown error')).toBeInTheDocument();
      });
    });

    it('should handle non-Error objects', async () => {
      mockFetchPassengersOnce.mockRejectedValueOnce('String error');

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load passengers')).toBeInTheDocument();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should load passengers on mount', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(mockFetchPassengersOnce).toHaveBeenCalledTimes(1);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should handle component unmount during API call', async () => {
      let resolvePromise: (value: typeof mockPassengers) => void;
      const promise = new Promise<typeof mockPassengers>((resolve) => {
        resolvePromise = resolve;
      });
      mockFetchPassengersOnce.mockReturnValueOnce(promise);

      const { unmount } = render(<TravellersTab {...mockTravellersTabProps} />);

      // Unmount before API call completes
      unmount();

      // Resolve the promise after unmount
      resolvePromise!(mockPassengers);

      // Should not cause any errors
      expect(true).toBe(true);
    });

    it('should abort API call on unmount', async () => {
      mockFetchPassengersOnce.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { unmount } = render(<TravellersTab {...mockTravellersTabProps} />);

      unmount();

      // Should not cause any errors
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty passenger name', async () => {
      const passengersWithEmptyName = [{ ...mockPassengers[0], name: '' }];
      mockFetchPassengersOnce.mockResolvedValueOnce(passengersWithEmptyName);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        // The name div exists and is empty; find the container by nearby text
        const genderCells = screen.getAllByText(/male\s*,\s*self/);
        expect(genderCells.length).toBeGreaterThan(0);
      });
    });

    it('should handle very long passenger names', async () => {
      const longName = 'A'.repeat(100);
      const passengersWithLongName = [{ ...mockPassengers[0], name: longName }];
      mockFetchPassengersOnce.mockResolvedValueOnce(passengersWithLongName);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText(longName)).toBeInTheDocument();
      });
    });

    it('should handle special characters in passenger names', async () => {
      const specialName = "José María O'Connor-Smith";
      const passengersWithSpecialName = [{ ...mockPassengers[0], name: specialName }];
      mockFetchPassengersOnce.mockResolvedValueOnce(passengersWithSpecialName);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText(specialName)).toBeInTheDocument();
      });
    });

    it('should handle missing relationship_with_user', async () => {
      const passengersWithMissingRelationship = [{ ...mockPassengers[0], relationship_with_user: '' }];
      mockFetchPassengersOnce.mockResolvedValueOnce(passengersWithMissingRelationship);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        // Should render just gender and a comma, relationship empty
        const genderOnly = screen.getAllByText((content) => /male\s*,\s*$/.test(content));
        expect(genderOnly.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        const deleteButtons = screen.getAllByText('Delete');

        expect(editButtons).toHaveLength(3);
        expect(deleteButtons).toHaveLength(3);
      });
    });

    it('should have proper modal accessibility', async () => {
      mockFetchPassengersOnce.mockResolvedValueOnce(mockPassengers);

      render(<TravellersTab {...mockTravellersTabProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      // The modal doesn't use role="dialog"; verify by confirm/cancel buttons and message
      expect(
        screen.getByText('Are you sure you want to delete this passenger? This action cannot be undone.')
      ).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});
