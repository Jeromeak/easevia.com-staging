import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../components/Button';
import { InputBox } from '../components/Input';
import { Modal } from '../components/Modal';
import { sendPhoneOtp } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/utils/error';
import { getAccessToken } from '@/utils/tokenStorage';
import { useRouter } from 'next/navigation';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import type { SignupPayload } from '@/lib/types/api/auth';
import type { GoogleVerifyModalProps } from '@/lib/types/common.types';

export const GoogleVerifyModal: React.FC<GoogleVerifyModalProps> = ({
  isOpenGoogleVerify,
  onCloseGoogleVerify,
  openMobileVerifyModal,
  openSignInAccoount,
}) => {
  const [form, setForm] = useState<SignupPayload>({
    name: '',
    email: '',
    phone: '',
  });
  const { setFormData } = useAuthFlow();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');

  const router = useRouter();

  const isValidPhone = (phone: string) => {
    return /^\+\d{10,15}$/.test(phone);
  };

  const handleChange = useCallback((key: keyof SignupPayload, value: string) => {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value),
    [handleChange]
  );

  const handleSendOtp = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess('');

    const token = await getAccessToken();

    if (!form.phone) {
      setError('Mobile Number is required!');

      return;
    }

    if (!isValidPhone(form.phone)) {
      setError('Please enter a valid mobile number!');

      return;
    }

    try {
      if (!token) {
        setError('Something went wrong');
        router.push('/');

        return;
      }

      setFormData(form);

      await sendPhoneOtp(token, form.phone);

      setSuccess('OTP sent successfully!');
      openMobileVerifyModal();
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form, setFormData, openMobileVerifyModal, router]);

  const handleSignInClick = useCallback(() => {
    openSignInAccoount();
  }, [openSignInAccoount]);

  return (
    <Modal
      isOpen={isOpenGoogleVerify}
      onClose={onCloseGoogleVerify}
      title="Verify your mobile number"
      subTitle="Verify your phone number with Google"
      titleClassName="text-center"
    >
      <div className={clsx('flex flex-col')}>
        <InputBox
          type="text"
          placeholder="Enter mobile number"
          label="Mobile Number"
          value={form.phone}
          onChange={handlePhoneChange}
        />
        <div className={clsx('mt-5')}>
          <Button
            onClick={handleSendOtp}
            label={loading ? 'Sending...' : 'Send OTP'}
            disabled={loading || !form.phone}
          />
        </div>
        {error && <p className={clsx('text-sm text-red-500 text-center')}>{error}</p>}
        {success && <p className={clsx('text-sm text-green-600 text-center')}>{success}</p>}
        <div className={clsx('flex justify-center items-center text-base font-normal mt-3 leading-6 text-Light')}>
          Already have an Easiva Account?
          <span onClick={handleSignInClick} className="text-Teal-500 ml-1 border-b cursor-pointer">
            Sign in here.
          </span>
        </div>
      </div>
    </Modal>
  );
};
