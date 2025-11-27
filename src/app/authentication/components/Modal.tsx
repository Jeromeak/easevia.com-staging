import { CloseIcon, SecondaryLogo } from '@/icons/icon';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  subTitle,
  title,
  children,
  className = '',
  titleClassName = '',
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => {}} className="relative z-[100000]">
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

        <div className="fixed inset-0 flex items-center justify-center lg:px-4">
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
                'lg:max-w-[600px] lg:min-w-[600px] lg:h-fit flex justify-center flex-col h-full w-full rounded-xl relative dark:bg-neutral-50 bg-white md:p-10 shadow-lg',
                className
              )}
            >
              <div
                className="absolute top-[-1%] right-[-1%] bg-Teal-500 p-1 rounded-full cursor-pointer"
                onClick={onClose}
              >
                <CloseIcon />
              </div>
              <div className="absolute left-0 lg:hidden block top-0 w-full">
                <div className="w-full flex justify-between sticky top-0 items-center bg-white dark:bg-black px-5 py-3">
                  <SecondaryLogo width="80" height="50" />
                  <button
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                  >
                    <CloseIcon className="text-black dark:text-white" />
                  </button>
                </div>
              </div>
              <div className=" w-full hidden lg:flex justify-center pb-3 xl:pb-5">
                <SecondaryLogo width="130" height="74" />
              </div>
              <div className="p-5 md:p-0 lg:overflow-y-visible">
                <div
                  className={clsx(
                    'text-secondary text-3xl md:leading-11 md:text-4xl dark:text-white font-Neutra text-center',
                    titleClassName
                  )}
                >
                  {title}
                </div>
                {subTitle && (
                  <div
                    className={clsx(
                      'text-Light dark:text-gray-200 text-center text-base md:text-xl md:leading-6 font-normal xl:mt-3 mb-3 xl:mb-8',
                      titleClassName
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
