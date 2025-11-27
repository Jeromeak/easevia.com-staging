import type { FormData, FormErrors } from '@/lib/types/common.types';

// Mock form data
export const mockFormData: FormData = {
  name: 'John Doe',
  phone: '+919876543210',
  email: 'john.doe@example.com',
  subject: 'General Inquiry',
  message: 'I would like to know more about your services.',
  agree: true,
};

// Mock empty form data
export const mockEmptyFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
  agree: false,
};

// Mock form errors
export const mockFormErrors: FormErrors = {
  name: 'Name is required.',
  phone: 'Phone number is required.',
  email: 'Email is required.',
  subject: 'Subject is required.',
  agree: 'You must agree before submitting.',
};

// Mock partial form errors
export const mockPartialFormErrors: FormErrors = {
  email: 'Invalid email format.',
  phone: 'Phone must be 10 digits or +91 followed by 10 digits.',
};

// Mock form component props
export const mockFormProps = {
  onSubmit: jest.fn(),
  onReset: jest.fn(),
  loading: false,
  error: '',
};

// Mock form component with loading state
export const mockFormPropsLoading = {
  ...mockFormProps,
  loading: true,
};

// Mock form component with error state
export const mockFormPropsError = {
  ...mockFormProps,
  error: 'Contact us entry with this email already exists.',
};

// Mock success modal props
export const mockSuccessModalProps = {
  isOpen: true,
  onClose: jest.fn(),
  title: 'Success!',
  message: 'Your inquiry has been submitted successfully.',
};
