import type { TravelPackage } from '@/lib/types/api/package';
import type { PlanViewModel } from '@/services/planViewModel';

// Mock component props
export const mockSubscriptionPlansProps = {
  setSelectedPlans: jest.fn(),
  selectedPlans: ['1', '2'],
};

export const mockPlanCardProps = {
  setSelectedPlans: jest.fn(),
  selectedPlans: ['1'],
  isLoading: false,
  packages: [],
  onTravelClassChange: jest.fn(),
  onAirlinesChange: jest.fn(),
  onOriginChange: jest.fn(),
  onDestinationChange: jest.fn(),
};

export const mockFilterPannelProps = {
  onTravelClassChange: jest.fn(),
  onAirlinesChange: jest.fn(),
  onOriginChange: jest.fn(),
  onDestinationChange: jest.fn(),
  onClose: jest.fn(),
};

// Mock plan view model
export const mockPlanViewModel: PlanViewModel = {
  id: '1',
  title: 'Premium Travel Plan',
  price: '₹50,000',
  classLabel: 'ECONOMY',
  tripsPerYear: '12 trips/year',
  airlinesLabel: 'Air India, IndiGo',
  benefits: ['Priority boarding', 'Extra baggage allowance', 'Lounge access', '24/7 customer support'],
  isActive: true,
  isPopularBadge: false,
};

// Mock travel package for component testing
export const mockTravelPackageForComponent: TravelPackage = {
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
  ],
  duration_days: 365,
  package_od_data: [],
  price: '₹50,000',
};

// Mock filter states
export const mockFilterStates = {
  selectedTravelClasses: ['ECONOMY', 'BUSINESS'],
  selectedAirlines: ['AI', '6E'],
  origin: 'DEL',
  destination: 'BOM',
};

// Mock loading states
export const mockLoadingStates = {
  isLoading: true,
  isLoadingAirlines: true,
  isLoadingTravelClasses: true,
};

// Mock empty states
export const mockEmptyStates = {
  packages: [],
  airlines: [],
  travelClasses: [],
};

// Mock error states
export const mockErrorStates = {
  error: 'Failed to load packages',
  apiError: 'Network error occurred',
};
