import {
  fetchPassengers,
  fetchPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
} from '@/lib/api/passenger';
import {
  mockPassengers,
  mockFetchPassengersResponse,
  mockDeletePassengerResponse,
  mockAxiosValidationError,
  mockAxiosUnauthorizedError,
  mockAxiosServerError,
  mockAxiosNotFoundError,
  mockNetworkError,
  mockTimeoutError,
} from '../__mocks__/travellersApi';
import api from '@/lib/api/axios';

jest.mock('@/lib/api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Passenger API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPassengers', () => {
    it('should fetch passengers successfully', async () => {
      mockApi.get.mockResolvedValueOnce(mockFetchPassengersResponse);

      const result = await fetchPassengers();

      expect(mockApi.get).toHaveBeenCalledWith('/passenger/');
      expect(result).toEqual(mockPassengers);
    });

    it('should throw error on API failure', async () => {
      mockApi.get.mockRejectedValueOnce(mockAxiosServerError);

      await expect(fetchPassengers()).rejects.toThrow('Database connection failed');
    });

    it('should handle network errors', async () => {
      mockApi.get.mockRejectedValueOnce(mockNetworkError);

      await expect(fetchPassengers()).rejects.toThrow('Failed to fetch passengers');
    });

    it('should handle timeout errors', async () => {
      mockApi.get.mockRejectedValueOnce(mockTimeoutError);

      await expect(fetchPassengers()).rejects.toThrow('Failed to fetch passengers');
    });

    it('should handle unauthorized errors', async () => {
      mockApi.get.mockRejectedValueOnce(mockAxiosUnauthorizedError);

      await expect(fetchPassengers()).rejects.toThrow('Invalid token');
    });

    it('should handle validation errors', async () => {
      mockApi.get.mockRejectedValueOnce(mockAxiosValidationError);

      await expect(fetchPassengers()).rejects.toThrow('Validation failed: Name is required, Invalid email format');
    });
  });

  describe('fetchPassengerById', () => {
    it('should fetch passenger by ID successfully', async () => {
      const mockResponse = {
        data: mockPassengers[0],
        status: 200,
        statusText: 'OK',
        headers: {} as never,
        config: {
          headers: {} as never,
          url: '/passenger/1',
          method: 'GET',
        } as never,
      };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await fetchPassengerById('1');

      expect(mockApi.get).toHaveBeenCalledWith('/passenger/1/');
      expect(result).toEqual(mockPassengers[0]);
    });

    it('should throw error on API failure', async () => {
      mockApi.get.mockRejectedValueOnce(mockAxiosNotFoundError);

      await expect(fetchPassengerById('999')).rejects.toThrow('Passenger not found');
    });

    it('should handle server errors', async () => {
      mockApi.get.mockRejectedValueOnce(mockAxiosServerError);

      await expect(fetchPassengerById('1')).rejects.toThrow('Database connection failed');
    });
  });

  describe('createPassenger', () => {
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

    it('should create passenger successfully', async () => {
      const mockResponse = {
        data: { ...mockPassengers[0], ...mockCreateRequest, id: 'new-id' },
        status: 201,
        statusText: 'Created',
        headers: {} as never,
        config: {
          headers: {} as never,
          url: '/passenger/',
          method: 'POST',
        } as never,
      };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await createPassenger(mockCreateRequest);

      expect(mockApi.post).toHaveBeenCalledWith('/passenger/', mockCreateRequest);
      expect(result).toEqual({ ...mockPassengers[0], ...mockCreateRequest, id: 'new-id' });
    });

    it('should throw error on API failure', async () => {
      mockApi.post.mockRejectedValueOnce(mockAxiosValidationError);

      await expect(createPassenger(mockCreateRequest)).rejects.toThrow(
        'Validation failed: Name is required, Invalid email format'
      );
    });

    it('should handle validation errors', async () => {
      mockApi.post.mockRejectedValueOnce(mockAxiosValidationError);

      await expect(createPassenger(mockCreateRequest)).rejects.toThrow(
        'Validation failed: Name is required, Invalid email format'
      );
    });
  });

  describe('updatePassenger', () => {
    const mockUpdateRequest = {
      name: 'Updated Passenger',
      email: 'updated@example.com',
    };

    it('should update passenger successfully', async () => {
      const mockResponse = {
        data: { ...mockPassengers[0], ...mockUpdateRequest },
        status: 200,
        statusText: 'OK',
        headers: {} as never,
        config: {
          headers: {} as never,
          url: '/passenger/1',
          method: 'PATCH',
        } as never,
      };
      mockApi.patch.mockResolvedValueOnce(mockResponse);

      const result = await updatePassenger('1', mockUpdateRequest);

      expect(mockApi.patch).toHaveBeenCalledWith('/passenger/1/', mockUpdateRequest);
      expect(result).toEqual({ ...mockPassengers[0], ...mockUpdateRequest });
    });

    it('should throw error on API failure', async () => {
      mockApi.patch.mockRejectedValueOnce(mockAxiosNotFoundError);

      await expect(updatePassenger('999', mockUpdateRequest)).rejects.toThrow('Passenger not found');
    });

    it('should handle server errors', async () => {
      mockApi.patch.mockRejectedValueOnce(mockAxiosServerError);

      await expect(updatePassenger('1', mockUpdateRequest)).rejects.toThrow('Database connection failed');
    });
  });

  describe('deletePassenger', () => {
    it('should delete passenger successfully', async () => {
      mockApi.delete.mockResolvedValueOnce(mockDeletePassengerResponse);

      const result = await deletePassenger('1');

      expect(mockApi.delete).toHaveBeenCalledWith('/passenger/1/');
      expect(result).toEqual({ message: 'Passenger deleted successfully' });
    });

    it('should throw error on API failure', async () => {
      mockApi.delete.mockRejectedValueOnce(mockAxiosNotFoundError);

      await expect(deletePassenger('999')).rejects.toThrow('Passenger not found');
    });

    it('should handle unauthorized errors', async () => {
      mockApi.delete.mockRejectedValueOnce(mockAxiosUnauthorizedError);

      await expect(deletePassenger('1')).rejects.toThrow('Invalid token');
    });

    it('should handle server errors', async () => {
      mockApi.delete.mockRejectedValueOnce(mockAxiosServerError);

      await expect(deletePassenger('1')).rejects.toThrow('Database connection failed');
    });

    it('should handle network errors', async () => {
      mockApi.delete.mockRejectedValueOnce(mockNetworkError);

      await expect(deletePassenger('1')).rejects.toThrow('Failed to delete passenger');
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle malformed error responses', async () => {
      const malformedError = {
        response: {
          status: 400,
          data: null,
        },
        message: 'Request failed',
        isAxiosError: true,
      };
      mockApi.get.mockRejectedValueOnce(malformedError);

      await expect(fetchPassengers()).rejects.toThrow('Failed to fetch passengers');
    });

    it('should handle errors without response data', async () => {
      const errorWithoutData = {
        message: 'Network Error',
        isAxiosError: true,
      };
      mockApi.get.mockRejectedValueOnce(errorWithoutData);

      await expect(fetchPassengers()).rejects.toThrow('Failed to fetch passengers');
    });

    it('should handle errors with empty response data', async () => {
      const errorWithEmptyData = {
        response: {
          status: 500,
          data: {},
        },
        message: 'Request failed',
        isAxiosError: true,
      };
      mockApi.get.mockRejectedValueOnce(errorWithEmptyData);

      await expect(fetchPassengers()).rejects.toThrow('Server error. Please try again later.');
    });
  });
});
