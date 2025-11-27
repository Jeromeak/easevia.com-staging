'use client';

import React, { useState } from 'react';
import { AuthFlowContext } from './contexts/AuthFlowContext';

//* Interface for the user auth form type
interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  accessToken?: string;
  [key: string]: string | undefined;
}

//* Interface for login inputs (tracked separately for two-stage login)
interface LoginInputs {
  email: string;
  mobile: string;
}

export const AuthFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormDataState] = useState<AuthFormData>({
    name: '',
    email: '',
    phone: '',
  });

  const [loginInputs, setLoginInputsState] = useState<LoginInputs>({
    email: '',
    mobile: '',
  });

  const setFormData = (data: Partial<AuthFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormDataState({
      name: '',
      email: '',
      phone: '',
    });
  };

  const setLoginInputs = (data: Partial<LoginInputs>) => {
    setLoginInputsState((prev) => ({ ...prev, ...data }));
  };

  const resetLoginInputs = () => {
    setLoginInputsState({
      email: '',
      mobile: '',
    });
  };

  return (
    <AuthFlowContext.Provider
      value={{ formData, setFormData, resetForm, loginInputs, setLoginInputs, resetLoginInputs }}
    >
      {children}
    </AuthFlowContext.Provider>
  );
};
