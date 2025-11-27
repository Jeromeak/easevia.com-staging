import { createPaymentIntent, getPaymentStatus, confirmPayment, cancelPayment } from '@/lib/api/payment';
import api from '@/lib/api/axios';
import {
  mockCreatePaymentIntentResponse,
  mockPaymentStatusResponse,
  mockConfirmPaymentResponse,
  mockPaymentApiError,
  mockPaymentApiUnauthorizedError,
  mockPaymentApiServerError,
} from '../__mocks__/checkoutApi';
import type { AxiosError } from 'axios';

// Mock axios
jest.mock('@/lib/api/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Payment API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent successfully for card', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: mockCreatePaymentIntentResponse,
      });

      const result = await createPaymentIntent('rgRqJ5Y0V4', {
        payment_method: 'card',
      });

      expect(mockApi.post).toHaveBeenCalledWith('/payment/create/rgRqJ5Y0V4/', {
        payment_method: 'card',
      });
      expect(result).toEqual(mockCreatePaymentIntentResponse);
      expect(result.client_secret).toBe('pi_test_1234567890_secret_abcdefghijklmnopqrstuvwxyz');
      expect(result.payment_intent_id).toBe('pi_test_1234567890');
      expect(result.status).toBe('success');
    });

    it('should create payment intent successfully for bank transfer', async () => {
      const bankResponse = {
        ...mockCreatePaymentIntentResponse,
        client_secret: 'pi_test_bank_1234567890_secret_abcdefghijklmnopqrstuvwxyz',
      };

      mockApi.post.mockResolvedValueOnce({
        data: bankResponse,
      });

      const result = await createPaymentIntent('rgRqJ5Y0V4', {
        payment_method: 'bank_transfer',
      });

      expect(mockApi.post).toHaveBeenCalledWith('/payment/create/rgRqJ5Y0V4/', {
        payment_method: 'bank_transfer',
      });
      expect(result).toEqual(bankResponse);
    });

    it('should handle 400 error', async () => {
      mockApi.post.mockRejectedValueOnce(mockPaymentApiError);

      await expect(
        createPaymentIntent('rgRqJ5Y0V4', {
          payment_method: 'card',
        })
      ).rejects.toThrow('Invalid payment request');
    });

    it('should handle 401 unauthorized error', async () => {
      mockApi.post.mockRejectedValueOnce(mockPaymentApiUnauthorizedError);

      await expect(
        createPaymentIntent('rgRqJ5Y0V4', {
          payment_method: 'card',
        })
      ).rejects.toThrow('Unauthorized. Please login again.');
    });

    it('should handle 500 server error', async () => {
      mockApi.post.mockRejectedValueOnce(mockPaymentApiServerError);

      await expect(
        createPaymentIntent('rgRqJ5Y0V4', {
          payment_method: 'card',
        })
      ).rejects.toThrow('Server error. Please try again later.');
    });

    it('should handle generic error', async () => {
      const genericError = {
        response: {
          status: 403,
          data: {
            message: 'Forbidden',
          },
        },
        message: 'Request failed',
        isAxiosError: true,
      } as AxiosError;

      mockApi.post.mockRejectedValueOnce(genericError);

      // The error message comes from response.data.message if available
      await expect(
        createPaymentIntent('rgRqJ5Y0V4', {
          payment_method: 'card',
        })
      ).rejects.toThrow('Forbidden');
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      mockApi.get.mockResolvedValueOnce({
        data: mockPaymentStatusResponse,
      });

      const result = await getPaymentStatus('pay_test_1234567890');

      expect(mockApi.get).toHaveBeenCalledWith('/payment/pay_test_1234567890/status/');
      expect(result).toEqual(mockPaymentStatusResponse);
      expect(result.status).toBe('completed');
    });

    it('should handle 404 error', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: {
            message: 'Payment not found',
          },
        },
        message: 'Request failed',
        isAxiosError: true,
      } as AxiosError;

      mockApi.get.mockRejectedValueOnce(notFoundError);

      await expect(getPaymentStatus('invalid_id')).rejects.toThrow('Payment not found');
    });

    it('should handle 401 unauthorized error', async () => {
      mockApi.get.mockRejectedValueOnce(mockPaymentApiUnauthorizedError);

      await expect(getPaymentStatus('pay_test_1234567890')).rejects.toThrow('Unauthorized. Please login again.');
    });

    it('should handle 500 server error', async () => {
      mockApi.get.mockRejectedValueOnce(mockPaymentApiServerError);

      await expect(getPaymentStatus('pay_test_1234567890')).rejects.toThrow('Server error. Please try again later.');
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment successfully', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: mockConfirmPaymentResponse,
      });

      const result = await confirmPayment({
        payment_intent_id: 'pi_test_1234567890',
        payment_method_id: 'pm_test_1234567890',
      });

      expect(mockApi.post).toHaveBeenCalledWith('/payment/confirm/', {
        payment_intent_id: 'pi_test_1234567890',
        payment_method_id: 'pm_test_1234567890',
      });
      expect(result).toEqual(mockConfirmPaymentResponse);
      expect(result.status).toBe('success');
    });

    it('should handle 400 error', async () => {
      mockApi.post.mockRejectedValueOnce(mockPaymentApiError);

      // The error message comes from response.data.message if available
      await expect(
        confirmPayment({
          payment_intent_id: 'pi_test_1234567890',
          payment_method_id: 'pm_test_1234567890',
        })
      ).rejects.toThrow('Invalid payment request');
    });

    it('should handle 401 unauthorized error', async () => {
      mockApi.post.mockRejectedValueOnce(mockPaymentApiUnauthorizedError);

      await expect(
        confirmPayment({
          payment_intent_id: 'pi_test_1234567890',
          payment_method_id: 'pm_test_1234567890',
        })
      ).rejects.toThrow('Unauthorized. Please login again.');
    });
  });

  describe('cancelPayment', () => {
    it('should cancel payment successfully', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { message: 'Payment cancelled successfully' },
      });

      const result = await cancelPayment('pay_test_1234567890');

      expect(mockApi.post).toHaveBeenCalledWith('/payment/pay_test_1234567890/cancel/');
      expect(result.message).toBe('Payment cancelled successfully');
    });

    it('should handle 400 error', async () => {
      mockApi.post.mockRejectedValueOnce(mockPaymentApiError);

      // The error message comes from response.data.message if available
      await expect(cancelPayment('pay_test_1234567890')).rejects.toThrow('Invalid payment request');
    });

    it('should handle 404 error', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: {
            message: 'Payment not found',
          },
        },
        message: 'Request failed',
        isAxiosError: true,
      } as AxiosError;

      mockApi.post.mockRejectedValueOnce(notFoundError);

      await expect(cancelPayment('invalid_id')).rejects.toThrow('Payment not found');
    });

    it('should handle 401 unauthorized error', async () => {
      mockApi.post.mockRejectedValueOnce(mockPaymentApiUnauthorizedError);

      await expect(cancelPayment('pay_test_1234567890')).rejects.toThrow('Unauthorized. Please login again.');
    });
  });
});
