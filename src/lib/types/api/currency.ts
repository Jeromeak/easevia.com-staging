//* This file is part of the Open Food Facts project.
export interface Currency {
  id: string;
  country: string;
  currency_name: string;
  currency_symbol: string;
  base_rate: string;
  created_at: string;
  updated_at: string;
}

//* API response for currency data
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
