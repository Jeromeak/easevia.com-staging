import { AxiosError } from 'axios';

/**
 * Extracts a meaningful error message from an Axios error or unknown error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error?.response?.data?.detail ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}
