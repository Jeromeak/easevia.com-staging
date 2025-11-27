import { createContext } from 'react';

//* Interface for the user auth form type
interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  accessToken?: string;
  [key: string]: string | undefined; // Only allow string or undefined for future fields
}

//* Interface for login inputs (tracked separately for two-stage login)
interface LoginInputs {
  email: string;
  mobile: string;
}

//* Interface for the authentication context function type
interface AuthFlowContextType {
  formData: AuthFormData;
  setFormData: (data: Partial<AuthFormData>) => void;
  resetForm: () => void;
  loginInputs: LoginInputs;
  setLoginInputs: (data: Partial<LoginInputs>) => void;
  resetLoginInputs: () => void;
}

export const AuthFlowContext = createContext<AuthFlowContextType | undefined>(undefined);
