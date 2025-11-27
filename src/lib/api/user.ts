import type { ApiErrorResponse, UserProfileUpdatePayload } from '../types/api/user';
import api from './axios';
import type { AxiosError } from 'axios';

//* Fetch the user profile
export const fetchUserInfo = async (token: string) => {
  try {
    return await api.get('/auth/user/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    throw new Error(axiosError.response?.data?.message || 'Failed to fetch user info');
  }
};

//* Update the user profile
export const updateUserProfile = async (token: string, profileData: UserProfileUpdatePayload) => {
  try {
    const response = await api.patch('/auth/user/profile/', profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    const status = axiosError?.response?.status;
    const data = axiosError?.response?.data;

    if (status === 400 && data?.errors) {
      const validationMessages = Object.values(data?.errors).flat().join(', ');
      throw new Error(`Validation failed: ${validationMessages}`);
    }

    if (status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    if (status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(data?.message || 'Failed to update profile');
  }
};
