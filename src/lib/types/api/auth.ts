import type { JSX } from 'react/jsx-runtime';
import type { Currency } from './currency';

//* Auth API Types for User Registration, Login, and Token Responses
export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  [key: string]: string | undefined;
}

//* Response interfaces for various authentication steps
export interface MessageResponse {
  message: string;
}

//* Token response interface for login and registration
export interface TokenResponse extends MessageResponse {
  access_token: string;
  refresh_token: string;
}

//* Response interface for completing registration
export interface RegistrationCompleteResponse extends TokenResponse {
  user: {
    id: number;
    email: string;
    phone: string;
    name: string;
    is_verified: boolean;
    auth_provider: string;
    customer_id: string;
    created_at: string;
    updated_at: string;
  };
}

//* Response interface for OTP verification during registration
export interface RegistrationResponseForOTP {
  message: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: number;
    email: string;
    phone: string;
    name: string;
    auth_provider: string;
    phone_verified: boolean;
    created_at: string;
    updated_at: string;
  };
}

//* Error response interface for API errors
export interface ErrorResponse {
  msg: string;
}

export interface User {
  id: number;
  email: string;
  phone: string;
  name: string;
  is_verified: boolean;
  auth_provider: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  accessToken: string | null;
}

export interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  accessToken?: string;
  [key: string]: string | undefined;
}

export interface AuthFlowContextType {
  formData: AuthFormData;
  setFormData: (data: Partial<AuthFormData>) => void;
  resetForm: () => void;
}

export interface LanguageOption {
  value: string;
  label: string;
  icon: JSX.Element;
}

export interface LanguageCurrencyContextType {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  currency: Currency | null;
  setCurrency: (currency: Currency) => void;
  currencies: Currency[];
  loading: boolean;
  error: string | null;
}
