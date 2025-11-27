import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifyEmailModal } from '@/app/authentication/verify-email-modal/verify-email-modal';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import { useAuth } from '@/context/hooks/useAuth';

// Mock dependencies
jest.mock('@/context/hooks/useAuthFlow', () => ({
  useAuthFlow: jest.fn(),
}));

jest.mock('@/context/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api/auth', () => ({
  verifySignupOtp: jest.fn(),
  sendPhoneOtp: jest.fn(),
  sendSignupOtp: jest.fn(),
}));

jest.mock('@/lib/api/user', () => ({
  fetchUserInfo: jest.fn(),
}));

jest.mock('@/utils/tokenStorage', () => ({
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

jest.mock('@/app/authentication/components/Modal', () => ({
  Modal: ({ isOpen, children, onClose }: { isOpen: boolean; children: React.ReactNode; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="modal">
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

jest.mock('@/app/authentication/components/Button', () => ({
  Button: ({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled} data-testid="verify-button">
      {label}
    </button>
  ),
}));

describe('VerifyEmailModal - Paste Functionality', () => {
  const mockSetUser = jest.fn();
  const mockOpenVerifyMobile = jest.fn();
  const mockOpenSignInAccount = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isVerifyEmailModalOpen: true,
    onCloseVerifyEmailModal: mockOnClose,
    openSignInAccount: mockOpenSignInAccount,
    openVerifyMobile: mockOpenVerifyMobile,
    isVerifyMobileModalOpen: false,
    onCloseVerifyMobileModal: jest.fn(),
    openSignInAccoount: jest.fn(),
    openSuccessModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthFlow as jest.Mock).mockReturnValue({
      formData: { email: 'test@example.com' },
    });
    (useAuth as jest.Mock).mockReturnValue({
      setUser: mockSetUser,
    });
  });

  it('should paste OTP code into input fields', async () => {
    const user = userEvent.setup();
    render(<VerifyEmailModal {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    // Focus the input first
    await user.click(firstInput);

    // Use userEvent.paste which properly simulates the paste event
    await user.paste('123456');

    await waitFor(() => {
      expect(inputs[0]).toHaveValue('1');
      expect(inputs[1]).toHaveValue('2');
      expect(inputs[2]).toHaveValue('3');
      expect(inputs[3]).toHaveValue('4');
      expect(inputs[4]).toHaveValue('5');
      expect(inputs[5]).toHaveValue('6');
    });
  });

  it('should filter out non-numeric characters when pasting', async () => {
    const user = userEvent.setup();
    render(<VerifyEmailModal {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await user.click(firstInput);
    await user.paste('12a3b4c5d6');

    await waitFor(() => {
      expect(inputs[0]).toHaveValue('1');
      expect(inputs[1]).toHaveValue('2');
      expect(inputs[2]).toHaveValue('3');
      expect(inputs[3]).toHaveValue('4');
      expect(inputs[4]).toHaveValue('5');
      expect(inputs[5]).toHaveValue('6');
    });
  });

  it('should limit pasted OTP to 6 digits', async () => {
    const user = userEvent.setup();
    render(<VerifyEmailModal {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await user.click(firstInput);
    await user.paste('1234567890');

    await waitFor(() => {
      expect(inputs[0]).toHaveValue('1');
      expect(inputs[1]).toHaveValue('2');
      expect(inputs[2]).toHaveValue('3');
      expect(inputs[3]).toHaveValue('4');
      expect(inputs[4]).toHaveValue('5');
      expect(inputs[5]).toHaveValue('6');
    });
  });

  it('should paste OTP starting from any input field', async () => {
    const user = userEvent.setup();
    render(<VerifyEmailModal {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    const thirdInput = inputs[2];

    await user.click(thirdInput);
    await user.paste('123');

    await waitFor(() => {
      expect(inputs[0]).toHaveValue('');
      expect(inputs[1]).toHaveValue('');
      expect(inputs[2]).toHaveValue('1');
      expect(inputs[3]).toHaveValue('2');
      expect(inputs[4]).toHaveValue('3');
      expect(inputs[5]).toHaveValue('');
    });
  });
});
