import type { TravelPackage, PackageAirline, PackageClass, PackageListRequest } from '@/lib/types/api/package';
import { AxiosError, AxiosHeaders } from 'axios';

// Mock travel package data
export const mockTravelPackage: TravelPackage = {
  id: '1',
  title: 'Premium Travel Plan',
  alias: 'premium-plan',
  description: 'Premium travel package with luxury amenities',
  trip_count: 12,
  member_count: 4,
  allowed_date_change_count: 3,
  allowed_route_count: 5,
  additional_benefits: ['Priority boarding', 'Extra baggage allowance', 'Lounge access', '24/7 customer support'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  airlines: [
    {
      id: '1',
      business_name: 'Air India',
      common_name: 'Air India',
      iata_code: 'AI',
      icao_code: 'AIC',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  classes: [
    {
      id: '1',
      name: 'ECONOMY',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  duration_days: 365,
  package_od_data: [],
  price: '₹50,000',
};

export const mockTravelPackages: TravelPackage[] = [
  mockTravelPackage,
  {
    id: '2',
    title: 'Standard Travel Plan',
    alias: 'standard-plan',
    description: 'Standard travel package with basic amenities',
    trip_count: 6,
    member_count: 2,
    allowed_date_change_count: 1,
    allowed_route_count: 3,
    additional_benefits: ['Basic support', 'Standard baggage'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    airlines: [
      {
        id: '2',
        business_name: 'IndiGo',
        common_name: 'IndiGo',
        iata_code: '6E',
        icao_code: 'IGO',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
    classes: [
      {
        id: '2',
        name: 'BUSINESS',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
    duration_days: 365,
    package_od_data: [],
    price: '₹25,000',
  },
];

// Mock package airlines
export const mockPackageAirlines: PackageAirline[] = [
  {
    id: '1',
    business_name: 'Air India',
    common_name: 'Air India',
    iata_code: 'AI',
    icao_code: 'AIC',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    business_name: 'IndiGo',
    common_name: 'IndiGo',
    iata_code: '6E',
    icao_code: 'IGO',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    business_name: 'SpiceJet',
    common_name: 'SpiceJet',
    iata_code: 'SG',
    icao_code: 'SEJ',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock package classes
export const mockPackageClasses: PackageClass[] = [
  {
    id: '1',
    name: 'ECONOMY',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'BUSINESS',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'FIRST',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock API request payloads
export const mockPackageListRequest: PackageListRequest = {
  currency_id: '1',
  origin: 'DEL',
  destination: 'BOM',
  class_type: 'ECONOMY',
  airline: 'AI',
};

export const mockPackageListRequestEmpty: PackageListRequest = {};

// Mock successful API responses
export const mockFetchPackagesSuccessResponse = mockTravelPackages;
export const mockFetchPackageByIdSuccessResponse = mockTravelPackage;
export const mockFetchPackageAirlinesSuccessResponse = mockPackageAirlines;
export const mockFetchPackageClassesSuccessResponse = mockPackageClasses;

// Mock error responses
export const mockApiErrorResponse = {
  error: 'Failed to fetch packages',
  details: ['Network error occurred'],
};

// Mock network error
export const mockNetworkError = new Error('Network Error');

// Mock axios error response
export const mockAxiosError = new AxiosError('Request failed with status code 500', '500', undefined, undefined, {
  status: 500,
  data: mockApiErrorResponse,
  statusText: 'Internal Server Error',
  headers: new AxiosHeaders(),
  config: {
    headers: new AxiosHeaders(),
  },
});

// Mock timeout error
export const mockTimeoutError = new AxiosError('timeout of 10000ms exceeded', 'ECONNABORTED');

// Mock currency data
export const mockCurrency = {
  id: '1',
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
};
