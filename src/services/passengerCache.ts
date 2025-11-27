import type { Passenger, PassengerCreateRequest, PassengerUpdateRequest } from '@/lib/types/api/passenger';
import { createPassenger, deletePassenger, fetchPassengers, updatePassenger } from '@/lib/api/passenger';

let cachedPassengers: Passenger[] | null = null;
let inflightListPromise: Promise<Passenger[]> | null = null;

export const getCachedPassengers = (): Passenger[] | null => cachedPassengers;

export const fetchPassengersOnce = async (): Promise<Passenger[]> => {
  if (cachedPassengers) return cachedPassengers;
  if (inflightListPromise) return inflightListPromise;
  inflightListPromise = fetchPassengers()
    .then((data) => {
      cachedPassengers = data;

      return data;
    })
    .finally(() => {
      inflightListPromise = null;
    });

  return inflightListPromise;
};

export const addPassenger = async (payload: PassengerCreateRequest): Promise<Passenger> => {
  const created = await createPassenger(payload);

  if (cachedPassengers) {
    cachedPassengers = [created, ...cachedPassengers];
  }

  return created;
};

export const editPassenger = async (id: string, payload: PassengerUpdateRequest): Promise<Passenger> => {
  const updated = await updatePassenger(id, payload);

  if (cachedPassengers) {
    cachedPassengers = cachedPassengers.map((p) => (p.id === id ? updated : p));
  }

  return updated;
};

export const removePassenger = async (id: string): Promise<void> => {
  await deletePassenger(id);

  if (cachedPassengers) {
    cachedPassengers = cachedPassengers.filter((p) => p.id !== id);
  }
};

export const clearPassengerCache = (): void => {
  cachedPassengers = null;
  inflightListPromise = null;
};
