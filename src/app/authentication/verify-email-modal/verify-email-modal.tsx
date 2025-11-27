import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import { verifySignupOtp, sendPhoneOtp, sendSignupOtp } from '@/lib/api/auth';
import { clearTokens, saveTokens } from '@/utils/tokenStorage';
import { getErrorMessage } from '@/lib/utils/error';
import { useAuth } from '@/context/hooks/useAuth';
import { fetchUserInfo } from '@/lib/api/user';
import type { VerifyModalProps } from '@/lib/types/common.types';

export const VerifyEmailModal: React.FC<VerifyModalProps> = ({
  isVerifyEmailModalOpen,
  onCloseVerifyEmailModal,
  openSignInAccount,
  openVerifyMobile,
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { formData } = useAuthFlow();
  const { setUser } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVerifyEmailModalOpen) {
      setPin(['', '', '', '', '', '']);
      setTimeLeft(60);
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }

    return () => clearInterval(timer);
  }, [isVerifyEmailModalOpen]);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      if (el) inputRefs.current[index] = el;
    },
    []
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      setError(null);
      if (!/^\d?$/.test(value)) return;

      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [pin]
  );

  const handleOtpInputChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(index, e.target.value);
    },
    [handleChange]
  );

  const handleOtpInputKeyDown = useCallback(
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [pin]
  );

  const handlePaste = useCallback(
    (startIndex: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const raw = e.clipboardData.getData('text');
      const digits = (raw || '').replace(/\D/g, '').slice(0, 6);

      if (!digits) return;

      const newPin = [...pin];

      for (let i = 0; i < 6 && startIndex + i < 6; i++) {
        newPin[startIndex + i] = digits[i] ?? '';
      }

      setPin(newPin);
      setError(null);

      const filledCount = Math.min(digits.length, 6 - startIndex);
      const nextIndex = startIndex + filledCount - 1;

      if (nextIndex >= 0 && nextIndex < 5) {
        inputRefs.current[nextIndex + 1]?.focus();
      } else if (nextIndex >= 5) {
        inputRefs.current[5]?.focus();
      }
    },
    [pin]
  );

  const handleSignInClick = useCallback(() => {
    openSignInAccount();
  }, [openSignInAccount]);

  const handleResend = useCallback(async () => {
    setError(null);
    setPin(['', '', '', '', '', '']);

    try {
      await sendSignupOtp(formData);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }

    setTimeLeft(60);
    inputRefs.current[0]?.focus();
  }, [formData]);

  const formatTime = useCallback((seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');

    return `${mins}:${secs}`;
  }, []);

  const handleVerifyEmailOtp = useCallback(async () => {
    const otp = pin.join('');

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');

      return;
    }

    try {
      setLoading(true);

      const response = await verifySignupOtp(formData?.email, otp);
      const { access_token, refresh_token } = response.data;

      saveTokens(access_token, refresh_token);

      await sendPhoneOtp(access_token);

      try {
        const userResponse = await fetchUserInfo(access_token);
        const userData = userResponse.data;
        setUser(userData);
      } catch (error: unknown) {
        const userError = getErrorMessage(error);

        if (userError === 'unauthorized') {
          clearTokens();
          setUser(null);
        } else {
          console.error('Failed to fetch user info:', userError);
        }
      }

      openVerifyMobile();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);

      // Clear form data on critical errors
      if (
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('expired')
      ) {
        // Don't clear formData here - let user retry or go back
      }
    } finally {
      setLoading(false);
    }
  }, [pin, formData, setUser, openVerifyMobile]);

  const handleChangeEmail = useCallback(() => {
    // Go back to create account modal which will restore formData from context
    openSignInAccount();
  }, [openSignInAccount]);

  return (
    <Modal
      isOpen={isVerifyEmailModalOpen}
      onClose={onCloseVerifyEmailModal}
      title="Verify Your Email"
      titleClassName="text-center"
    >
      <div className="text-Light dark:text-gray-200  text-xl leading-[24px] font-normal mt-3 mb-8">
        We’ve sent a 6-digit code to <span className="text-white ">{formData?.email}. </span>Enter it to continue.
      </div>
      <div className="text-white text-base">Enter verification code</div>
      <div className="flex gap-4 py-5">
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={setInputRef(index)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={handleOtpInputChange(index)}
            onKeyDown={handleOtpInputKeyDown(index)}
            onPaste={handlePaste(index)}
            className={clsx(
              'md:w-[46px] w-[40px] h-[40px] md:h-[46px] outline-none text-center text-xl rounded-xl border border-[#ffffff33] bg-neutral-50 text-white'
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div>
          {timeLeft > 0 ? (
            <div className="text-[#737373] text-base">
              Resend in <span>{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <span onClick={handleResend} className="text-Teal-500 cursor-pointer text-base underline">
              Resend
            </span>
          )}
        </div>
        <div onClick={handleChangeEmail} className="text-lg text-Teal-500 font-medium cursor-pointer underline">
          Change Email
        </div>
      </div>
      <div className="mt-5">
        <Button
          onClick={handleVerifyEmailOtp}
          type="submit"
          label={loading ? 'Verify Email...' : 'Verify Email'}
          aria-label="Verify Email"
          disabled={loading}
        />
      </div>
      <div className="flex justify-center items-center text-base font-normal mt-3 leading-6 text-Light">
        Already have an Easiva Account?
        <span onClick={handleSignInClick} className="text-Teal-500 ml-1 border-b cursor-pointer">
          Sign in here.
        </span>
      </div>
      {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
    </Modal>
  );
};
