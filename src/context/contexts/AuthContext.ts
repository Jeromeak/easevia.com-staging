import { createContext } from 'react';

//* User response payload type
interface User {
  id: number;
  email: string;
  phone: string;
  name: string;
  is_verified: boolean;
  phone_verified?: boolean;
  auth_provider: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

//* Context function tpe and declaration
interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  accessToken: string | null;
}

//* Declare the authentication context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
