'use client';
import type { TabType as AuthTabType } from '@/hooks/useAuthModal';
import { useAuthModal, AuthModalType } from '@/hooks/useAuthModal';
import { TabType } from '@/lib/types/common.types';
import { LoginModal } from '@/app/authentication/login-modal/login-modal';
import { CreateAccount } from '@/app/authentication/create-with-mail/create-with-mail-modal';
import { OtpModal } from '@/app/authentication/otp-modal/otp-modal';
import { VerifyEmailModal } from '@/app/authentication/verify-email-modal/verify-email-modal';
import { VerifyMobileModal } from '@/app/authentication/verify-mobile-modal/verify-mobile-modal';
import { ResetPassword } from '@/app/authentication/reset-password-modal/reset-password-modal';
import { ResetSuccess } from '@/app/authentication/reset-succes/reset-succes';
import { SuccessModal } from '@/app/authentication/success-modal/success-modal';
import { GoogleVerifyModal } from '@/app/authentication/google-verify-modal/google-verify-modal';
import { ContactSupport } from '@/app/authentication/contact-support/contact-support';
import { ChatboxModal } from '@/common/components/chatbox-modal';
import { Fragment, useCallback } from 'react';

export const GlobalAuthModals: React.FC = () => {
  const { currentModal, modalData, isOpen, closeModal, switchModal } = useAuthModal();

  const handleOpenCreateAccount = useCallback(() => {
    switchModal(AuthModalType.CREATE_ACCOUNT);
  }, [switchModal]);

  const handleOpenLogin = useCallback(() => {
    switchModal(AuthModalType.LOGIN);
  }, [switchModal]);

  const handleOpenOtpModal = useCallback(
    (data: { input: string; tab: TabType | undefined }) => {
      const convertedTab = data.tab as unknown as AuthTabType | undefined;

      return switchModal(AuthModalType.OTP, { ...data, tab: convertedTab });
    },
    [switchModal]
  );

  const handleOpenOtpModalSimple = useCallback(() => {
    switchModal(AuthModalType.OTP);
  }, [switchModal]);

  const handleOpenVerifyEmail = useCallback(() => {
    switchModal(AuthModalType.VERIFY_EMAIL, modalData || undefined);
  }, [switchModal, modalData]);

  const handleOpenVerifyMobile = useCallback(() => {
    switchModal(AuthModalType.VERIFY_MOBILE, modalData || undefined);
  }, [switchModal, modalData]);

  const handleOpenResetSuccess = useCallback(() => {
    switchModal(AuthModalType.RESET_SUCCESS);
  }, [switchModal]);

  const handleOpenSuccess = useCallback(
    (data?: { message?: string; title?: string; redirectPath?: string }) => {
      switchModal(AuthModalType.SUCCESS, data);
    },
    [switchModal]
  );

  const handleOpenGoogleVerify = useCallback(() => {
    switchModal(AuthModalType.GOOGLE_VERIFY);
  }, [switchModal]);

  const notImplemented = useCallback(() => {
    throw new Error('Function not implemented.');
  }, []);

  return (
    <Fragment>
      <LoginModal
        isOpen={isOpen && currentModal === AuthModalType.LOGIN}
        onClose={closeModal}
        onOpenCreateAccount={handleOpenCreateAccount}
        onOpenOtpModal={handleOpenOtpModal}
        openGoogleVerfiyModal={handleOpenGoogleVerify}
      />

      <CreateAccount
        isCreateModalOpen={isOpen && currentModal === AuthModalType.CREATE_ACCOUNT}
        onCloseCreateModal={closeModal}
        openSignInAccoount={handleOpenLogin}
        openVerifyEmailModal={handleOpenVerifyEmail}
        openGoogleVerifyModal={handleOpenGoogleVerify}
      />

      <OtpModal
        OtpModalOpen={isOpen && currentModal === AuthModalType.OTP}
        onOtpModalClose={closeModal}
        input={modalData?.input || ''}
        tab={
          Object.values(TabType).includes(modalData?.tab as unknown as TabType)
            ? (modalData?.tab as unknown as TabType)
            : TabType.EMAIL
        }
        onOpenCreateAccount={handleOpenCreateAccount}
        openGoogleVerifyModal={handleOpenGoogleVerify}
        onEdit={handleOpenLogin}
      />

      <VerifyEmailModal
        isVerifyEmailModalOpen={isOpen && currentModal === AuthModalType.VERIFY_EMAIL}
        onCloseVerifyEmailModal={closeModal}
        openSignInAccount={handleOpenLogin}
        openVerifyMobile={handleOpenVerifyMobile}
        isVerifyMobileModalOpen={false}
        onCloseVerifyMobileModal={notImplemented}
        openSignInAccoount={notImplemented}
        openSuccessModal={notImplemented}
      />

      <VerifyMobileModal
        isVerifyMobileModalOpen={isOpen && currentModal === AuthModalType.VERIFY_MOBILE}
        onCloseVerifyMobileModal={closeModal}
        openSignInAccoount={handleOpenLogin}
        openSuccessModal={handleOpenSuccess}
        isVerifyEmailModalOpen={false}
        onCloseVerifyEmailModal={notImplemented}
        openSignInAccount={notImplemented}
        openVerifyMobile={notImplemented}
      />

      <ResetPassword
        isResetPasswordModalOpen={isOpen && currentModal === AuthModalType.RESET_PASSWORD}
        onCloseResetPasswordModal={closeModal}
        openResetSuccess={handleOpenResetSuccess}
      />

      <ResetSuccess
        isResetSuccessModalOpen={isOpen && currentModal === AuthModalType.RESET_SUCCESS}
        onCloseResetSuccessModal={closeModal}
        onOpenLoginModal={handleOpenLogin}
      />

      <SuccessModal
        isSuccessModalOpen={isOpen && currentModal === AuthModalType.SUCCESS}
        onCloseSuccessModal={closeModal}
      />

      <GoogleVerifyModal
        isOpenGoogleVerify={isOpen && currentModal === AuthModalType.GOOGLE_VERIFY}
        onCloseGoogleVerify={closeModal}
        openMobileVerifyModal={handleOpenVerifyMobile}
        openSignInAccoount={notImplemented}
      />

      <ContactSupport
        isContactSupportModal={isOpen && currentModal === AuthModalType.CONTACT_SUPPORT}
        onCloseContactSupport={closeModal}
        onOpenOtpModal={handleOpenOtpModalSimple}
      />

      <ChatboxModal isOpen={isOpen && currentModal === AuthModalType.CHATBOX} onClose={closeModal} />
    </Fragment>
  );
};
