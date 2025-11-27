import type { City } from '@/lib/types/api/city';
import { fetchCities } from '@/lib/api/city';

let cachedCities: City[] | null = null;
let inflightPromise: Promise<City[]> | null = null;

export const getCachedCities = (): City[] | null => cachedCities;

export const fetchCitiesOnce = async (): Promise<City[]> => {
  if (cachedCities) return cachedCities;
  if (inflightPromise) return inflightPromise;
  inflightPromise = fetchCities()
    .then((data) => {
      cachedCities = data;

      return data;
    })
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
};
