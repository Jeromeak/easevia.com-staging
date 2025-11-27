//* Subscription interface
export interface Subscription {
  id: number;
  subscription_number: string | null;
  date_change_count: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  user: string;
  package: string;
  price: number;
  trip_count: number;
  travelled_trip_count: number;
  member_count: number;
  travelled_member_count: number;
  allowed_date_change_count: number;
  used_date_change_count: number;
  expired: boolean;
  passengers: Array<SubscriptionPassenger>;
  package_od?: PackageODRoute[];
  allowed_route_count?: number;
}

//* Passenger interface for subscription
export interface SubscriptionPassenger {
  id: string;
  name: string;
  nationality?: string;
  gender?: string;
  date_of_birth?: string;
  relationship_with_user?: string;
  mobile_number?: string;
  email?: string | null;
  given_names?: string;
  surname?: string;
  passport_number?: string;
  passport_expiry?: string;
  issuing_country?: string;
  user?: number;
  user_name?: string;
  created_at?: string;
  age?: number;
}

//* Request body for adding/removing passengers
export interface AddRemovePassengersRequest {
  passenger_ids: string[];
}

//* Response for adding passengers
export interface AddPassengersResponse {
  added: string[];
  already_added: string[];
  not_found: string[];
  message: string;
}

//* Response for removing passengers
export interface RemovePassengersResponse {
  removed: string[];
  not_in_subscription: string[];
  not_found: string[];
  message: string;
}

//* Unified type for both add/remove passenger responses
export type AddRemovePassengersResponse = AddPassengersResponse | RemovePassengersResponse;

//* Popular subscription plan interface
export interface SubscriptionPopularPlan {
  id: number;
  title: string;
  class_type_name: string | null;
  description: string | null;
  price: string;
  trip_count: number;
  member_count: number;
  allowed_date_change: number;
  subscription_count: number;
}

//* Package origin-destination route interface
export interface PackageODRoute {
  id: string;
  origin_airport: string;
  destination_airport: string;
  origin_airport_code: string;
  destination_airport_code: string;
  origin_airport_city_name: string;
  destination_airport_city_name: string;
  origin_airport_country_name: string;
  destination_airport_country_name: string;
  created_at: string;
  updated_at: string;
}

//* Common API error response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
  details?: string[];
}
