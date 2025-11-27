//* Passenger entity interface
export interface Passenger {
  id: string;
  name: string;
  nationality: string;
  gender: string;
  date_of_birth: string;
  relationship_with_user: string;
  mobile_number: string;
  email: string | null;
  passport_given_name: string;
  passport_surname: string;
  passport_number: string;
  passport_expiry: string;
  passport_issuing_country: string;
  user: number;
  user_name?: string;
  created_at?: string;
}

//* Request interface for creating a passenger
export interface PassengerCreateRequest {
  name: string;
  nationality: string;
  gender: string;
  date_of_birth: string;
  relationship_with_user: string;
  mobile_number: string;
  email?: string | null;
  passport_given_name: string;
  passport_surname: string;
  passport_number: string;
  passport_expiry: string;
  passport_issuing_country: string;
}

//* Request interface for updating a passenger
export interface PassengerUpdateRequest {
  name?: string;
  nationality?: string;
  gender?: string;
  date_of_birth?: string;
  relationship_with_user?: string;
  mobile_number?: string;
  email?: string | null;
  passport_given_name: string;
  passport_surname: string;
  passport_number: string;
  passport_expiry: string;
  passport_issuing_country: string;
}

//* Common API error response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
  details?: string[];
}
