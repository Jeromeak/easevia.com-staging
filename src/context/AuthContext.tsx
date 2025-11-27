'use client';
import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { getAccessToken, clearTokens } from '@/utils/tokenStorage';
import { AuthContext } from './contexts/AuthContext';

//* User response payload type
interface User {
  id: number;
  email: string;
  phone: string;
  name: string;
  is_verified: boolean;
  phone_verified?: boolean;
  auth_provider: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken] = useState<string | null>(getAccessToken());

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout, accessToken }}>{children}</AuthContext.Provider>;
}
