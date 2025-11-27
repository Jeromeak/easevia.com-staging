import axios from 'axios';
import { getAccessToken } from '@/utils/tokenStorage';
import { refreshAccessToken } from '@/utils/refreshToken';

//* Base URL for the API
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

//* Create the axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

//* Request interceptor
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

//* Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for token expiration errors (both "Token expired" and "Token has expired")
    const isTokenExpired =
      (error.response?.data?.detail === 'Token expired' ||
        error.response?.data?.detail === 'Token has expired' ||
        error.response?.status === 401) &&
      !originalRequest._retry;

    if (isTokenExpired) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        //* clear tokens or redirect
        // clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
