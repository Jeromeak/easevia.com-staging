import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginModal } from '@/app/authentication/login-modal/login-modal';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useAuthFlow } from '@/context/hooks/useAuthFlow';
import { sendLoginOtp } from '@/lib/api/auth';

// Mock dependencies
jest.mock('@/hooks/useAuthModal', () => ({
  useAuthModal: jest.fn(),
  AuthModalType: {
    LOGIN: 'login',
  },
}));

jest.mock('@/context/hooks/useAuthFlow', () => ({
  useAuthFlow: jest.fn(),
}));

jest.mock('@/lib/api/auth', () => ({
  sendLoginOtp: jest.fn(),
}));

jest.mock('@/utils/socialLogin', () => ({
  redirectToSocialLogin: jest.fn(),
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
    <button onClick={onClick} disabled={disabled} data-testid="send-otp-button">
      {label}
    </button>
  ),
}));

jest.mock('@/app/authentication/components/Input', () => ({
  InputBox: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => <input value={value} onChange={onChange} placeholder={placeholder} data-testid="input-box" />,
}));

jest.mock('@/app/authentication/components/Tab', () => ({
  Tab: ({ onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => (
    <div data-testid="tab">
      <button onClick={() => onTabChange('email')} data-testid="email-tab">
        Email
      </button>
      <button onClick={() => onTabChange('mobile')} data-testid="mobile-tab">
        Mobile
      </button>
    </div>
  ),
  TabType: {
    EMAIL: 'email',
    MOBILE: 'mobile',
  },
}));

describe('LoginModal - Input Tracking', () => {
  const mockOpenModal = jest.fn();
  const mockSetLoginInputs = jest.fn();
  const mockOnOpenOtpModal = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnOpenCreateAccount = jest.fn();
  const mockOpenGoogleVerifyModal = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onOpenCreateAccount: mockOnOpenCreateAccount,
    onOpenOtpModal: mockOnOpenOtpModal,
    openGoogleVerfiyModal: mockOpenGoogleVerifyModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthModal as jest.Mock).mockReturnValue({
      openModal: mockOpenModal,
    });
    (useAuthFlow as jest.Mock).mockReturnValue({
      loginInputs: { email: '', mobile: '' },
      setLoginInputs: mockSetLoginInputs,
    });
    (sendLoginOtp as jest.Mock).mockResolvedValue({});
  });

  it('should restore email value when modal opens', () => {
    (useAuthFlow as jest.Mock).mockReturnValue({
      loginInputs: { email: 'test@example.com', mobile: '' },
      setLoginInputs: mockSetLoginInputs,
    });

    render(<LoginModal {...defaultProps} />);
    const input = screen.getByTestId('input-box');

    expect(input).toHaveValue('test@example.com');
  });

  it('should restore mobile value when switching to mobile tab', () => {
    (useAuthFlow as jest.Mock).mockReturnValue({
      loginInputs: { email: '', mobile: '+1234567890' },
      setLoginInputs: mockSetLoginInputs,
    });

    render(<LoginModal {...defaultProps} />);
    const mobileTab = screen.getByTestId('mobile-tab');
    fireEvent.click(mobileTab);

    const input = screen.getByTestId('input-box');
    expect(input).toHaveValue('+1234567890');
  });

  it('should save email input to context as user types', async () => {
    render(<LoginModal {...defaultProps} />);
    const input = screen.getByTestId('input-box');

    fireEvent.change(input, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(mockSetLoginInputs).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  it('should save mobile input to context as user types', async () => {
    render(<LoginModal {...defaultProps} />);
    const mobileTab = screen.getByTestId('mobile-tab');
    fireEvent.click(mobileTab);

    const input = screen.getByTestId('input-box');
    fireEvent.change(input, { target: { value: '+1234567890' } });

    await waitFor(() => {
      expect(mockSetLoginInputs).toHaveBeenCalledWith({ mobile: '+1234567890' });
    });
  });

  it('should clear opposite field when OTP is sent successfully (email)', async () => {
    render(<LoginModal {...defaultProps} />);
    const input = screen.getByTestId('input-box');
    const sendButton = screen.getByTestId('send-otp-button');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSetLoginInputs).toHaveBeenCalledWith({ email: 'test@example.com', mobile: '' });
    });
  });

  it('should clear opposite field when OTP is sent successfully (mobile)', async () => {
    render(<LoginModal {...defaultProps} />);
    const mobileTab = screen.getByTestId('mobile-tab');
    fireEvent.click(mobileTab);

    const input = screen.getByTestId('input-box');
    const sendButton = screen.getByTestId('send-otp-button');

    fireEvent.change(input, { target: { value: '+1234567890' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSetLoginInputs).toHaveBeenCalledWith({ email: '', mobile: '+1234567890' });
    });
  });

  it('should clear login inputs on critical errors', async () => {
    (sendLoginOtp as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

    render(<LoginModal {...defaultProps} />);
    const input = screen.getByTestId('input-box');
    const sendButton = screen.getByTestId('send-otp-button');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSetLoginInputs).toHaveBeenCalledWith({ email: '' });
    });
  });
});

describe('LoginModal - Validation', () => {
  const mockOpenModal = jest.fn();
  const mockSetLoginInputs = jest.fn();
  const mockOnOpenOtpModal = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnOpenCreateAccount = jest.fn();
  const mockOpenGoogleVerifyModal = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onOpenCreateAccount: mockOnOpenCreateAccount,
    onOpenOtpModal: mockOnOpenOtpModal,
    openGoogleVerfiyModal: mockOpenGoogleVerifyModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthModal as jest.Mock).mockReturnValue({
      openModal: mockOpenModal,
    });
    (useAuthFlow as jest.Mock).mockReturnValue({
      loginInputs: { email: '', mobile: '' },
      setLoginInputs: mockSetLoginInputs,
    });
    (sendLoginOtp as jest.Mock).mockResolvedValue({});
  });

  describe('Email Validation', () => {
    it('should enforce 254 character limit for email', () => {
      render(<LoginModal {...defaultProps} />);
      const input = screen.getByTestId('input-box') as HTMLInputElement;
      const longEmail = 'a'.repeat(255) + '@example.com';

      fireEvent.change(input, { target: { value: longEmail } });

      expect(input.value.length).toBeLessThanOrEqual(254);
    });

    it('should validate email format on submit', async () => {
      render(<LoginModal {...defaultProps} />);
      const input = screen.getByTestId('input-box');
      const sendButton = screen.getByTestId('send-otp-button');

      fireEvent.change(input, { target: { value: 'invalid-email' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(sendLoginOtp).not.toHaveBeenCalled();
      });
    });

    it('should accept valid email format', async () => {
      render(<LoginModal {...defaultProps} />);
      const input = screen.getByTestId('input-box');
      const sendButton = screen.getByTestId('send-otp-button');

      fireEvent.change(input, { target: { value: 'test@example.com' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(sendLoginOtp).toHaveBeenCalled();
      });
    });
  });

  describe('Mobile Validation', () => {
    it('should enforce 17 character limit for mobile', () => {
      render(<LoginModal {...defaultProps} />);
      const mobileTab = screen.getByTestId('mobile-tab');
      fireEvent.click(mobileTab);

      const input = screen.getByTestId('input-box') as HTMLInputElement;
      const longMobile = '+123456789012345678'; // 18 characters

      fireEvent.change(input, { target: { value: longMobile } });

      expect(input.value.length).toBeLessThanOrEqual(17);
    });

    it('should only allow numbers and one leading + for mobile', () => {
      render(<LoginModal {...defaultProps} />);
      const mobileTab = screen.getByTestId('mobile-tab');
      fireEvent.click(mobileTab);

      const input = screen.getByTestId('input-box') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '+123abc456' } });
      // Should remove letters, keep only numbers and +
      expect(input.value).not.toMatch(/[a-zA-Z]/);
    });

    it('should validate mobile format on submit', async () => {
      render(<LoginModal {...defaultProps} />);
      const mobileTab = screen.getByTestId('mobile-tab');
      fireEvent.click(mobileTab);

      const input = screen.getByTestId('input-box');
      const sendButton = screen.getByTestId('send-otp-button');

      fireEvent.change(input, { target: { value: '123456789' } }); // Invalid format
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(sendLoginOtp).not.toHaveBeenCalled();
      });
    });

    it('should accept valid mobile format with country code', async () => {
      render(<LoginModal {...defaultProps} />);
      const mobileTab = screen.getByTestId('mobile-tab');
      fireEvent.click(mobileTab);

      const input = screen.getByTestId('input-box');
      const sendButton = screen.getByTestId('send-otp-button');

      fireEvent.change(input, { target: { value: '+1234567890' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(sendLoginOtp).toHaveBeenCalled();
      });
    });
  });
});
