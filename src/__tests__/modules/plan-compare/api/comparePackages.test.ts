import { comparePackages } from '@/lib/api/package';
import {
  mockComparePackagesResponse,
  mockComparePackagesRequest,
  mockAxiosError,
  mockNetworkError,
  mockTimeoutError,
} from '../__mocks__/planCompareApi';
import api from '@/lib/api/axios';

// Mock the axios instance
jest.mock('@/lib/api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Compare Packages API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('comparePackages', () => {
    it('should fetch comparison packages successfully with all parameters', async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: mockComparePackagesResponse });

      // Act
      const result = await comparePackages(
        mockComparePackagesRequest.packageIds,
        mockComparePackagesRequest.currencyId
      );

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/compare/', {
        params: {
          package_ids: '1,2,3',
          currency_id: '1',
        },
      });
      expect(result).toEqual(mockComparePackagesResponse);
    });

    it('should fetch comparison packages successfully without currency ID', async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: mockComparePackagesResponse });

      // Act
      const result = await comparePackages(mockComparePackagesRequest.packageIds);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/compare/', {
        params: {
          package_ids: '1,2,3',
        },
      });
      expect(result).toEqual(mockComparePackagesResponse);
    });

    it('should fetch comparison packages with single package ID', async () => {
      // Arrange
      const singlePackageResponse = [mockComparePackagesResponse[0]];
      mockApi.get.mockResolvedValueOnce({ data: singlePackageResponse });

      // Act
      const result = await comparePackages(['1'], '1');

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/compare/', {
        params: {
          package_ids: '1',
          currency_id: '1',
        },
      });
      expect(result).toEqual(singlePackageResponse);
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      mockApi.get.mockRejectedValueOnce(mockAxiosError);

      // Act & Assert
      await expect(
        comparePackages(mockComparePackagesRequest.packageIds, mockComparePackagesRequest.currencyId)
      ).rejects.toThrow('Package ID 999 not found');
    });

    it('should handle network errors', async () => {
      // Arrange
      mockApi.get.mockRejectedValueOnce(mockNetworkError);

      // Act & Assert
      await expect(
        comparePackages(mockComparePackagesRequest.packageIds, mockComparePackagesRequest.currencyId)
      ).rejects.toThrow('Failed to compare packages');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      mockApi.get.mockRejectedValueOnce(mockTimeoutError);

      // Act & Assert
      await expect(
        comparePackages(mockComparePackagesRequest.packageIds, mockComparePackagesRequest.currencyId)
      ).rejects.toThrow('Failed to compare packages');
    });

    it('should handle empty package IDs array', async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: [] });

      // Act
      const result = await comparePackages([], '1');

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/package/compare/', {
        params: {
          package_ids: '',
          currency_id: '1',
        },
      });
      expect(result).toEqual([]);
    });

    it('should handle different response formats', async () => {
      // Arrange
      const alternativeResponse = [mockComparePackagesResponse[0]];
      mockApi.get.mockResolvedValueOnce({ data: alternativeResponse });

      // Act
      const result = await comparePackages(['1'], '1');

      // Assert
      expect(result).toEqual(alternativeResponse);
    });

    it('should handle server errors (500)', async () => {
      // Arrange
      const serverError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
        message: 'Request failed with status code 500',
        isAxiosError: true,
      };
      mockApi.get.mockRejectedValueOnce(serverError);

      // Act & Assert
      await expect(
        comparePackages(mockComparePackagesRequest.packageIds, mockComparePackagesRequest.currencyId)
      ).rejects.toThrow('Server error. Please try again later.');
    });

    it('should handle unauthorized errors (401)', async () => {
      // Arrange
      const unauthorizedError = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
        message: 'Request failed with status code 401',
        isAxiosError: true,
      };
      mockApi.get.mockRejectedValueOnce(unauthorizedError);

      // Act & Assert
      await expect(
        comparePackages(mockComparePackagesRequest.packageIds, mockComparePackagesRequest.currencyId)
      ).rejects.toThrow('Unauthorized. Please login again.');
    });

    it('should handle validation errors (400)', async () => {
      // Arrange
      const validationError = {
        response: {
          status: 400,
          data: {
            errors: {
              package_ids: ['Package IDs are required'],
              currency_id: ['Currency ID is invalid'],
            },
          },
        },
        message: 'Request failed with status code 400',
        isAxiosError: true,
      };
      mockApi.get.mockRejectedValueOnce(validationError);

      // Act & Assert
      await expect(
        comparePackages(mockComparePackagesRequest.packageIds, mockComparePackagesRequest.currencyId)
      ).rejects.toThrow('Validation failed: Package IDs are required, Currency ID is invalid');
    });
  });
});
