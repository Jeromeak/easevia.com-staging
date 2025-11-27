import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { getRefreshToken, saveTokens } from './tokenStorage';
import type { ErrorResponse, TokenResponse } from '@/lib/types/api/auth';

const SUPABASE_PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF;
const SUPABASE_REFRESH_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co/auth/v1/token?grant_type=refresh_token`;

export async function primeRefreshToken(refreshToken: string): Promise<string> {
  try {
    const res: AxiosResponse<TokenResponse> = await axios.post(
      SUPABASE_REFRESH_URL,
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      }
    );

    const data = res.data;
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found in storage');
    saveTokens(accessToken, data.refresh_token);

    return data.refresh_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError?.response?.data?.msg || 'Failed to prime refresh token');
    }

    throw new Error('Failed to prime refresh token');
  }
}

// Store the ongoing refresh promise to prevent concurrent refresh calls
let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  // If a refresh is already in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  // Create the refresh promise
  refreshPromise = (async () => {
    try {
      const res: AxiosResponse<TokenResponse> = await axios.post(
        SUPABASE_REFRESH_URL,
        {
          refresh_token: refreshToken,
        },
        {
          headers: { 'Content-Type': 'application/json', apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
        }
      );

      const data = res.data;

      // Save new tokens to both localStorage and cookies
      saveTokens(data.access_token, data.refresh_token);

      return data.access_token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Session expired. Please log in again.');
      }

      throw new Error('Failed to refresh access token');
    } finally {
      // Clear the promise after completion (success or failure)
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
