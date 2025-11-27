import type { ContactSupportProps } from '@/lib/types/common.types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useCallback } from 'react';

export const ContactSupport: React.FC<ContactSupportProps> = ({
  isContactSupportModal,
  onCloseContactSupport,
  onOpenOtpModal,
}) => {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onCloseContactSupport();
      onOpenOtpModal();
    },
    [onCloseContactSupport, onOpenOtpModal]
  );

  return (
    <Modal isOpen={isContactSupportModal} onClose={onCloseContactSupport}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="text-center text-white text-xl">
          This email ID is not registered. Please contact our support team.
        </div>
        <div className="mt-3">
          <Button type="submit" label="Contact Support" />
        </div>
      </form>
    </Modal>
  );
};
