import { fetchUserInfo, updateUserProfile } from '@/lib/api/user';
import {
  mockUserProfile,
  mockUpdatedUserProfile,
  mockProfileUpdatePayload,
  mockValidationError,
  mockUnauthorizedError,
  mockServerError,
} from '../__mocks__/profileApi';
import api from '@/lib/api/axios';

// Mock the axios instance
jest.mock('@/lib/api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUserInfo', () => {
    it('should fetch user info successfully', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.get.mockResolvedValueOnce({
        data: mockUserProfile,
        status: 200,
        statusText: 'OK',
      });

      const result = await fetchUserInfo(mockToken);

      expect(mockApi.get).toHaveBeenCalledWith('/auth/user/profile/', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result.data).toEqual(mockUserProfile);
    });

    it('should handle 401 unauthorized error', async () => {
      const mockToken = 'invalid-token';
      mockApi.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: mockUnauthorizedError,
        },
        isAxiosError: true,
      });

      await expect(fetchUserInfo(mockToken)).rejects.toThrow('Unauthorized. Please login again.');
    });

    it('should handle generic API errors', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
        isAxiosError: true,
      });

      await expect(fetchUserInfo(mockToken)).rejects.toThrow('Internal server error');
    });

    it('should handle network errors', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchUserInfo(mockToken)).rejects.toThrow('Failed to fetch user info');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.patch.mockResolvedValueOnce({
        data: mockUpdatedUserProfile,
        status: 200,
        statusText: 'OK',
      });

      const result = await updateUserProfile(mockToken, mockProfileUpdatePayload);

      expect(mockApi.patch).toHaveBeenCalledWith('/auth/user/profile/', mockProfileUpdatePayload, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockUpdatedUserProfile);
    });

    it('should handle validation errors (400)', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.patch.mockRejectedValueOnce({
        response: {
          status: 400,
          data: mockValidationError,
        },
        isAxiosError: true,
      });

      await expect(updateUserProfile(mockToken, mockProfileUpdatePayload)).rejects.toThrow(
        'Validation failed: Name is required, Email format is invalid'
      );
    });

    it('should handle 401 unauthorized error', async () => {
      const mockToken = 'invalid-token';
      mockApi.patch.mockRejectedValueOnce({
        response: {
          status: 401,
          data: mockUnauthorizedError,
        },
        isAxiosError: true,
      });

      await expect(updateUserProfile(mockToken, mockProfileUpdatePayload)).rejects.toThrow(
        'Unauthorized. Please login again.'
      );
    });

    it('should handle 500 server error', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.patch.mockRejectedValueOnce({
        response: {
          status: 500,
          data: mockServerError,
        },
        isAxiosError: true,
      });

      await expect(updateUserProfile(mockToken, mockProfileUpdatePayload)).rejects.toThrow(
        'Server error. Please try again later.'
      );
    });

    it('should handle generic API errors', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.patch.mockRejectedValueOnce({
        response: {
          status: 422,
          data: { message: 'Unprocessable entity' },
        },
        isAxiosError: true,
      });

      await expect(updateUserProfile(mockToken, mockProfileUpdatePayload)).rejects.toThrow('Unprocessable entity');
    });

    it('should handle network errors', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.patch.mockRejectedValueOnce(new Error('Network Error'));

      await expect(updateUserProfile(mockToken, mockProfileUpdatePayload)).rejects.toThrow('Failed to update profile');
    });

    it('should handle missing response data', async () => {
      const mockToken = 'mock-jwt-token';
      mockApi.patch.mockRejectedValueOnce({
        response: {
          status: 500,
        },
        isAxiosError: true,
      });

      await expect(updateUserProfile(mockToken, mockProfileUpdatePayload)).rejects.toThrow(
        'Server error. Please try again later.'
      );
    });
  });
});
