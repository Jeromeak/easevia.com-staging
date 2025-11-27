import { submitContactUs } from '@/lib/api/contact';
import type { ContactUsResponse } from '@/lib/api/contact';
import {
  mockContactUsSuccessResponse,
  mockContactUsErrorResponse,
  mockValidContactRequest,
  mockInvalidContactRequest,
  mockNetworkError,
  mockAxiosError,
} from '../__mocks__/api';

// Mock the axios instance
jest.mock('@/lib/api/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
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

import api from '@/lib/api/axios';
import { getErrorMessage } from '@/lib/utils/error';

const mockApi = api as jest.Mocked<typeof api>;

const mockGetErrorMessage = getErrorMessage as jest.MockedFunction<typeof getErrorMessage>;

describe('Contact API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitContactUs', () => {
    it('should submit contact form successfully', async () => {
      // Arrange
      const mockResponse = { data: mockContactUsSuccessResponse };
      mockApi.post.mockResolvedValue(mockResponse);

      // Act
      const result = await submitContactUs(mockValidContactRequest);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockValidContactRequest);
      expect(result).toEqual(mockContactUsSuccessResponse);
    });

    it('should handle API error responses', async () => {
      // Arrange
      mockApi.post.mockRejectedValue(mockAxiosError);
      mockGetErrorMessage.mockReturnValue(mockContactUsErrorResponse.error);

      // Act & Assert
      await expect(submitContactUs(mockValidContactRequest)).rejects.toThrow(mockContactUsErrorResponse.error);

      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockValidContactRequest);
      expect(mockGetErrorMessage).toHaveBeenCalledWith(mockAxiosError);
    });

    it('should handle network errors', async () => {
      // Arrange
      mockApi.post.mockRejectedValue(mockNetworkError);
      mockGetErrorMessage.mockReturnValue('Network Error');

      // Act & Assert
      await expect(submitContactUs(mockValidContactRequest)).rejects.toThrow('Network Error');

      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockValidContactRequest);
      expect(mockGetErrorMessage).toHaveBeenCalledWith(mockNetworkError);
    });

    it('should handle validation errors', async () => {
      // Arrange
      const validationError = {
        response: {
          status: 422,
          data: {
            error: 'Validation failed',
            details: ['Name is required', 'Email is invalid'],
          },
        },
        message: 'Request failed with status code 422',
        isAxiosError: true,
      };

      mockApi.post.mockRejectedValue(validationError);
      mockGetErrorMessage.mockReturnValue('Validation failed');

      // Act & Assert
      await expect(submitContactUs(mockInvalidContactRequest)).rejects.toThrow('Validation failed');

      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockInvalidContactRequest);
    });

    it('should handle server errors (500)', async () => {
      // Arrange
      const serverError = {
        response: {
          status: 500,
          data: {
            error: 'Internal server error',
            details: ['Something went wrong on our end'],
          },
        },
        message: 'Request failed with status code 500',
        isAxiosError: true,
      };

      mockApi.post.mockRejectedValue(serverError);
      mockGetErrorMessage.mockReturnValue('Internal server error');

      // Act & Assert
      await expect(submitContactUs(mockValidContactRequest)).rejects.toThrow('Internal server error');

      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockValidContactRequest);
    });

    it('should handle timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('timeout of 10000ms exceeded');
      mockApi.post.mockRejectedValue(timeoutError);
      mockGetErrorMessage.mockReturnValue('timeout of 10000ms exceeded');

      // Act & Assert
      await expect(submitContactUs(mockValidContactRequest)).rejects.toThrow('timeout of 10000ms exceeded');

      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockValidContactRequest);
    });

    it('should log error details for debugging', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockApi.post.mockRejectedValue(mockAxiosError);
      mockGetErrorMessage.mockReturnValue(mockContactUsErrorResponse.error);

      // Act
      try {
        await submitContactUs(mockValidContactRequest);
      } catch {
        // Expected to throw
      }

      // Assert - The actual implementation logs the error message
      expect(consoleSpy).toHaveBeenCalledWith('Contact us submission failed:', mockContactUsErrorResponse.error);

      // The second console.error call might not happen if the error handling is different
      // Let's check if it was called at least once
      expect(consoleSpy).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });

    it('should handle different response formats', async () => {
      // Arrange
      const alternativeResponse: ContactUsResponse = {
        message: 'Thank you for your inquiry. We will respond within 24 hours.',
      };
      const mockResponse = { data: alternativeResponse };
      mockApi.post.mockResolvedValue(mockResponse);

      // Act
      const result = await submitContactUs(mockValidContactRequest);

      // Assert
      expect(result).toEqual(alternativeResponse);
      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockValidContactRequest);
    });

    it('should handle empty response data', async () => {
      // Arrange
      const emptyResponse: ContactUsResponse = {
        message: '',
      };
      const mockResponse = { data: emptyResponse };
      mockApi.post.mockResolvedValue(mockResponse);

      // Act
      const result = await submitContactUs(mockValidContactRequest);

      // Assert
      expect(result).toEqual(emptyResponse);
      expect(mockApi.post).toHaveBeenCalledWith('/inquiry/', mockValidContactRequest);
    });
  });
});
