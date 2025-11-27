import type {
  SignupPayload,
  MessageResponse,
  RegistrationCompleteResponse,
  RegistrationResponseForOTP,
  TokenResponse,
} from '../types/api/auth';
import api from './axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const sendSignupOtp = (data: SignupPayload) =>
  api.post<MessageResponse>(`${BASE_URL}/auth/register/initiate/`, data);

export const verifySignupOtp = (email: string, otp: string) =>
  api.post<RegistrationResponseForOTP>(`${BASE_URL}/auth/register/verify-email/`, { email, otp });

export const completeRegistration = (token: string) =>
  api.get<RegistrationCompleteResponse>(`${BASE_URL}/auth/register-or-login/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const sendPhoneOtp = (token: string, phone?: string) =>
  api.post<MessageResponse>(
    `${BASE_URL}/auth/register/phone/`,
    { phone },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const verifyPhoneOtp = (token: string, otp: string) =>
  api.post<TokenResponse>(
    `${BASE_URL}/auth/register/verify-phone/`,
    { otp },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const sendLoginOtp = async (contact: string, type: 'email' | 'phone') => {
  return await api.post<MessageResponse>(`${BASE_URL}/auth/login/request-otp/`, {
    identifier: contact,
    channel: type,
  });
};

export const verifyLoginOtp = async (contact: string, otp: string, type: 'email' | 'phone') => {
  return await api.post<TokenResponse>(`${BASE_URL}/auth/login/verify-otp/`, {
    identifier: contact,
    otp,
    channel: type,
  });
};

export const googleOauthVerify = async (token: string) => {
  return await api.post(
    `${BASE_URL}/auth/oauth/google/verify/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
