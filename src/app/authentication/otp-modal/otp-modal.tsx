'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Modal } from '../components/Modal';
import { Tab, TabType } from '../components/Tab';
import { Button } from '../components/Button';
import { GoogleIcon } from '@/icons/icon';
import { SocialLogin } from '../components/SocialLogin';
import { sendLoginOtp, verifyLoginOtp, sendPhoneOtp } from '@/lib/api/auth';
import { saveTokens, clearTokens } from '@/utils/tokenStorage';
import { primeRefreshToken } from '@/utils/refreshToken';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/utils/error';
import { useAuth } from '@/context/hooks/useAuth';
import { fetchUserInfo } from '@/lib/api/user';
import { useLanguageCurrency } from '@/context/hooks/useLanguageCurrency';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import clsx from 'clsx';
import type { OtpModalProps } from '@/lib/types/common.types';

export const OtpModal: React.FC<OtpModalProps> = ({
  OtpModalOpen,
  onOtpModalClose,
  onEdit,
  input,
  tab,
  onOpenCreateAccount,
  openGoogleVerifyModal,
  onOpenPhoneVerify,
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { triggerCurrencyFetch } = useLanguageCurrency();
  const { resetLoginInputs } = useAuthFlow();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (OtpModalOpen) {
      setPin(['', '', '', '', '', '']);
      setTimeLeft(60);
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }

    return () => clearInterval(timer);
  }, [OtpModalOpen]);

  const handleChange = useCallback(
    (index: number, value: string) => {
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [pin]
  );

  const handleEdit = useCallback(() => {
    // Go back to login modal which will restore loginInputs from context
    onEdit();
  }, [onEdit]);

  const handleTabChange = useCallback(() => {}, []);

  const handleCreateAccount = useCallback(() => {
    onOpenCreateAccount();
  }, [onOpenCreateAccount]);

  const handleGoogleLogin = useCallback(() => {
    openGoogleVerifyModal();
  }, [openGoogleVerifyModal]);

  const handleOtpInputChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(index, e.target.value);
    },
    [handleChange]
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

      const filledCount = Math.min(digits.length, 6 - startIndex);
      const nextIndex = startIndex + filledCount - 1;

      if (nextIndex >= 0 && nextIndex < 5) {
        inputRefs.current[nextIndex + 1]?.focus();
      }
    },
    [pin]
  );

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      if (el) inputRefs.current[index] = el;
    },
    []
  );
  const handleOtpInputKeyDown = useCallback(
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      handleKeyDown(e, index);
    },
    [handleKeyDown]
  );
  const handleVerify = useCallback(async () => {
    const otp = pin.join('');

    if (otp.length !== 6) return;

    setLoading(true);

    try {
      const type = tab === TabType.EMAIL ? 'email' : 'phone';

      const otpResponse = await verifyLoginOtp(input, otp, type);
      const { access_token, refresh_token } = otpResponse.data;

      saveTokens(access_token, refresh_token);

      //* Trigger currency fetch now that user has token
      await triggerCurrencyFetch();

      // Prime the refresh token with Supabase
      try {
        await primeRefreshToken(refresh_token);
      } catch {
        setErrorMsg('Failed to update refresh token. Please try logging in again.');
      }

      try {
        const userResponse = await fetchUserInfo(access_token);
        const userData = userResponse.data;
        setUser(userData);

        //* Check if phone verification is required after email verification
        if (tab === TabType.EMAIL && !userData.phone_verified && onOpenPhoneVerify) {
          //* Send phone OTP for verification
          try {
            await sendPhoneOtp(access_token);
            //* Close OTP modal and open phone verification modal
            // Don't clear login inputs yet - login flow is not complete
            onOtpModalClose();
            onOpenPhoneVerify();

            return; // Exit early to prevent redirect to booking
          } catch (phoneError) {
            console.error('Failed to send phone OTP:', phoneError);
            // Continue with normal flow if phone OTP fails
          }
        }
      } catch (error: unknown) {
        const userError = getErrorMessage(error);

        if (userError === 'unauthorized') {
          clearTokens();
          setUser(null);
        } else {
          console.error('Failed to fetch user info:', userError);
        }
      }

      // Clear login inputs on successful login completion
      resetLoginInputs();
      onOtpModalClose();
      router.push('/booking');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setErrorMsg(errorMessage);

      // Clear login inputs on critical errors
      if (
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('expired')
      ) {
        resetLoginInputs();
      }
    } finally {
      setLoading(false);
    }
  }, [pin, input, tab, onOtpModalClose, router, setUser, resetLoginInputs]);

  const handleResend = useCallback(async () => {
    setPin(['', '', '', '', '', '']);

    await sendLoginOtp(input.trim(), tab === TabType.MOBILE ? 'phone' : 'email');

    setTimeLeft(60);
    inputRefs.current[0]?.focus();
  }, [input, tab]);

  const formatTime = useCallback((seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');

    return `${mins}:${secs}`;
  }, []);

  const inputLabel = useMemo(() => (tab === TabType.EMAIL ? 'Email address' : 'Mobile Number'), [tab]);

  return (
    <Modal
      title="Welcome to Easevia"
      subTitle="Make trip planning easier and enjoy faster booking."
      isOpen={OtpModalOpen}
      onClose={onOtpModalClose}
    >
      <div className="flex flex-col  w-full mt-5 xxl:mt-10 gap-3 xxl:gap-6">
        <Tab activeTab={tab} onTabChange={handleTabChange} />
        <div className="flex justify-between items-start">
          <div>
            <div className="text-black dark:text-white font-medium text-base">{input}</div>
            <div className="text-Light text-base font-medium">{inputLabel}</div>
          </div>
          <div onClick={handleEdit} className="underline text-lg text-black dark:text-white cursor-pointer">
            Edit
          </div>
        </div>
        <div className="text-base font-medium text-black dark:text-white">Enter OTP</div>
        <div className="flex gap-4">
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
              className="md:w-[46px] w-[40px] h-[40px] md:h-[46px] outline-none text-center text-xl rounded-xl border border-[#ffffff33] bg-blue-150 dark:bg-neutral-50 text-black dark:text-white"
            />
          ))}
        </div>
        <div>
          {timeLeft > 0 ? (
            <div className="text-[#D4D4D4] text-sm mt-2">
              Didn’t receive the OTP? Retry in <span className="text-[#D93E39]">{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <div className="text-[#D4D4D4] text-sm mt-2">
              Didn’t receive the OTP?{' '}
              <span onClick={handleResend} className="text-Teal-500 cursor-pointer text-base underline">
                Resend
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center  text-base font-normal mt-3 leading-6 text-Light">
          New here?
          <span
            onClick={handleCreateAccount}
            className="ml-1.5 dark:text-Teal-900 text-Teal-500 border-b cursor-pointer"
          >
            Create an Easevia account
          </span>
        </div>
        <div className="flex justify-between items-center gap-5 w-full xxl:mt-3">
          <div className="w-[calc(48%_-_10px)] h-[1px] dark:bg-neutral-400 bg-lightborder" />
          <div className="text-Light text-xl font-normal ">Or</div>
          <div className="w-[calc(48%_-_10px)] dark:bg-neutral-400 h-[1px] bg-lightborder " />
        </div>
        <div className="flex flex-col gap-3 xxl:mt-3">
          <SocialLogin onClick={handleGoogleLogin} label="Continue with Google" icon={<GoogleIcon />} />
        </div>
        <Button onClick={handleVerify} label={loading ? 'Verifying...' : 'Verify OTP'} disabled={loading} />
      </div>
      {errorMsg && (
        <div className={clsx('text-red-500 text-sm text-center font-medium', errorMsg && 'mt-1')}>{errorMsg}</div>
      )}
    </Modal>
  );
};
