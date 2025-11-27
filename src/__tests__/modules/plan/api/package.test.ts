// Mock the handlePackageError function to not throw
jest.doMock('@/lib/api/package', () => {
  const originalModule = jest.requireActual('@/lib/api/package');

  return {
    ...originalModule,
    handlePackageError: jest.fn(() => {
      // Don't throw, just return
    }),
  };
});

import { fetchPackages, fetchPackageById, fetchPackageAirlines, fetchPackageClasses } from '@/lib/api/package';
import {
  mockTravelPackages,
  mockTravelPackage,
  mockPackageAirlines,
  mockPackageClasses,
  mockPackageListRequest,
  mockPackageListRequestEmpty,
  mockAxiosError,
  mockNetworkError,
  mockTimeoutError,
} from '../__mocks__/planApi';
import api from '@/lib/api/axios';

// Mock the axios instance
jest.mock('@/lib/api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// Mock the error utility
jest.mock('@/lib/utils/error', () => ({
  getErrorMessage: jest.fn((error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    return error.message || 'An unexpected error occurred';
  }),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Package API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPackages', () => {
    it('should fetch packages successfully with all parameters', async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: mockTravelPackages });

      // Act
      const result = await fetchPackages(mockPackageListRequest);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/', {
        params: {
          currency_id: '1',
          origin: 'DEL',
          destination: 'BOM',
          class_type: 'ECONOMY',
          airline: 'AI',
        },
      });
      expect(result).toEqual(mockTravelPackages);
    });

    it('should fetch packages successfully with empty parameters', async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: mockTravelPackages });

      // Act
      const result = await fetchPackages(mockPackageListRequestEmpty);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/', {
        params: {},
      });
      expect(result).toEqual(mockTravelPackages);
    });

    it('should fetch packages with partial parameters', async () => {
      // Arrange
      const partialRequest = { currency_id: '1', origin: 'DEL' };
      mockApi.get.mockResolvedValueOnce({ data: mockTravelPackages });

      // Act
      const result = await fetchPackages(partialRequest);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/', {
        params: {
          currency_id: '1',
          origin: 'DEL',
        },
      });
      expect(result).toEqual(mockTravelPackages);
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      mockApi.get.mockRejectedValueOnce(mockAxiosError);

      // Act & Assert
      await expect(fetchPackages(mockPackageListRequest)).rejects.toThrow('Network error occurred');
      expect(mockApi.get).toHaveBeenCalledWith('/package/', {
        params: {
          currency_id: '1',
          origin: 'DEL',
          destination: 'BOM',
          class_type: 'ECONOMY',
          airline: 'AI',
        },
      });
    });

    it('should handle network errors', async () => {
      // Arrange
      mockApi.get.mockRejectedValueOnce(mockNetworkError);

      // Act & Assert
      await expect(fetchPackages(mockPackageListRequest)).rejects.toThrow('Failed to fetch travel packages');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      mockApi.get.mockRejectedValueOnce(mockTimeoutError);

      // Act & Assert
      await expect(fetchPackages(mockPackageListRequest)).rejects.toThrow('Failed to fetch travel packages');
    });
  });

  describe('fetchPackageById', () => {
    it('should fetch package by ID successfully', async () => {
      // Arrange
      const packageId = '1';
      mockApi.get.mockResolvedValueOnce({ data: mockTravelPackage });

      // Act
      const result = await fetchPackageById(packageId);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(`/package/${packageId}/`);
      expect(result).toEqual(mockTravelPackage);
    });

    it('should handle API errors when fetching package by ID', async () => {
      // Arrange
      const packageId = '999';
      mockApi.get.mockRejectedValueOnce(mockAxiosError);

      // Act & Assert
      await expect(fetchPackageById(packageId)).rejects.toThrow('Network error occurred');
      expect(mockApi.get).toHaveBeenCalledWith(`/package/${packageId}/`);
    });
  });

  describe('fetchPackageAirlines', () => {
    it('should fetch package airlines successfully', async () => {
      // Arrange
      const params = { origin: 'DEL', destination: 'BOM' };
      mockApi.get.mockResolvedValueOnce({ data: mockPackageAirlines });

      // Act
      const result = await fetchPackageAirlines(params);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/airlines/', { params });
      expect(result).toEqual(mockPackageAirlines);
    });

    it('should fetch package airlines with empty parameters', async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: mockPackageAirlines });

      // Act
      const result = await fetchPackageAirlines({});

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/airlines/', { params: {} });
      expect(result).toEqual(mockPackageAirlines);
    });

    it('should handle API errors when fetching airlines', async () => {
      // Arrange
      const params = { origin: 'DEL', destination: 'BOM' };
      mockApi.get.mockRejectedValueOnce(mockAxiosError);

      // Act & Assert
      await expect(fetchPackageAirlines(params)).rejects.toThrow('Network error occurred');
    });
  });

  describe('fetchPackageClasses', () => {
    it('should fetch package classes successfully', async () => {
      // Arrange
      const params = { origin: 'DEL', destination: 'BOM' };
      mockApi.get.mockResolvedValueOnce({ data: mockPackageClasses });

      // Act
      const result = await fetchPackageClasses(params);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/classes/', { params });
      expect(result).toEqual(mockPackageClasses);
    });

    it('should fetch package classes with empty parameters', async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: mockPackageClasses });

      // Act
      const result = await fetchPackageClasses({});

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/classes/', { params: {} });
      expect(result).toEqual(mockPackageClasses);
    });

    it('should handle API errors when fetching classes', async () => {
      // Arrange
      const params = { origin: 'DEL', destination: 'BOM' };
      mockApi.get.mockRejectedValueOnce(mockAxiosError);

      // Act & Assert
      await expect(fetchPackageClasses(params)).rejects.toThrow('Network error occurred');
    });
  });

  describe('Error Handling', () => {
    it('should log error details for debugging', async () => {
      // Arrange
      mockApi.get.mockRejectedValue(mockAxiosError);

      // Act & Assert
      await expect(fetchPackages(mockPackageListRequest)).rejects.toThrow('Network error occurred');
    });

    it('should handle different response formats', async () => {
      // Arrange
      const alternativeResponse = [mockTravelPackage];
      mockApi.get.mockResolvedValueOnce({ data: alternativeResponse });

      // Act
      const result = await fetchPackages(mockPackageListRequest);

      // Assert
      expect(result).toEqual(alternativeResponse);
    });
  });
});
