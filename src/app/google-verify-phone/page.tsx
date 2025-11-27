'use client';
import { Fragment, useCallback, useState } from 'react';
import { GoogleVerifyModal } from '../authentication/google-verify-modal/google-verify-modal';
import { VerifyMobileModal } from '../authentication/verify-mobile-modal/verify-mobile-modal';
import { SuccessModal } from '../authentication/success-modal/success-modal';
import { ModalType } from '@/lib/types/common.types';

const GoogleVerifyPhonePage = () => {
  const notImplemented = useCallback((): void => {
    throw new Error('Function not implemented.');
  }, []);
  const [activeModal, setActiveModal] = useState<ModalType | null>(ModalType.GOOGLE);

  const handleMobileVerify = useCallback(() => {
    setActiveModal(ModalType.VERIFY_MOBILE);
  }, []);

  const handleSuccess = useCallback(() => {
    setActiveModal(ModalType.SUCCESS);
  }, []);

  const handleEmailChange = useCallback(() => {
    setActiveModal(ModalType.GOOGLE);
  }, []);

  const handleCloseVerifyMobileModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCloseGoogleVerify = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCloseSuccessModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <Fragment>
      <VerifyMobileModal
        openSuccessModal={handleSuccess}
        openSignInAccoount={handleEmailChange}
        isVerifyMobileModalOpen={activeModal === ModalType.VERIFY_MOBILE}
        onCloseVerifyMobileModal={handleCloseVerifyMobileModal}
        isVerifyEmailModalOpen={false}
        onCloseVerifyEmailModal={notImplemented}
        openSignInAccount={notImplemented}
        openVerifyMobile={notImplemented}
      />

      <GoogleVerifyModal
        openMobileVerifyModal={handleMobileVerify}
        isOpenGoogleVerify={activeModal === ModalType.GOOGLE}
        onCloseGoogleVerify={handleCloseGoogleVerify}
        openSignInAccoount={notImplemented}
      />

      <SuccessModal
        onCloseSuccessModal={handleCloseSuccessModal}
        isSuccessModalOpen={activeModal === ModalType.SUCCESS}
      />
    </Fragment>
  );
};

export default GoogleVerifyPhonePage;
