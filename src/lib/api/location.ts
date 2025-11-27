import axios from 'axios';
import type { Country, City, LocationResponse, State } from '../types/api/location';

const apiUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL || '';

//* Get all countries
export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<LocationResponse<Country[]>>(`${apiUrl}/countries/positions`);
    const data = response.data;

    if (data?.error) {
      throw new Error(data?.msg);
    }

    return data?.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

//* Get states for a specific country
export const getStates = async (country: string): Promise<State[]> => {
  try {
    const response = await axios.post<LocationResponse<{ states: State[] }>>(
      `${apiUrl}/countries/states`,
      { country },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = response.data;

    if (data?.error) {
      throw new Error(data?.msg);
    }

    return data?.data?.states;
  } catch (error) {
    console.error('Error fetching states from API:', error);
    throw error;
  }
};

//* Get cities for a specific state and country
export const getCities = async (country: string, state: string): Promise<City> => {
  try {
    const response = await axios.post<LocationResponse<string[]>>(
      `${apiUrl}/countries/state/cities`,
      { country, state },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = response.data;

    if (data?.error) {
      throw new Error(data.msg);
    }

    return data?.data;
  } catch (error) {
    console.error('Error fetching cities from API, using fallback data:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });
    }

    throw error;
  }
};
