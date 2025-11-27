import { CloseIcon } from '@/icons/icon';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { LeftPannel } from './LeftPannel';
import type { FilterModalProps } from '@/lib/types/common.types';

interface FilterMobileModalProps extends FilterModalProps {
  filters?: {
    selectedAirlines: string[];
    transit?: string;
    travelClass?: string;
    departureTime: string[];
    arrivalTime: string[];
    durationRange: [number, number];
    selectedDate?: string;
  };
  onFilterChange?: (
    newFilters: Partial<{
      selectedAirlines: string[];
      transit?: string;
      travelClass?: string;
      departureTime: string[];
      arrivalTime: string[];
      durationRange: [number, number];
      selectedDate?: string;
    }>
  ) => void;
  onResetFilters?: () => void;
  loading?: boolean;
}

export const FilterMobileModal: React.FC<FilterMobileModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  loading,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[10000]">
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
        <div className="fixed inset-0">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="fixed left-0 top-0 h-full w-full max-w-sm bg-white dark:bg-[#0D0D0D] shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-neutral-50/10 dark:border-[#262626]">
                <h2 className="text-xl font-normal text-neutral-50 dark:text-white">Departure Filter</h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <LeftPannel
                  onclose={onClose}
                  disableModal={true}
                  filters={filters}
                  onFilterChange={onFilterChange}
                  onResetFilters={onResetFilters}
                  loading={loading}
                />
              </div>
              <div className="p-4 border-t border-neutral-50/10 dark:border-gray-700 dark:bg-[#0D0D0D]">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onResetFilters?.();
                      onClose();
                    }}
                    className="w-[40%] px-4 py-2 border border-Teal-500 rounded-full text-sm uppercase text-Teal-500"
                  >
                    Clear
                  </button>
                  <button
                    onClick={onClose}
                    className="w-[60%] px-4 py-2 rounded-full text-sm uppercase bg-Teal-500 text-white"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
