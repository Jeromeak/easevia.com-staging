import { GoogleIcon } from '@/icons/icon';
import { Button } from '../components/Button';
import { InputBox } from '../components/Input';
import { Modal } from '../components/Modal';
import { SocialLogin } from '../components/SocialLogin';
import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { sendSignupOtp } from '@/lib/api/auth';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import { getErrorMessage } from '@/lib/utils/error';
import { redirectToSocialLogin } from '@/utils/socialLogin';
import type { SignupPayload } from '@/lib/types/api/auth';
import { AUTH_MESSAGES, FORM_MESSAGES, UI_MESSAGES } from '@/utils/messages';
import type { CreateModalProps } from '@/lib/types/common.types';
import {
  enforceCharacterLimit,
  validateMobileNumber,
  isValidEmailFormat,
  isValidMobileFormat,
} from '@/utils/fieldValidation';

export const CreateAccount: React.FC<CreateModalProps> = ({
  isCreateModalOpen,
  openSignInAccoount,
  onCloseCreateModal,
  openVerifyEmailModal,
}) => {
  const { formData, setFormData } = useAuthFlow();
  const [form, setForm] = useState<SignupPayload>({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Restore form values from context when modal opens
  useEffect(() => {
    if (isCreateModalOpen) {
      setForm({
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
      });
      setError(null);
    }
  }, [isCreateModalOpen, formData]);

  const handleChange = useCallback(
    (key: keyof SignupPayload, value: string) => {
      setError(null);
      setForm((prev) => ({ ...prev, [key]: value }));
      // Save to context as user types
      setFormData({ [key]: value });
    },
    [setFormData]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const limitedValue = enforceCharacterLimit(e.target.value, 254);
      handleChange('email', limitedValue);
    },
    [handleChange]
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const validatedValue = validateMobileNumber(e.target.value, 17);
      handleChange('phone', validatedValue);
    },
    [handleChange]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Only allow letters, numbers, and spaces (no special characters)
      if (value === '' || /^[a-zA-Z0-9\s]*$/.test(value)) {
        // Enforce 25 character limit
        const limitedValue = enforceCharacterLimit(value, 25);
        handleChange('name', limitedValue);
      }
    },
    [handleChange]
  );

  const handleSocialLogin = useCallback(() => {
    redirectToSocialLogin('google');
  }, []);

  const handleSignInClick = useCallback(() => {
    openSignInAccoount();
  }, [openSignInAccoount]);

  const handleSubmit = useCallback(async () => {
    setError(null);

    if (!form.name || !form.email || !form.phone) {
      setError(FORM_MESSAGES.ALL_FIELDS_REQUIRED);

      return;
    }

    // Validate username: only letters, numbers, and spaces allowed (no special characters)
    if (!/^[a-zA-Z0-9\s]+$/.test(form.name)) {
      setError(FORM_MESSAGES.INVALID_USERNAME);

      return;
    }

    // Validate username length: maximum 25 characters
    if (form.name.length > 25) {
      setError(FORM_MESSAGES.USERNAME_TOO_LONG);

      return;
    }

    // Validate email length: maximum 254 characters
    if (form.email.length > 254) {
      setError(FORM_MESSAGES.EMAIL_TOO_LONG);

      return;
    }

    if (!isValidEmailFormat(form.email)) {
      setError(FORM_MESSAGES.INVALID_EMAIL);

      return;
    }

    // Validate mobile length: maximum 17 characters
    if (form.phone.length > 17) {
      setError(FORM_MESSAGES.MOBILE_TOO_LONG);

      return;
    }

    if (!isValidMobileFormat(form.phone)) {
      setError(FORM_MESSAGES.INVALID_PHONE);

      return;
    }

    setLoading(true);

    try {
      setFormData(form);

      await sendSignupOtp(form);
      openVerifyEmailModal();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);

      // Clear form data on critical errors
      if (
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('expired')
      ) {
        setFormData({ name: '', email: '', phone: '' });
        setForm({ name: '', email: '', phone: '' });
      }
    } finally {
      setLoading(false);
    }
  }, [form, setFormData, openVerifyEmailModal]);

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={onCloseCreateModal}
      title="Create an account"
      className="relative"
      titleClassName="text-center"
      subTitle="Make trip planning easier and enjoy faster booking."
    >
      <div className={clsx('gap-3 pb-10 px-1 flex flex-col')}>
        <div className={clsx('w-full xl:gap-3 gap-2 flex flex-col')}>
          <InputBox
            type="text"
            placeholder="Enter user name"
            label="User Name "
            value={form.name}
            onChange={handleNameChange}
            maxLength={25}
          />
          <InputBox
            type="email"
            placeholder="Enter email address"
            label="Email"
            subText={`(${AUTH_MESSAGES.EMAIL_VERIFY_TEXT})`}
            value={form?.email}
            onChange={handleEmailChange}
            maxLength={254}
          />
          <InputBox
            type="text"
            placeholder="Enter mobile number"
            label="Mobile"
            subText={`(${AUTH_MESSAGES.MOBILE_VERIFY_TEXT})`}
            value={form?.phone}
            onChange={handlePhoneChange}
            maxLength={17}
          />
          {error && <div className="text-red-500 mt-1 text-sm">{error}</div>}
          <div className={clsx('mt-2')}>
            <Button onClick={handleSubmit} type="submit" disabled={loading} aria-label="Next">
              {loading ? UI_MESSAGES.LOADING : UI_MESSAGES.NEXT}
            </Button>
          </div>
          <div className={clsx('flex justify-center items-center text-base font-normal xl:mt-3 leading-6 text-Light')}>
            {UI_MESSAGES.ALREADY_HAVE_ACCOUNT}
            <span onClick={handleSignInClick} className="text-Teal-500 ml-1 border-b cursor-pointer">
              {UI_MESSAGES.SIGN_IN_HERE}
            </span>
          </div>
          <div className={clsx('flex justify-between items-center gap-5 w-full xl:mt-3')}>
            <div className="w-[calc(48%_-_10px)] h-[1px] dark:bg-neutral-400 bg-lightborder" />
            <div className="text-Light text-xl font-normal">{UI_MESSAGES.OR}</div>
            <div className="w-[calc(48%_-_10px)] h-[1px] dark:bg-neutral-400 bg-lightborder" />
          </div>
          <div className={clsx('flex flex-col gap-3 xl:mt-3')}>
            <SocialLogin onClick={handleSocialLogin} label={UI_MESSAGES.CONTINUE_WITH_GOOGLE} icon={<GoogleIcon />} />
          </div>
          <div className={clsx('text-Light leading-5 xl:mt-3')}>
            {UI_MESSAGES.TERMS_AGREEMENT}{' '}
            <span className="text-Teal-500 dark:text-Teal-900">
              <Link title="Terms of Service" href="/terms-and-conditions">
                {UI_MESSAGES.TERMS_OF_SERVICE}
              </Link>
            </span>{' '}
            and{' '}
            <span className="text-Teal-500 dark:text-Teal-900">
              <Link href="">{UI_MESSAGES.PRIVACY_POLICY}</Link>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
