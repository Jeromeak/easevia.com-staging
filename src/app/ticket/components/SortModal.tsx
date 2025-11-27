import { CloseIcon } from '@/icons/icon';
import type { SortModalProps, SortDataTypes } from '@/lib/types/common.types';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

export const SortModal: React.FC<SortModalProps> = ({ isOpen, onClose }) => {
  const SortData: SortDataTypes[] = [
    { id: 1, Label: 'Fastest', subTitle: 'Fastest first' },
    { id: 2, Label: 'Departure time', subTitle: 'Earliest first' },
    { id: 3, Label: 'Arrival time', subTitle: 'Earliest first' },
    { id: 4, Label: 'Stops', subTitle: 'Fewest stops first' },
  ];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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

        <div className="fixed inset-0 flex items-end">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="w-full bg-white dark:bg-[#0D0D0D] rounded-t-2xl shadow-xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-neutral-50/10 dark:border-gray-700">
                <h2 className="text-xl font-normal dark:text-white">Sort by</h2>
                <button onClick={onClose} className="p-2 dark:text-white transition-colors">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-5 bg-white dark:bg-[#151515] p-6">
                {SortData.map((item) => (
                  <div className="flex flex-col " key={item.id}>
                    <div className="text-neutral-50 dark:text-[#A3A3A3] text-base">{item.Label}</div>
                    <div className="text-[#A3A3A3] text-xs">{item.subTitle}</div>
                  </div>
                ))}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
