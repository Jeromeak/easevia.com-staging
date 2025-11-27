import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from '@/app/landing-page/components/Form';
import { submitContactUs } from '@/lib/api/contact';
import { mockContactUsSuccessResponse } from './__mocks__/api';

// Mock the contact API
jest.mock('@/lib/api/contact', () => ({
  submitContactUs: jest.fn(),
}));

const mockSubmitContactUs = submitContactUs as jest.MockedFunction<typeof submitContactUs>;

describe('Contact Module Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full contact form flow', async () => {
    const user = userEvent.setup();
    mockSubmitContactUs.mockResolvedValueOnce(mockContactUsSuccessResponse);

    render(<Form />);

    // Verify form is rendered
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Message')).toBeInTheDocument();

    // Fill out the form
    await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Your Phone Number'), '+919876543210');
    await user.type(screen.getByPlaceholderText('Your Email Address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject');
    await user.type(screen.getByPlaceholderText('Your Message'), 'This is a test message');
    await user.click(screen.getByRole('checkbox'));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockSubmitContactUs).toHaveBeenCalledWith({
        name: 'John Doe',
        phone_number: '+919876543210',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
      });
    });

    // Verify success modal appears
    await waitFor(() => {
      expect(screen.getByText('Thank you!')).toBeInTheDocument();
    });
  });

  it('should handle validation errors in complete flow', async () => {
    const user = userEvent.setup();
    render(<Form />);

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Verify validation errors appear
    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Subject is required.')).toBeInTheDocument();
      expect(screen.getByText('You must agree before submitting.')).toBeInTheDocument();
    });

    // Verify API was not called
    expect(mockSubmitContactUs).not.toHaveBeenCalled();
  });

  it('should handle API errors in complete flow', async () => {
    const user = userEvent.setup();
    const apiError = new Error('Contact us entry with this email already exists.');
    mockSubmitContactUs.mockRejectedValueOnce(apiError);

    render(<Form />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Your Phone Number'), '+919876543210');
    await user.type(screen.getByPlaceholderText('Your Email Address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject');
    await user.type(screen.getByPlaceholderText('Your Message'), 'This is a test message');
    await user.click(screen.getByRole('checkbox'));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Verify API was called
    await waitFor(() => {
      expect(mockSubmitContactUs).toHaveBeenCalled();
    });

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText(/Contact us entry with this email already exists/i)).toBeInTheDocument();
    });

    // Verify success modal does not appear
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    mockSubmitContactUs.mockResolvedValueOnce(mockContactUsSuccessResponse);

    render(<Form />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Your Phone Number'), '+919876543210');
    await user.type(screen.getByPlaceholderText('Your Email Address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject');
    await user.type(screen.getByPlaceholderText('Your Message'), 'This is a test message');
    await user.click(screen.getByRole('checkbox'));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Wait for success modal
    await waitFor(() => {
      expect(screen.getByText('Thank you!')).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Verify form is reset
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your Name')).toHaveValue('');
      expect(screen.getByPlaceholderText('Your Phone Number')).toHaveValue('');
      expect(screen.getByPlaceholderText('Your Email Address')).toHaveValue('');
      expect(screen.getByPlaceholderText('Subject')).toHaveValue('');
      expect(screen.getByPlaceholderText('Your Message')).toHaveValue('');
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });
});
