import { useCallback } from 'react';
import clsx from 'clsx';
import { Button } from '../components/Button';
import { InputBox } from '../components/Input';
import { Modal } from '../components/Modal';
import type { ResetPasswordModalProps } from '@/lib/types/common.types';

export const ResetPassword: React.FC<ResetPasswordModalProps> = ({
  isResetPasswordModalOpen,
  onCloseResetPasswordModal,
  openResetSuccess,
}) => {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onCloseResetPasswordModal();
      openResetSuccess();
    },
    [onCloseResetPasswordModal, openResetSuccess]
  );

  return (
    <Modal
      isOpen={isResetPasswordModalOpen}
      onClose={onCloseResetPasswordModal}
      title="Reset password"
      subTitle="Create your new password here"
    >
      <div className={clsx('w-full')}>
        <form onSubmit={handleSubmit} action="" className={clsx('w-full flex flex-col gap-3')}>
          <div>
            <InputBox type="password" placeholder="Enter password" label="Password" />
          </div>
          <div>
            <InputBox type="password" placeholder="Enter confirmed password" label="Confirmed Password" />
          </div>
          <div className={clsx('mt-5')}>
            <Button label="Reset password" type="submit" />
          </div>
        </form>
      </div>
    </Modal>
  );
};
