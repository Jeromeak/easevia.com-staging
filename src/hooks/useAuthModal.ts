'use client';
import { createContext, useContext } from 'react';

export enum AuthModalType {
  LOGIN = 'login',
  CREATE_ACCOUNT = 'create-account',
  OTP = 'otp',
  VERIFY_EMAIL = 'verify-email',
  VERIFY_MOBILE = 'verify-mobile',
  RESET_PASSWORD = 'reset-password',
  RESET_SUCCESS = 'reset-success',
  SUCCESS = 'success',
  GOOGLE_VERIFY = 'google-verify',
  CONTACT_SUPPORT = 'contact-support',
  CHATBOX = 'chatbox',
}

export enum TabType {
  Email = 'email',
  Mobile = 'mobile',
}

export interface AuthModalData {
  input?: string;
  tab?: TabType;
  email?: string;
  mobile?: string;
  message?: string;
  title?: string;
  subTitle?: string;
  redirectPath?: string;
}

export interface AuthModalContextType {
  currentModal: AuthModalType | null;
  modalData: AuthModalData | null;
  isOpen: boolean;
  openModal: (type: AuthModalType, data?: AuthModalData) => void;
  closeModal: () => void;
  switchModal: (type: AuthModalType, data?: AuthModalData) => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }

  return context;
};
