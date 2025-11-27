'use client';
import type { ModalProps } from '@/lib/types/common.types';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useCallback, useMemo } from 'react';

export const ErrorModal: React.FC<ModalProps> = ({ isOpen, onClose, children, className = '' }) => {
  const dialogPanelClass = useMemo(
    () => clsx('md:max-w-[600px] rounded-xl relative dark:bg-neutral-50 bg-white p-[40px] shadow-lg', className),
    [className]
  );
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center px-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel className={dialogPanelClass}>{children}</DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
