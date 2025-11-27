'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/hooks/useAuth';
import { getAccessToken, clearTokens } from '@/utils/tokenStorage';
import { fetchUserInfo } from '@/lib/api/user';

export const UserInitializer = () => {
  const { setUser } = useAuth();

  useEffect(() => {
    const initializeUser = async () => {
      const token = getAccessToken();

      if (token) {
        try {
          const userResponse = await fetchUserInfo(token);
          const userData = userResponse.data;
          setUser(userData);
        } catch (error) {
          if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            (error as { message?: string }).message === 'unauthorized'
          ) {
            clearTokens();
            setUser(null);
          } else {
            console.error('Failed to fetch user info on app initialization:', error);
          }
        }
      }
    };

    initializeUser();
  }, [setUser]);

  return null; // This component doesn't render anything
};
