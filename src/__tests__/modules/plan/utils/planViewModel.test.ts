import { toPlanViewModel } from '@/services/planViewModel';
import type { TravelPackage } from '@/lib/types/api/package';
import { mockTravelPackage } from '../__mocks__/planApi';

describe('Plan View Model Utils', () => {
  describe('toPlanViewModel', () => {
    it('should transform travel package to plan view model correctly', () => {
      const result = toPlanViewModel(mockTravelPackage);

      expect(result).toEqual({
        id: '1',
        title: 'Premium Travel Plan',
        price: '₹50,000',
        classLabel: 'ECONOMY class',
        tripsPerYear: '12 trips/year',
        routeLabel: undefined,
        airlinesLabel: 'Air India',
        benefits: ['Priority boarding', 'Extra baggage allowance', 'Lounge access', '24/7 customer support'],
        isActive: false,
        isPopularBadge: false,
      });
    });

    it('should handle package with multiple airlines', () => {
      const packageWithMultipleAirlines: TravelPackage = {
        ...mockTravelPackage,
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
      };

      const result = toPlanViewModel(packageWithMultipleAirlines);

      expect(result.airlinesLabel).toBe('Air India, IndiGo');
    });

    it('should handle package with no airlines', () => {
      const packageWithNoAirlines: TravelPackage = {
        ...mockTravelPackage,
        airlines: [],
      };

      const result = toPlanViewModel(packageWithNoAirlines);

      expect(result.airlinesLabel).toBe('');
    });

    it('should handle package with airlines having only common_name', () => {
      const packageWithCommonNameOnly: TravelPackage = {
        ...mockTravelPackage,
        airlines: [
          {
            id: '1',
            business_name: '',
            common_name: 'IndiGo',
            iata_code: '6E',
            icao_code: 'IGO',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      };

      const result = toPlanViewModel(packageWithCommonNameOnly);

      expect(result.airlinesLabel).toBe('');
    });

    it('should handle package with airlines having only business_name', () => {
      const packageWithBusinessNameOnly: TravelPackage = {
        ...mockTravelPackage,
        airlines: [
          {
            id: '1',
            business_name: 'Air India',
            common_name: '',
            iata_code: 'AI',
            icao_code: 'AIC',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      };

      const result = toPlanViewModel(packageWithBusinessNameOnly);

      expect(result.airlinesLabel).toBe('Air India');
    });

    it('should handle package with no classes', () => {
      const packageWithNoClasses: TravelPackage = {
        ...mockTravelPackage,
        classes: [],
      };

      const result = toPlanViewModel(packageWithNoClasses);

      expect(result.classLabel).toBe('');
    });

    it('should handle package with multiple classes', () => {
      const packageWithMultipleClasses: TravelPackage = {
        ...mockTravelPackage,
        classes: [
          {
            id: '1',
            name: 'BUSINESS',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            name: 'FIRST',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      };

      const result = toPlanViewModel(packageWithMultipleClasses);

      expect(result.classLabel).toBe('BUSINESS, FIRST class');
    });

    it('should handle package with no additional benefits', () => {
      const packageWithNoBenefits: TravelPackage = {
        ...mockTravelPackage,
        additional_benefits: [],
      };

      const result = toPlanViewModel(packageWithNoBenefits);

      expect(result.benefits).toEqual([]);
    });

    it('should handle package with null additional benefits', () => {
      const packageWithNullBenefits: TravelPackage = {
        ...mockTravelPackage,
        additional_benefits: null as unknown as string[],
      };

      const result = toPlanViewModel(packageWithNullBenefits);

      expect(result.benefits).toEqual([]);
    });

    it('should handle package with undefined additional benefits', () => {
      const packageWithUndefinedBenefits: TravelPackage = {
        ...mockTravelPackage,
        additional_benefits: undefined as unknown as string[],
      };

      const result = toPlanViewModel(packageWithUndefinedBenefits);

      expect(result.benefits).toEqual([]);
    });

    it('should handle package with no description', () => {
      const packageWithNoDescription: TravelPackage = {
        ...mockTravelPackage,
        description: null,
      };

      const result = toPlanViewModel(packageWithNoDescription);

      expect(result.benefits).toEqual([
        'Priority boarding',
        'Extra baggage allowance',
        'Lounge access',
        '24/7 customer support',
      ]);
    });

    it('should handle package with undefined description', () => {
      const packageWithUndefinedDescription: TravelPackage = {
        ...mockTravelPackage,
        description: undefined as unknown as string,
      };

      const result = toPlanViewModel(packageWithUndefinedDescription);

      expect(result.benefits).toEqual([
        'Priority boarding',
        'Extra baggage allowance',
        'Lounge access',
        '24/7 customer support',
      ]);
    });

    it('should handle package with zero trip count', () => {
      const packageWithZeroTrips: TravelPackage = {
        ...mockTravelPackage,
        trip_count: 0,
      };

      const result = toPlanViewModel(packageWithZeroTrips);

      expect(result.tripsPerYear).toBe('0 trips/year');
    });

    it('should handle package with single trip', () => {
      const packageWithSingleTrip: TravelPackage = {
        ...mockTravelPackage,
        trip_count: 1,
      };

      const result = toPlanViewModel(packageWithSingleTrip);

      expect(result.tripsPerYear).toBe('1 trip/year');
    });

    it('should handle package with large trip count', () => {
      const packageWithLargeTripCount: TravelPackage = {
        ...mockTravelPackage,
        trip_count: 100,
      };

      const result = toPlanViewModel(packageWithLargeTripCount);

      expect(result.tripsPerYear).toBe('100 trips/year');
    });

    it('should handle package with negative trip count', () => {
      const packageWithNegativeTrips: TravelPackage = {
        ...mockTravelPackage,
        trip_count: -5,
      };

      const result = toPlanViewModel(packageWithNegativeTrips);

      expect(result.tripsPerYear).toBe('-5 trips/year');
    });

    it('should handle package with special characters in title', () => {
      const packageWithSpecialTitle: TravelPackage = {
        ...mockTravelPackage,
        title: 'Premium & Luxury Travel Plan (2024)',
      };

      const result = toPlanViewModel(packageWithSpecialTitle);

      expect(result.title).toBe('Premium & Luxury Travel Plan (2024)');
    });

    it('should handle package with empty title', () => {
      const packageWithEmptyTitle: TravelPackage = {
        ...mockTravelPackage,
        title: '',
      };

      const result = toPlanViewModel(packageWithEmptyTitle);

      expect(result.title).toBe('');
    });

    it('should handle package with empty price', () => {
      const packageWithEmptyPrice: TravelPackage = {
        ...mockTravelPackage,
        price: '',
      };

      const result = toPlanViewModel(packageWithEmptyPrice);

      expect(result.price).toBe('');
    });

    it('should handle package with numeric price', () => {
      const packageWithNumericPrice: TravelPackage = {
        ...mockTravelPackage,
        price: '50000',
      };

      const result = toPlanViewModel(packageWithNumericPrice);

      expect(result.price).toBe('50000');
    });

    it('should handle package with complex additional benefits', () => {
      const packageWithComplexBenefits: TravelPackage = {
        ...mockTravelPackage,
        additional_benefits: [
          'Priority boarding',
          '',
          'Extra baggage allowance',
          null as unknown as string,
          'Lounge access',
          undefined as unknown as string,
          '24/7 customer support',
        ],
      };

      const result = toPlanViewModel(packageWithComplexBenefits);

      expect(result.benefits).toEqual([
        'Priority boarding',
        'Extra baggage allowance',
        'Lounge access',
        '24/7 customer support',
      ]);
    });

    it('should always set isActive to true', () => {
      const result = toPlanViewModel(mockTravelPackage);

      expect(result.isActive).toBe(false);
    });

    it('should always set isPopularBadge to false', () => {
      const result = toPlanViewModel(mockTravelPackage);

      expect(result.isPopularBadge).toBe(false);
    });

    it('should handle package with all optional fields missing', () => {
      const minimalPackage: TravelPackage = {
        id: '1',
        title: 'Basic Plan',
        alias: null,
        description: null,
        trip_count: 1,
        member_count: 1,
        allowed_date_change_count: 0,
        allowed_route_count: 1,
        additional_benefits: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        airlines: [],
        classes: [],
        duration_days: 30,
        package_od_data: [],
        price: '₹10,000',
      };

      const result = toPlanViewModel(minimalPackage);

      expect(result).toEqual({
        id: '1',
        title: 'Basic Plan',
        price: '₹10,000',
        classLabel: '',
        tripsPerYear: '1 trip/year',
        routeLabel: undefined,
        airlinesLabel: '',
        benefits: [],
        isActive: false,
        isPopularBadge: false,
      });
    });
  });
});
