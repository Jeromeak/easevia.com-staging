//* User API Types for User Profile and Update Payload
export interface UserProfileUpdatePayload {
  name?: string;
  gender?: 'male' | 'female' | 'other' | string;
  date_of_birth?: string;
  nationality?: string;
  address?: string;
  billing_address?: string;
  pincode?: string | number;
  country?: string;
  state?: string;
  city?: string;
}

//* Error response interface
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

//* Interface for the User profile payload
export interface UserProfile {
  id?: number;
  email?: string;
  phone?: string;
  name?: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  address?: string;
  billing_address?: string;
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
  is_verified?: boolean;
  phone_verified?: boolean;
  auth_provider?: string;
  customer_id?: string;
  created_at?: string;
  updated_at?: string;
}
