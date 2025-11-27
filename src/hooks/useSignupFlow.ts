import { useState } from 'react';
import { sendSignupOtp, verifySignupOtp, completeRegistration, sendPhoneOtp, verifyPhoneOtp } from '@/lib/api/auth';
import { saveTokens } from '@/utils/tokenStorage';
import { useAuth } from '@/context/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils/error';
import type { SignupPayload } from '@/lib/types/api/auth';

export function useSignupFlow() {
  const { setUser } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<SignupPayload | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetError = () => setError(null);

  const step1 = async (data: SignupPayload) => {
    resetError();
    setLoading(true);

    try {
      await sendSignupOtp(data);
      setPayload(data);
      setStep(2);
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const step2 = async (otp: string) => {
    if (!payload) return;
    resetError();
    setLoading(true);

    try {
      const res = await verifySignupOtp(payload.email, otp);
      const { access_token, refresh_token } = res.data;
      saveTokens(access_token, refresh_token);
      setAccessToken(access_token);
      setStep(3);
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const step3 = async () => {
    resetError();
    setLoading(true);
    if (!accessToken) return;

    try {
      const res = await completeRegistration(accessToken);
      setUser(res.data.user);
      setStep(4);
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const step4 = async () => {
    resetError();
    setLoading(true);
    if (!accessToken) return;

    try {
      await sendPhoneOtp(accessToken);
      setStep(5);
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Failed to send phone OTP');
    } finally {
      setLoading(false);
    }
  };

  const step5 = async (otp: string) => {
    resetError();
    setLoading(true);
    if (!accessToken) return;

    try {
      const res = await verifyPhoneOtp(accessToken, otp);
      const { access_token, refresh_token } = res.data;
      saveTokens(access_token, refresh_token);
      setStep(6);
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Invalid phone OTP');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    loading,
    error,
    step1,
    step2,
    step3,
    step4,
    step5,
    payload,
  };
}
