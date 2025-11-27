import { AddIcon, PencilIcon, CloseIcon } from '@/icons/icon';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { fetchPassengersOnce, removePassenger } from '@/services/passengerCache';
import type { Passenger } from '@/lib/types/api/passenger';
import { getInitials } from '@/utils/nameUtils';
import { Modal } from '@/app/authentication/components/Modal';

interface TravellersTabProps {
  onAddPassenger: () => void;
  onEditPassenger: (id: string) => void;
}

export const TravellersTab: React.FC<TravellersTabProps> = ({ onAddPassenger, onEditPassenger }) => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [passengerToDelete, setPassengerToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadPassengers = async () => {
      try {
        setLoading(true);
        const data = await fetchPassengersOnce();
        setPassengers(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Failed to load passengers');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPassengers();

    return () => {
      controller.abort();
    };
  }, []);

  const renderedPassengers = useMemo(() => passengers, [passengers]);

  const handleDeleteClick = (id: string) => {
    setPassengerToDelete(id);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!passengerToDelete) return;

    try {
      setDeleteError(null);
      await removePassenger(passengerToDelete);
      setPassengers((prev) => prev.filter((p) => p.id !== passengerToDelete));
      setShowDeleteModal(false);
      setPassengerToDelete(null);
      setDeleteError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete passenger';
      setDeleteError(errorMessage);
      // Keep modal open to show error
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPassengerToDelete(null);
    setDeleteError(null);
  };

  return (
    <Fragment>
      <div className="w-full lg:flex hidden lg:static sticky z-100 top-[84px]  flex-wrap justify-between rounded-e-sm items-center px-5 md:px-8 h-20 bg-[#E6F2F2] dark:bg-gray-300">
        <div className="md:text-32 text-2xl md:leading-[32px] text-neutral-50 dark:text-white uppercase font-Neutra">
          Passengers
        </div>
        <div>
          <button
            onClick={onAddPassenger}
            className="bg-Teal-500 Teal text-white px-5 flex items-center gap-2 uppercase text-sm cursor-pointer py-1.5 rounded-full"
          >
            <AddIcon />
            <div>Add Passenger</div>
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col lg:mt-0 md:mt-20 mt-36 h-full gap-4 md:p-8 p-5">
        {loading && <div className="text-white">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && renderedPassengers.length === 0 && (
          <div className="text-[#94949C]">No passengers found.</div>
        )}
        {!loading &&
          !error &&
          renderedPassengers.map((p) => {
            const initials = getInitials(p.name);

            return (
              <div
                key={p.id}
                className="bg-blue-150 dark:bg-gray-300 px-6 py-4 w-full rounded-xl flex justify-between items-center"
              >
                <div className="flex gap-3 items-center">
                  <div className="flex uppercase text-white dark:text-black font-Neutra text-xl justify-center items-center bg-Teal-500 md:w-12 w-8 h-8 md:h-12 rounded-full">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-base md:text-xl font-medium dark:text-white">{p.name}</div>
                    <div className="text-[#94949C] text-xs md:text-sm">
                      {p.gender}, {p.relationship_with_user}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="button"
                    onClick={() => onEditPassenger(p.id)}
                    className="border uppercase hover:bg-Teal-500 hover:text-white dark:hover:text-black duration-500 text-Teal-500 text-sm  cursor-pointer border-Teal-500 rounded-full py-0 w-10 h-10 justify-center md:w-fit md:h-fit md:py-2 bg-transparent flex items-center gap-2 px-0 md:px-5"
                  >
                    <PencilIcon />
                    <div className="md:block hidden">Edit</div>
                  </button>
                  <button
                    type="button"
                    role="button"
                    onClick={() => handleDeleteClick(p.id)}
                    className="border uppercase hover:bg-red-500 hover:text-white dark:hover:text-black duration-500 text-red-400 text-sm  cursor-pointer border-red-500 rounded-full py-0 w-10 h-10 justify-center md:w-fit md:h-fit md:py-2 bg-transparent flex items-center gap-2 px-0 md:px-5"
                  >
                    <CloseIcon />
                    <div className="md:block hidden">Delete</div>
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <Modal isOpen={showDeleteModal} onClose={handleCancelDelete} className="max-w-md">
        <div className="flex flex-col gap-4">
          {deleteError ? (
            <div className="flex flex-col gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm md:text-base text-center">{deleteError}</p>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  role="button"
                  onClick={handleCancelDelete}
                  className="bg-Teal-500 w-[50%] text-white px-6 uppercase text-sm cursor-pointer py-2 rounded-full hover:bg-opacity-80 duration-500"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="dark:text-white text-xl md:text-2xl text-center">
                Are you sure you want to delete this passenger? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center mt-4">
                <button
                  type="button"
                  role="button"
                  onClick={handleConfirmDelete}
                  className="bg-Teal-500 w-[50%] text-white px-6 uppercase text-sm cursor-pointer py-2 rounded-full hover:bg-opacity-80 duration-500"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  role="button"
                  onClick={handleCancelDelete}
                  className="bg-transparent border w-[50%] border-Teal-500 text-Teal-500 hover:text-white hover:bg-Teal-500 duration-500 px-6 uppercase text-sm cursor-pointer py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Fragment>
  );
};
