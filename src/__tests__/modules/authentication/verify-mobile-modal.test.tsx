import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifyMobileModal } from '@/app/authentication/verify-mobile-modal/verify-mobile-modal';
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
  verifyPhoneOtp: jest.fn(),
  sendPhoneOtp: jest.fn(),
}));

jest.mock('@/lib/api/user', () => ({
  fetchUserInfo: jest.fn(),
}));

jest.mock('@/utils/tokenStorage', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

jest.mock('@/context/hooks/useLanguageCurrency', () => ({
  useLanguageCurrency: jest.fn(() => ({
    triggerCurrencyFetch: jest.fn(),
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
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

describe('VerifyMobileModal - Paste Functionality', () => {
  const mockSetUser = jest.fn();
  const mockOpenSuccessModal = jest.fn();
  const mockOpenSignInAccount = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isVerifyMobileModalOpen: true,
    onCloseVerifyMobileModal: mockOnClose,
    openSignInAccoount: mockOpenSignInAccount,
    openSuccessModal: mockOpenSuccessModal,
    isVerifyEmailModalOpen: false,
    onCloseVerifyEmailModal: jest.fn(),
    openSignInAccount: jest.fn(),
    openVerifyMobile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthFlow as jest.Mock).mockReturnValue({
      formData: { phone: '+1234567890' },
    });
    (useAuth as jest.Mock).mockReturnValue({
      setUser: mockSetUser,
    });
  });

  it('should paste OTP code into input fields', async () => {
    const user = userEvent.setup();
    render(<VerifyMobileModal {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await user.click(firstInput);
    await user.paste('654321');

    await waitFor(() => {
      expect(inputs[0]).toHaveValue('6');
      expect(inputs[1]).toHaveValue('5');
      expect(inputs[2]).toHaveValue('4');
      expect(inputs[3]).toHaveValue('3');
      expect(inputs[4]).toHaveValue('2');
      expect(inputs[5]).toHaveValue('1');
    });
  });

  it('should filter out non-numeric characters when pasting', async () => {
    const user = userEvent.setup();
    render(<VerifyMobileModal {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await user.click(firstInput);
    await user.paste('abc123def456');

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
    render(<VerifyMobileModal {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await user.click(firstInput);
    await user.paste('9876543210');

    await waitFor(() => {
      expect(inputs[0]).toHaveValue('9');
      expect(inputs[1]).toHaveValue('8');
      expect(inputs[2]).toHaveValue('7');
      expect(inputs[3]).toHaveValue('6');
      expect(inputs[4]).toHaveValue('5');
      expect(inputs[5]).toHaveValue('4');
    });
  });
});
