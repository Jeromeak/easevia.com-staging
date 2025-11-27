import { useState, useCallback, useEffect } from 'react';
import { getCountries, getStates, getCities } from '@/lib/api/location';

export const useLocationDropdowns = () => {
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<boolean>(false);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);

  const [error, setError] = useState<string>('');

  const loadCountries = useCallback(async () => {
    setLoadingCountries(true);

    try {
      const countriesData = await getCountries();
      // Remove duplicates and create unique options
      const uniqueCountries = countriesData.filter(
        (country, index, self) => index === self.findIndex((c) => c.name === country.name)
      );
      const countryOptions = uniqueCountries.map((country, index) => ({
        label: country.name,
        value: country.name,
        key: `${country.name}-${index}`,
      }));
      setCountries(countryOptions);
    } catch (error) {
      console.error('Failed to load countries:', error);
      setError('Failed to load countries');
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  const loadStates = useCallback(async (countryName: string) => {
    if (!countryName) {
      setStates([]);
      setCities([]);

      return;
    }

    setLoadingStates(true);

    try {
      const statesData = await getStates(countryName);
      // Remove duplicates and create unique options
      const uniqueStates = statesData.filter(
        (state, index, self) => index === self.findIndex((s) => s.name === state.name)
      );
      const stateOptions = uniqueStates.map((state, index) => ({
        label: state.name,
        value: state.name,
        key: `${state.name}-${index}`,
      }));
      setStates(stateOptions);

      setCities([]);
    } catch (error) {
      console.error('Failed to load states:', error);
      setError('Failed to load states');
    } finally {
      setLoadingStates(false);
    }
  }, []);

  const loadCities = useCallback(async (countryName: string, stateName: string) => {
    if (!countryName || !stateName) {
      setCities([]);

      return;
    }

    setLoadingCities(true);

    try {
      const citiesData = await getCities(countryName, stateName);
      // Remove duplicates and create unique options
      const uniqueCities = [...new Set(citiesData)];
      const cityOptions = uniqueCities.map((city, index) => ({
        label: city,
        value: city,
        // Add index to ensure unique keys even if city names are identical
        key: `${city}-${index}`,
      }));
      setCities(cityOptions);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setError('Failed to load cities');
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);
  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  return {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    error,
    loadStates,
    loadCities,
  };
};
