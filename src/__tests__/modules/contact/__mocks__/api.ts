import type { ContactUsRequest, ContactUsResponse, ContactUsErrorResponse } from '@/lib/api/contact';

// Mock successful response
export const mockContactUsSuccessResponse: ContactUsResponse = {
  message: 'Your inquiry has been submitted successfully. We will get back to you soon.',
};

// Mock error response
export const mockContactUsErrorResponse: ContactUsErrorResponse = {
  error: 'Contact us entry with this email already exists.',
  details: ['Email address is already registered'],
};

// Mock valid request data
export const mockValidContactRequest: ContactUsRequest = {
  name: 'John Doe',
  phone_number: '+919876543210',
  email: 'john.doe@example.com',
  subject: 'General Inquiry',
  message: 'I would like to know more about your services.',
};

// Mock invalid request data
export const mockInvalidContactRequest: ContactUsRequest = {
  name: '',
  phone_number: '123',
  email: 'invalid-email',
  subject: '',
  message: '',
};

// Mock network error
export const mockNetworkError = new Error('Network Error');

// Mock axios error response
export const mockAxiosError = {
  response: {
    status: 400,
    data: mockContactUsErrorResponse,
  },
  message: 'Request failed with status code 400',
  isAxiosError: true,
};
