//* This file is part of the OpenAPI Generator project
export interface PackageBenefit {
  id: number;
  name: string;
}

//* Package Flight interface
export interface PackageFlight {
  id: number;
  flight_number: string;
  airline: string;
  departure_time: string;
  arrival_time: string;
  origin: string;
  destination: string;
  class_type: string;
}

//* Location API Types for Travel Package
export interface TravelPackage {
  id: string;
  title: string;
  alias: string | null;
  description: string | null;
  trip_count: number;
  member_count: number;
  allowed_date_change_count: number;
  allowed_route_count: number;
  additional_benefits: string[];
  created_at: string;
  updated_at: string;
  airlines: PackageAirline[];
  classes: PackageClass[];
  duration_days: number;
  package_od_data: unknown[]; // This can be typed more specifically if needed
  price: string;
}

//* Request interface for fetching travel packages
export interface PackageListRequest {
  currency_id?: string; // currency ID from localStorage
  origin?: string; // origin city ID (optional for fetching all packages)
  destination?: string; // destination city ID (optional for fetching all packages)
  class_type?: string; // comma-separated class type IDs (e.g., "1,2")
  airline?: string; // comma-separated airline IDs (e.g., "1,2")
}

//* Airline interface for package airlines API
export interface PackageAirline {
  id: string;
  common_name: string;
  business_name: string;
  iata_code: string;
  icao_code: string;
  created_at: string;
  updated_at: string;
}

//* Class interface for package classes API
export interface PackageClass {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

//* Request interface for fetching package airlines
export interface PackageAirlinesRequest {
  origin?: string; // origin city ID
  destination?: string; // destination city ID
}

//* Request interface for fetching package classes
export interface PackageClassesRequest {
  origin?: string; // origin city ID
  destination?: string; // destination city ID
}

//* Response interface for fetching travel packages
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  // Some endpoints use alternate error fields
  error?: string;
  details?: string[];
}

//* Compare packages response - only includes fields returned by the API
//* This is a partial TravelPackage that dynamically includes only fields from backend
export type ComparePackageResponse = Partial<TravelPackage> & {
  id: string;
  title: string;
  [key: string]: unknown;
};
