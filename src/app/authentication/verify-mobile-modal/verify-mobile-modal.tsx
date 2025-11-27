import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import { getAccessToken } from '@/utils/tokenStorage';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/utils/error';
import { useLanguageCurrency } from '@/context/hooks/useLanguageCurrency';
import { useAuth } from '@/context/hooks/useAuth';
import { fetchUserInfo } from '@/lib/api/user';
import clsx from 'clsx';
import type { VerifyModalProps } from '@/lib/types/common.types';

export const VerifyMobileModal: React.FC<VerifyModalProps> = ({
  isVerifyMobileModalOpen,
  onCloseVerifyMobileModal,
  openSignInAccoount,
  openSuccessModal,
}) => {
  const router = useRouter();
  const { triggerCurrencyFetch } = useLanguageCurrency();
  const { setUser } = useAuth();
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { formData } = useAuthFlow();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVerifyMobileModalOpen) {
      setPin(['', '', '', '', '', '']);
      setTimeLeft(60);
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }

    return () => clearInterval(timer);
  }, [isVerifyMobileModalOpen]);

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

  const handleResend = useCallback(async () => {
    setError(null);
    setPin(['', '', '', '', '', '']);

    try {
      const token = await getAccessToken();

      if (!token) {
        setError('Token not found!');

        router.push('/');

        return;
      }

      await sendPhoneOtp(token);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }

    setTimeLeft(60);
    inputRefs.current[0]?.focus();
  }, [router]);

  const formatTime = useCallback((seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');

    return `${mins}:${secs}`;
  }, []);

  const handleVerifyPhoneOtp = useCallback(async () => {
    const otp = pin.join('');

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');

      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = await getAccessToken();

      if (!token) {
        setError('Token not found!');

        router.push('/');

        return;
      }

      const response = await verifyPhoneOtp(token, otp);

      //* Fetch user info and set in context after phone verification
      try {
        const userResponse = await fetchUserInfo(token);
        setUser(userResponse?.data || null);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        // Continue even if user fetch fails
      }

      //* Trigger currency fetch immediately after phone verification is complete
      await triggerCurrencyFetch();

      if (response?.data) setSuccess(response?.data?.message);

      //* For login flow, redirect directly to booking page
      //* For signup flow, show success modal
      if (openSuccessModal) {
        // Clear form data on successful signup completion
        // Note: This will be handled in the success modal
        openSuccessModal();
      } else {
        //* Direct redirect for login flow
        router.push('/booking');
      }
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
  }, [pin, router, openSuccessModal]);

  const handleChangeNumber = useCallback(() => {
    // Go back to create account modal which will restore formData from context
    openSignInAccoount();
  }, [openSignInAccoount]);

  const errorMessage = useMemo(
    () => error && <div className={clsx('text-red-500 text-center text-sm mt-2')}>{error}</div>,
    [error]
  );

  const successMessage = useMemo(
    () => success && <div className={clsx('text-green-500 text-center text-sm mt-2')}>{success}</div>,
    [success]
  );

  return (
    <Modal
      isOpen={isVerifyMobileModalOpen}
      onClose={onCloseVerifyMobileModal}
      title="Verify Your Mobile Number"
      titleClassName="text-center"
    >
      <div className="text-Light dark:text-gray-200  text-xl leading-[24px] font-normal mt-3 mb-8">
        A code has been sent to <span className="text-white "> {formData?.phone}</span>. Enter it below to verify.
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
        <div onClick={handleChangeNumber} className="text-lg text-Teal-500 font-medium cursor-pointer underline">
          Change number
        </div>
      </div>
      <div className="mt-5">
        <Button
          onClick={handleVerifyPhoneOtp}
          type="submit"
          label={loading ? 'Verifying...' : 'Verify mobile'}
          aria-label="Verify Email"
          disabled={loading}
        />
      </div>
      {errorMessage}
      {successMessage}
    </Modal>
  );
};
