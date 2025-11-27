import {
  fetchPassengersOnce,
  addPassenger,
  editPassenger,
  removePassenger,
  clearPassengerCache,
  getCachedPassengers,
} from '@/services/passengerCache';
import { fetchPassengers, createPassenger, updatePassenger, deletePassenger } from '@/lib/api/passenger';
import {
  mockPassengers,
  mockEmptyPassengers,
  mockAxiosServerError,
  mockNetworkError,
} from '../__mocks__/travellersApi';

jest.mock('@/lib/api/passenger', () => ({
  fetchPassengers: jest.fn(),
  createPassenger: jest.fn(),
  updatePassenger: jest.fn(),
  deletePassenger: jest.fn(),
}));

const mockFetchPassengers = fetchPassengers as jest.MockedFunction<typeof fetchPassengers>;
const mockCreatePassenger = createPassenger as jest.MockedFunction<typeof createPassenger>;
const mockUpdatePassenger = updatePassenger as jest.MockedFunction<typeof updatePassenger>;
const mockDeletePassenger = deletePassenger as jest.MockedFunction<typeof deletePassenger>;

describe('Passenger Cache Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearPassengerCache();
  });

  describe('fetchPassengersOnce', () => {
    it('should fetch passengers from API when cache is empty', async () => {
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);

      const result = await fetchPassengersOnce();

      expect(mockFetchPassengers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPassengers);
    });

    it('should return cached passengers on subsequent calls', async () => {
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);

      // First call
      const result1 = await fetchPassengersOnce();
      expect(mockFetchPassengers).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await fetchPassengersOnce();
      expect(mockFetchPassengers).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('should handle concurrent calls without duplicate API requests', async () => {
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);

      // Make concurrent calls
      const [result1, result2, result3] = await Promise.all([
        fetchPassengersOnce(),
        fetchPassengersOnce(),
        fetchPassengersOnce(),
      ]);

      expect(mockFetchPassengers).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(mockPassengers);
      expect(result2).toEqual(mockPassengers);
      expect(result3).toEqual(mockPassengers);
    });

    it('should handle API errors gracefully', async () => {
      mockFetchPassengers.mockRejectedValueOnce(mockAxiosServerError);

      await expect(fetchPassengersOnce()).rejects.toBeDefined();
    });

    it('should handle network errors', async () => {
      mockFetchPassengers.mockRejectedValueOnce(mockNetworkError);

      await expect(fetchPassengersOnce()).rejects.toBeDefined();
    });

    it('should reset inflight promise after error', async () => {
      mockFetchPassengers.mockRejectedValueOnce(mockAxiosServerError);

      try {
        await fetchPassengersOnce();
      } catch {
        // Expected to throw
      }

      // Next call should make new API request
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      const result = await fetchPassengersOnce();

      expect(mockFetchPassengers).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockPassengers);
    });
  });

  describe('addPassenger', () => {
    const mockCreateRequest = {
      name: 'New Passenger',
      nationality: 'American',
      gender: 'male',
      date_of_birth: '1990-01-01',
      relationship_with_user: 'self',
      mobile_number: '+1234567890',
      email: 'new@example.com',
      passport_given_name: 'New',
      passport_surname: 'Passenger',
      passport_number: 'NEW123456',
      passport_expiry: '2030-01-01',
      passport_issuing_country: 'US',
    };

    it('should add passenger and update cache', async () => {
      const newPassenger = { ...mockPassengers[0], ...mockCreateRequest, id: 'new-id' };
      mockCreatePassenger.mockResolvedValueOnce(newPassenger);

      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();

      const result = await addPassenger(mockCreateRequest);

      expect(mockCreatePassenger).toHaveBeenCalledWith(mockCreateRequest);
      expect(result).toEqual(newPassenger);
      expect(getCachedPassengers()).toContain(newPassenger);
    });

    it('should add passenger to empty cache', async () => {
      const newPassenger = { ...mockPassengers[0], ...mockCreateRequest, id: 'new-id' };
      mockCreatePassenger.mockResolvedValueOnce(newPassenger);

      const result = await addPassenger(mockCreateRequest);

      expect(mockCreatePassenger).toHaveBeenCalledWith(mockCreateRequest);
      expect(result).toEqual(newPassenger);
      // Cache remains null until a list fetch occurs
      expect(getCachedPassengers()).toBeNull();
    });

    it('should handle API errors', async () => {
      mockCreatePassenger.mockRejectedValueOnce(mockAxiosServerError);

      await expect(addPassenger(mockCreateRequest)).rejects.toBeDefined();
    });

    it('should not update cache on API error', async () => {
      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();
      const originalCache = getCachedPassengers();

      mockCreatePassenger.mockRejectedValueOnce(mockAxiosServerError);

      try {
        await addPassenger(mockCreateRequest);
      } catch {
        // Expected to throw
      }

      expect(getCachedPassengers()).toEqual(originalCache);
    });
  });

  describe('editPassenger', () => {
    const mockUpdateRequest = {
      name: 'Updated Passenger',
      email: 'updated@example.com',
    };

    it('should edit passenger and update cache', async () => {
      const updatedPassenger = { ...mockPassengers[0], ...mockUpdateRequest };
      mockUpdatePassenger.mockResolvedValueOnce(updatedPassenger);

      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();

      const result = await editPassenger('1', mockUpdateRequest);

      expect(mockUpdatePassenger).toHaveBeenCalledWith('1', mockUpdateRequest);
      expect(result).toEqual(updatedPassenger);
      expect(getCachedPassengers()?.find((p) => p.id === '1')).toEqual(updatedPassenger);
    });

    it('should handle API errors', async () => {
      mockUpdatePassenger.mockRejectedValueOnce(mockAxiosServerError);

      await expect(editPassenger('1', mockUpdateRequest)).rejects.toBeDefined();
    });

    it('should not update cache on API error', async () => {
      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();
      const originalCache = getCachedPassengers();

      mockUpdatePassenger.mockRejectedValueOnce(mockAxiosServerError);

      try {
        await editPassenger('1', mockUpdateRequest);
      } catch {
        // Expected to throw
      }

      expect(getCachedPassengers()).toEqual(originalCache);
    });

    it('should handle editing non-existent passenger in cache', async () => {
      const updatedPassenger = { ...mockPassengers[0], ...mockUpdateRequest };
      mockUpdatePassenger.mockResolvedValueOnce(updatedPassenger);

      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();

      const result = await editPassenger('999', mockUpdateRequest);

      expect(result).toEqual(updatedPassenger);
      // Should not be added to cache since it's not in the original list
      expect(getCachedPassengers()?.find((p) => p.id === '999')).toBeUndefined();
    });
  });

  describe('removePassenger', () => {
    it('should remove passenger and update cache', async () => {
      mockDeletePassenger.mockResolvedValueOnce({ message: 'Deleted successfully' });

      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();

      await removePassenger('1');

      expect(mockDeletePassenger).toHaveBeenCalledWith('1');
      expect(getCachedPassengers()?.find((p) => p.id === '1')).toBeUndefined();
    });

    it('should handle API errors', async () => {
      mockDeletePassenger.mockRejectedValueOnce(mockAxiosServerError);

      await expect(removePassenger('1')).rejects.toBeDefined();
    });

    it('should not update cache on API error', async () => {
      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();
      const originalCache = getCachedPassengers();

      mockDeletePassenger.mockRejectedValueOnce(mockAxiosServerError);

      try {
        await removePassenger('1');
      } catch {
        // Expected to throw
      }

      expect(getCachedPassengers()).toEqual(originalCache);
    });

    it('should handle removing non-existent passenger', async () => {
      mockDeletePassenger.mockResolvedValueOnce({ message: 'Deleted successfully' });

      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();
      const originalCache = getCachedPassengers();

      await removePassenger('999');

      expect(mockDeletePassenger).toHaveBeenCalledWith('999');
      expect(getCachedPassengers()).toEqual(originalCache);
    });
  });

  describe('clearPassengerCache', () => {
    it('should clear cached passengers', async () => {
      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();
      expect(getCachedPassengers()).toEqual(mockPassengers);

      clearPassengerCache();

      expect(getCachedPassengers()).toBeNull();
    });

    it('should allow fresh fetch after clearing cache', async () => {
      // Pre-populate cache
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();

      clearPassengerCache();

      // Next call should make new API request
      mockFetchPassengers.mockResolvedValueOnce(mockEmptyPassengers);
      const result = await fetchPassengersOnce();

      expect(mockFetchPassengers).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockEmptyPassengers);
    });
  });

  describe('getCachedPassengers', () => {
    it('should return null when cache is empty', () => {
      expect(getCachedPassengers()).toBeNull();
    });

    it('should return cached passengers when available', async () => {
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();

      expect(getCachedPassengers()).toEqual(mockPassengers);
    });
  });

  describe('Cache Consistency', () => {
    it('should maintain cache consistency across operations', async () => {
      // Initial fetch
      mockFetchPassengers.mockResolvedValueOnce(mockPassengers);
      await fetchPassengersOnce();

      // Add passenger
      const newPassenger = { ...mockPassengers[0], id: 'new-id', name: 'New Passenger' };
      mockCreatePassenger.mockResolvedValueOnce(newPassenger);
      await addPassenger({
        name: 'New Passenger',
        nationality: 'American',
        gender: 'male',
        date_of_birth: '1990-01-01',
        relationship_with_user: 'self',
        mobile_number: '+1234567890',
        email: 'new@example.com',
        passport_given_name: 'New',
        passport_surname: 'Passenger',
        passport_number: 'NEW123456',
        passport_expiry: '2030-01-01',
        passport_issuing_country: 'US',
      });

      // Edit passenger
      const updatedPassenger = { ...mockPassengers[0], name: 'Updated Passenger' };
      mockUpdatePassenger.mockResolvedValueOnce(updatedPassenger);
      await editPassenger('1', { name: 'Updated Passenger' });

      // Remove passenger
      mockDeletePassenger.mockResolvedValueOnce({ message: 'Deleted successfully' });
      await removePassenger('2');

      const finalCache = getCachedPassengers();
      expect(finalCache).toHaveLength(3); // Original 3 passengers - 1 deleted + 1 added = 3
      expect(finalCache?.find((p) => p.id === '1')?.name).toBe('Updated Passenger');
      expect(finalCache?.find((p) => p.id === '2')).toBeUndefined();
      expect(finalCache?.find((p) => p.id === 'new-id')).toBeDefined();
    });
  });
});
