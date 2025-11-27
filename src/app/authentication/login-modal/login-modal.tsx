'use client';
import { InputBox } from '../components/Input';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { SocialLogin } from '../components/SocialLogin';
import { GoogleIcon } from '@/icons/icon';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { Tab, TabType } from '../components/Tab';
import { sendLoginOtp } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/utils/error';
import { redirectToSocialLogin } from '@/utils/socialLogin';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import clsx from 'clsx';
import type { LoginModalProps } from '@/lib/types/common.types';
import {
  enforceCharacterLimit,
  validateMobileNumber,
  isValidEmailFormat,
  isValidMobileFormat,
} from '@/utils/fieldValidation';
import { FORM_MESSAGES } from '@/utils/messages';

export const LoginModal = ({ isOpen, onClose, onOpenCreateAccount, onOpenOtpModal }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.EMAIL);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { loginInputs, setLoginInputs } = useAuthFlow();

  // Restore form values when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedInput = activeTab === TabType.EMAIL ? loginInputs.email : loginInputs.mobile;
      setUserInput(savedInput);
      setMessage(null);
    }
  }, [isOpen, activeTab, loginInputs]);

  const handleOpenCreateAccount = useCallback(() => {
    setUserInput('');
    setMessage(null);
    setActiveTab(TabType.EMAIL);
    onOpenCreateAccount();
  }, [onOpenCreateAccount]);

  const InputLabel = useMemo(() => (activeTab === TabType.EMAIL ? 'Email' : 'Mobile'), [activeTab]);
  const inputPlaceholder = useMemo(
    () => (activeTab === TabType.EMAIL ? 'Enter email address' : 'Enter mobile number'),
    [activeTab]
  );

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      setMessage(null);

      // Restore saved value for the selected tab
      const savedInput = tab === TabType.EMAIL ? loginInputs.email : loginInputs.mobile;
      setUserInput(savedInput);
    },
    [loginInputs]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Enforce character limits and validation: email 254, mobile 17 with number validation
      if (activeTab === TabType.EMAIL) {
        value = enforceCharacterLimit(value, 254);
      } else {
        value = validateMobileNumber(value, 17);
      }

      setUserInput(value);
      setMessage(null);

      // Save input to context as user types
      if (activeTab === TabType.EMAIL) {
        setLoginInputs({ email: value });
      } else {
        setLoginInputs({ mobile: value });
      }
    },
    [activeTab, setLoginInputs]
  );

  const handleGoogleLogin = useCallback(() => {
    redirectToSocialLogin('google');
  }, []);

  const handleSendOtp = useCallback(async () => {
    setMessage(null);

    const input = userInput.trim();

    if (!input) {
      setMessage({ type: 'error', text: `Please enter a valid ${activeTab}.` });

      return;
    }

    // Validate character limits
    if (activeTab === TabType.EMAIL && input.length > 254) {
      setMessage({ type: 'error', text: FORM_MESSAGES.EMAIL_TOO_LONG });

      return;
    }

    if (activeTab === TabType.MOBILE && input.length > 17) {
      setMessage({ type: 'error', text: FORM_MESSAGES.MOBILE_TOO_LONG });

      return;
    }

    if (activeTab === TabType.EMAIL && !isValidEmailFormat(input)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });

      return;
    }

    if (activeTab === TabType.MOBILE && !isValidMobileFormat(input)) {
      setMessage({ type: 'error', text: 'Please enter a valid mobile number with country code (e.g. +1234567890).' });

      return;
    }

    setIsLoading(true);

    try {
      await sendLoginOtp(input, activeTab === TabType.MOBILE ? 'phone' : 'email');

      // Save input to context before opening OTP modal
      // Clear the opposite field when OTP is sent successfully
      if (activeTab === TabType.EMAIL) {
        setLoginInputs({ email: input, mobile: '' });
      } else {
        setLoginInputs({ email: '', mobile: input });
      }

      setMessage({ type: 'success', text: 'OTP sent successfully!' });

      setTimeout(() => {
        onOpenOtpModal({ input, tab: activeTab });
        setMessage(null);
      }, 500);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setMessage({ type: 'error', text: errorMessage });

      // Clear login inputs on critical errors
      if (
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('expired')
      ) {
        if (activeTab === TabType.EMAIL) {
          setLoginInputs({ email: '' });
        } else {
          setLoginInputs({ mobile: '' });
        }

        setUserInput('');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userInput, activeTab, onOpenOtpModal, setLoginInputs]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to Easevia"
      subTitle="Make trip planning easier and enjoy faster booking."
      titleClassName="text-center"
    >
      <div className="w-full gap-3 flex flex-col mt-10">
        <Tab activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="flex flex-col gap-2 mt-5 md:mt-10">
          <div className="text-neutral-50 dark:text-white text-base uppercase">{InputLabel}</div>
          <InputBox
            placeholder={inputPlaceholder}
            value={userInput}
            onChange={handleInputChange}
            maxLength={activeTab === TabType.EMAIL ? 254 : 17}
          />
        </div>
        {message && (
          <div
            className={clsx('mt-2 text-sm text-center', message.type === 'error' ? 'text-red-500' : 'text-green-500')}
          >
            {message.text}
          </div>
        )}
        <div className="w-full mt-4">
          <Button
            role="button"
            onClick={handleSendOtp}
            label={isLoading ? 'Sending...' : 'Send OTP'}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-center items-center  text-base font-normal mt-3 leading-6 text-Light">
          New here?
          <span
            role="button"
            onClick={handleOpenCreateAccount}
            className="ml-1.5 dark:text-Teal-900 text-Teal-500 border-b cursor-pointer"
          >
            Create an Easevia account
          </span>
        </div>
        <div className="flex justify-between items-center gap-5 w-full mt-3">
          <div className="w-[calc(48%_-_10px)] h-[1px] dark:bg-neutral-400 bg-lightborder" />
          <div className="text-Light text-xl font-normal ">Or</div>
          <div className="w-[calc(48%_-_10px)] dark:bg-neutral-400 h-[1px] bg-lightborder " />
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <SocialLogin onClick={handleGoogleLogin} label="Continue with Google" icon={<GoogleIcon />} />
        </div>
      </div>
    </Modal>
  );
};
