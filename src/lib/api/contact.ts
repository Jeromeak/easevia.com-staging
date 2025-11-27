import api from './axios';
import { AxiosError } from 'axios';
import { getErrorMessage } from '@/lib/utils/error';

export interface ContactUsRequest {
  name: string;
  phone_number: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactUsResponse {
  message: string;
}

export interface ContactUsErrorResponse {
  error: string;
  details: string[];
}

/**
 * Submit contact us form data.
 */
export const submitContactUs = async (data: ContactUsRequest): Promise<ContactUsResponse> => {
  try {
    const response = await api.post<ContactUsResponse>('/inquiry/', data);

    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    console.error('Contact us submission failed:', errorMessage);

    // Log the full error for debugging
    if (error instanceof AxiosError) {
      console.error('Full error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Re-throw the error so the form can handle it
    throw new Error(errorMessage);
  }
};
