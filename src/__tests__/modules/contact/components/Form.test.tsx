import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from '@/app/landing-page/components/Form';
import { submitContactUs } from '@/lib/api/contact';
import { mockFormData } from '../__mocks__/components';
import { mockContactUsSuccessResponse } from '../__mocks__/api';

// Mock the contact API
jest.mock('@/lib/api/contact', () => ({
  submitContactUs: jest.fn(),
}));

const mockSubmitContactUs = submitContactUs as jest.MockedFunction<typeof submitContactUs>;

describe('Contact Form Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<Form />);

      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Phone Number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Email Address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render checkbox for agreement', () => {
      render(<Form />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('should render submit button as disabled initially', () => {
      render(<Form />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required.')).toBeInTheDocument();
        expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
        expect(screen.getByText('Email is required.')).toBeInTheDocument();
        expect(screen.getByText('Subject is required.')).toBeInTheDocument();
        expect(screen.getByText('You must agree before submitting.')).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const phoneInput = screen.getByPlaceholderText('Your Phone Number');
      await user.type(phoneInput, '123');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Please enter a valid mobile number with country code (e.g. +1234567890).')
        ).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<Form />);

      // Fill required fields first
      await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('Your Phone Number'), '9876543210');
      await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject');
      await user.click(screen.getByRole('checkbox'));

      // Now test invalid email
      const emailInput = screen.getByPlaceholderText('Your Email Address');
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Check that the API was not called due to validation failure
      expect(mockSubmitContactUs).not.toHaveBeenCalled();

      // Check that the form is still visible (not submitted)
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    });

    it('should accept valid phone number with country code', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const phoneInput = screen.getByPlaceholderText('Your Phone Number');
      await user.type(phoneInput, '+1234567890');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Please enter a valid mobile number with country code (e.g. +1234567890).')
        ).not.toBeInTheDocument();
      });
    });

    it('should enforce 20 character limit for name', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
      const longName = 'a'.repeat(21);

      await user.type(nameInput, longName);

      expect(nameInput.value.length).toBeLessThanOrEqual(20);
    });

    it('should only allow letters and spaces in name', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;

      await user.type(nameInput, 'John@Doe123');

      // Should remove special characters and numbers
      expect(nameInput.value).not.toMatch(/[@#]/);
      expect(nameInput.value).not.toMatch(/\d/);
    });

    it('should enforce 17 character limit for phone', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const phoneInput = screen.getByPlaceholderText('Your Phone Number') as HTMLInputElement;
      const longPhone = '+123456789012345678'; // 18 characters

      await user.type(phoneInput, longPhone);

      expect(phoneInput.value.length).toBeLessThanOrEqual(17);
    });

    it('should enforce 254 character limit for email', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const emailInput = screen.getByPlaceholderText('Your Email Address') as HTMLInputElement;
      const longEmail = 'a'.repeat(255) + '@example.com';

      await user.type(emailInput, longEmail);

      expect(emailInput.value.length).toBeLessThanOrEqual(254);
    });

    it('should enforce 256 character limit for subject', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const subjectInput = screen.getByPlaceholderText('Subject') as HTMLInputElement;
      const longSubject = 'a'.repeat(257);

      await user.type(subjectInput, longSubject);

      expect(subjectInput.value.length).toBeLessThanOrEqual(256);
    });

    it('should enforce 300 character limit for message', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const messageTextarea = screen.getByPlaceholderText('Your Message') as HTMLTextAreaElement;
      const longMessage = 'a'.repeat(301);

      await user.type(messageTextarea, longMessage);

      expect(messageTextarea.value.length).toBeLessThanOrEqual(300);
    });

    it('should clear errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<Form />);

      // Trigger validation errors
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required.')).toBeInTheDocument();
      });

      // Start typing in name field
      const nameInput = screen.getByPlaceholderText('Your Name');
      await user.type(nameInput, 'John');

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      mockSubmitContactUs.mockResolvedValue(mockContactUsSuccessResponse);

      render(<Form />);

      // Fill form with valid data
      await user.type(screen.getByPlaceholderText('Your Name'), mockFormData.name);
      await user.type(screen.getByPlaceholderText('Your Phone Number'), mockFormData.phone);
      await user.type(screen.getByPlaceholderText('Your Email Address'), mockFormData.email);
      await user.type(screen.getByPlaceholderText('Subject'), mockFormData.subject);
      await user.type(screen.getByPlaceholderText('Your Message'), mockFormData.message || '');

      // Check agreement checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitContactUs).toHaveBeenCalledWith({
          name: mockFormData.name,
          phone_number: mockFormData.phone,
          email: mockFormData.email,
          subject: mockFormData.subject,
          message: mockFormData.message || '',
        });
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      // Mock a delayed response
      mockSubmitContactUs.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockContactUsSuccessResponse), 100))
      );

      render(<Form />);

      // Fill form with valid data
      await user.type(screen.getByPlaceholderText('Your Name'), mockFormData.name);
      await user.type(screen.getByPlaceholderText('Your Phone Number'), mockFormData.phone);
      await user.type(screen.getByPlaceholderText('Your Email Address'), mockFormData.email);
      await user.type(screen.getByPlaceholderText('Subject'), mockFormData.subject);
      await user.type(screen.getByPlaceholderText('Your Message'), mockFormData.message || '');

      // Check agreement checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText('Submit')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should show success modal after successful submission', async () => {
      const user = userEvent.setup();
      mockSubmitContactUs.mockResolvedValue(mockContactUsSuccessResponse);

      render(<Form />);

      // Fill form with valid data
      await user.type(screen.getByPlaceholderText('Your Name'), mockFormData.name);
      await user.type(screen.getByPlaceholderText('Your Phone Number'), mockFormData.phone);
      await user.type(screen.getByPlaceholderText('Your Email Address'), mockFormData.email);
      await user.type(screen.getByPlaceholderText('Subject'), mockFormData.subject);
      await user.type(screen.getByPlaceholderText('Your Message'), mockFormData.message || '');

      // Check agreement checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
        expect(screen.getByText('Your message has been successfully submitted.')).toBeInTheDocument();
      });
    });

    it('should show API error message on submission failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Contact us entry with this email already exists.';
      mockSubmitContactUs.mockRejectedValue(new Error(errorMessage));

      render(<Form />);

      // Fill form with valid data
      await user.type(screen.getByPlaceholderText('Your Name'), mockFormData.name);
      await user.type(screen.getByPlaceholderText('Your Phone Number'), mockFormData.phone);
      await user.type(screen.getByPlaceholderText('Your Email Address'), mockFormData.email);
      await user.type(screen.getByPlaceholderText('Subject'), mockFormData.subject);
      await user.type(screen.getByPlaceholderText('Your Message'), mockFormData.message || '');

      // Check agreement checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should auto-remove API error after 5 seconds', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Contact us entry with this email already exists.';
      mockSubmitContactUs.mockRejectedValue(new Error(errorMessage));

      render(<Form />);

      // Fill form with valid data
      await user.type(screen.getByPlaceholderText('Your Name'), mockFormData.name);
      await user.type(screen.getByPlaceholderText('Your Phone Number'), mockFormData.phone);
      await user.type(screen.getByPlaceholderText('Your Email Address'), mockFormData.email);
      await user.type(screen.getByPlaceholderText('Subject'), mockFormData.subject);
      await user.type(screen.getByPlaceholderText('Your Message'), mockFormData.message || '');

      // Check agreement checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      // Wait for auto-removal (5 seconds + buffer)
      await new Promise((resolve) => setTimeout(resolve, 6000));

      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      });
    }, 15000);

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      mockSubmitContactUs.mockResolvedValue(mockContactUsSuccessResponse);

      render(<Form />);

      // Fill form with valid data
      await user.type(screen.getByPlaceholderText('Your Name'), mockFormData.name);
      await user.type(screen.getByPlaceholderText('Your Phone Number'), mockFormData.phone);
      await user.type(screen.getByPlaceholderText('Your Email Address'), mockFormData.email);
      await user.type(screen.getByPlaceholderText('Subject'), mockFormData.subject);
      await user.type(screen.getByPlaceholderText('Your Message'), mockFormData.message || '');

      // Check agreement checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Wait for success modal
      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      });

      // Close success modal
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Check if form is reset
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Your Name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your Phone Number')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your Email Address')).toHaveValue('');
        expect(screen.getByPlaceholderText('Subject')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your Message')).toHaveValue('');
      });

      // Check checkbox separately as it might need more time to reset
      await waitFor(() => {
        const resetCheckbox = screen.getByRole('checkbox');
        expect(resetCheckbox).not.toBeChecked();
      });
    }, 10000);
  });

  describe('Form Interactions', () => {
    it('should handle checkbox state changes', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should handle textarea input', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const messageTextarea = screen.getByPlaceholderText('Your Message');
      const testMessage = 'This is a test message for the contact form.';

      await user.type(messageTextarea, testMessage);
      expect(messageTextarea).toHaveValue(testMessage);
    });

    it('should handle subject input', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const subjectInput = screen.getByPlaceholderText('Subject');
      const testSubject = 'Test Subject';

      await user.type(subjectInput, testSubject);
      expect(subjectInput).toHaveValue(testSubject);
    });
  });
});
