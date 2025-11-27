import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  PaymentStatusResponse,
  PaymentApiErrorResponse,
} from '../types/api/payment';
import api from './axios';
import type { AxiosError } from 'axios';

//* Create payment intent for subscription
//* package_id is passed as URL parameter, payment_method in request body
export const createPaymentIntent = async (
  packageId: string,
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  try {
    const response = await api.post<CreatePaymentIntentResponse>(`/payment/create/${packageId}/`, data);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<PaymentApiErrorResponse>;

    if (axiosError.response?.status === 400) {
      throw new Error(axiosError.response?.data?.message || 'Invalid payment request');
    }

    if (axiosError.response?.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    if (axiosError.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(axiosError.response?.data?.message || 'Failed to create payment intent');
  }
};

//* Confirm payment with payment method
export const confirmPayment = async (data: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> => {
  try {
    const response = await api.post<ConfirmPaymentResponse>('/payment/confirm/', data);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<PaymentApiErrorResponse>;

    if (axiosError.response?.status === 400) {
      throw new Error(axiosError.response?.data?.message || 'Invalid payment confirmation');
    }

    if (axiosError.response?.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    if (axiosError.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(axiosError.response?.data?.message || 'Failed to confirm payment');
  }
};

//* Get payment status
export const getPaymentStatus = async (paymentId: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await api.get<PaymentStatusResponse>(`/payment/${paymentId}/status/`);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<PaymentApiErrorResponse>;

    if (axiosError.response?.status === 404) {
      throw new Error('Payment not found');
    }

    if (axiosError.response?.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    if (axiosError.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(axiosError.response?.data?.message || 'Failed to get payment status');
  }
};

//* Cancel payment
export const cancelPayment = async (paymentId: string): Promise<{ message: string }> => {
  try {
    const response = await api.post<{ message: string }>(`/payment/${paymentId}/cancel/`);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<PaymentApiErrorResponse>;

    if (axiosError.response?.status === 400) {
      throw new Error(axiosError.response?.data?.message || 'Cannot cancel payment');
    }

    if (axiosError.response?.status === 404) {
      throw new Error('Payment not found');
    }

    if (axiosError.response?.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }

    if (axiosError.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(axiosError.response?.data?.message || 'Failed to cancel payment');
  }
};
