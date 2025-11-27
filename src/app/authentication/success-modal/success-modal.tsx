import { useRouter } from 'next/navigation';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useCallback } from 'react';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import clsx from 'clsx';
import type { successNodalProps } from '@/lib/types/common.types';

export const SuccessModal: React.FC<successNodalProps> = ({ isSuccessModalOpen, onCloseSuccessModal }) => {
  const router = useRouter();
  const { resetForm } = useAuthFlow();

  const goToDashboard = useCallback(() => {
    // Clear form data on successful signup completion
    resetForm();
    router.push('/booking');
  }, [router, resetForm]);

  return (
    <Modal
      isOpen={isSuccessModalOpen}
      onClose={onCloseSuccessModal}
      title="You’re All Set!"
      subTitle="Your Easevia account has been created successfully."
    >
      <div className={clsx('py-5')}>
        <Button label="Go to dashboard" onClick={goToDashboard} />
      </div>
      <div className={clsx('text-[#8E8E8E] text-center text-base leading-6')}>Welcome to Easevia</div>
    </Modal>
  );
};
