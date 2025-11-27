import { CloseIcon } from '@/icons/icon';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import clsx from 'clsx';
import type { RouteModalProps } from '@/lib/types/common.types';

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  subTitle,
  title,
  children,
  className = '',
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className={clsx('relative z-10000000')}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={clsx('fixed inset-0 bg-black/40 backdrop-blur-sm')} aria-hidden="true" />
        </TransitionChild>

        <div className={clsx('fixed inset-0 flex items-center justify-center md:px-4')}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel
              className={clsx(
                'md:max-w-[450px] md:min-w-[450px] h-fit flex justify-center flex-col w-[300px] rounded-xl relative dark:bg-neutral-50 bg-white px-2.5 py-5 md:p-5 shadow-lg',
                className
              )}
            >
              <div className={clsx('flex justify-between pl-5 md:p-0')}>
                <div className={clsx('w-full flex justify-start pb-0 md:pb-5')}>
                  {title} <span className={clsx('text-yellow-400 pl-1')}>10</span>
                </div>
                <button type="button" onClick={onClose} className={clsx('cursor-pointer pb-4')}>
                  <CloseIcon />
                </button>
              </div>
              <div className={clsx('p-5 md:p-0 lg:overflow-y-visible overflow-y-scroll md:max-h-fit max-h-[40vh]')}>
                {subTitle && (
                  <div
                    className={clsx(
                      'text-Light dark:text-gray-200 text-base md:text-xl md:leading-6 font-normal md:mt-3 md:mb-8'
                    )}
                  >
                    {subTitle}
                  </div>
                )}
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
