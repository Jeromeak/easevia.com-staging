import { useCallback } from 'react';
import clsx from 'clsx';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import type { ResetSuccessProps } from '@/lib/types/common.types';

export const ResetSuccess: React.FC<ResetSuccessProps> = ({
  isResetSuccessModalOpen,
  onCloseResetSuccessModal,
  onOpenLoginModal,
}) => {
  const handleBackToLogin = useCallback(() => {
    onCloseResetSuccessModal();
    onOpenLoginModal();
  }, [onCloseResetSuccessModal, onOpenLoginModal]);

  return (
    <Modal isOpen={isResetSuccessModalOpen} onClose={onCloseResetSuccessModal}>
      <div className={clsx('w-full')}>
        <form className={clsx('w-full flex flex-col gap-3')}>
          <div className={clsx('text-center w-full text-32 leading-[32px] text-white')}>
            Password reset successfully
          </div>
          <div className={clsx('mt-5')}>
            <Button onClick={handleBackToLogin} label="Back to login" />
          </div>
        </form>
      </div>
    </Modal>
  );
};
