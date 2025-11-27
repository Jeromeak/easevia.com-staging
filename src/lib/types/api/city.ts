//* This file is part of the OpenAPI Generator project
export interface City {
  id: number;
  name: string;
  country: string;
  created_at: string;
  updated_at: string | null;
}

//* Location API Types for City
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
