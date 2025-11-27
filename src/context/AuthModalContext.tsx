'use client';
import type { ReactNode } from 'react';
import React, { useState, useCallback } from 'react';
import type { AuthModalType, AuthModalData } from '@/hooks/useAuthModal';
import { AuthModalContext } from '@/hooks/useAuthModal';

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<AuthModalType | null>(null);
  const [modalData, setModalData] = useState<AuthModalData | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = useCallback((type: AuthModalType, data?: AuthModalData) => {
    setCurrentModal(type);
    setModalData(data || null);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentModal(null);
      setModalData(null);
    }, 300);
    document.body.style.overflow = 'unset';
  }, []);

  const switchModal = useCallback((type: AuthModalType, data?: AuthModalData) => {
    setCurrentModal(type);
    setModalData(data || null);
  }, []);

  const value = {
    currentModal,
    modalData,
    isOpen,
    openModal,
    closeModal,
    switchModal,
  };

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
};
