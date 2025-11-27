import type { ComparePackageResponse } from '@/lib/types/api/package';

// Mock data for plan compare API
export const mockComparePackagesResponse: ComparePackageResponse[] = [
  {
    id: '1',
    title: 'Basic Plan',
    alias: 'basic',
    description: 'Basic travel package',
    trip_count: 4,
    member_count: 1,
    allowed_date_change_count: 2,
    allowed_route_count: 1,
    additional_benefits: ['Basic support'],
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
    duration_days: 30,
    package_od_data: [],
    price: '₹25,000',
  },
  {
    id: '2',
    title: 'Premium Plan',
    alias: 'premium',
    description: 'Premium travel package',
    trip_count: 8,
    member_count: 2,
    allowed_date_change_count: 4,
    allowed_route_count: 2,
    additional_benefits: ['Priority support', 'Lounge access'],
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
    ],
    duration_days: 60,
    package_od_data: [],
    price: '₹50,000',
  },
  {
    id: '3',
    title: 'VIP Plan',
    alias: 'vip',
    description: 'VIP travel package',
    trip_count: 12,
    member_count: 4,
    allowed_date_change_count: 6,
    allowed_route_count: 3,
    additional_benefits: ['VIP support', 'Lounge access', 'Priority boarding'],
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
        id: '3',
        name: 'FIRST',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
    duration_days: 90,
    package_od_data: [],
    price: '₹100,000',
  },
];

export const mockComparePackagesRequest = {
  packageIds: ['1', '2', '3'],
  currencyId: '1',
};

export const mockComparePackagesRequestEmpty = {
  packageIds: [],
  currencyId: '1',
};

export const mockAxiosError = {
  response: {
    status: 400,
    data: {
      message: 'Invalid package IDs',
      details: ['Package ID 999 not found'],
    },
  },
  message: 'Request failed with status code 400',
  isAxiosError: true,
};

export const mockNetworkError = {
  message: 'Network Error',
  code: 'NETWORK_ERROR',
};

export const mockTimeoutError = {
  message: 'timeout of 5000ms exceeded',
  code: 'ECONNABORTED',
};
