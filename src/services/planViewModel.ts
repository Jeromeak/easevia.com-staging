import type { TravelPackage, PackageAirline } from '@/lib/types/api/package';

export interface PlanViewModel {
  id: string;
  title: string;
  classLabel: string;
  tripsPerYear: string;
  routeLabel?: string;
  airlinesLabel: string;
  price: string;
  benefits: string[];
  isPopularBadge: boolean;
  isActive: boolean;
}

const toAirlinesLabel = (airlines?: PackageAirline[]): string => {
  if (!Array.isArray(airlines) || airlines.length === 0) return '';

  return airlines
    .map((a) => (typeof a?.business_name === 'string' ? a.business_name.trim() : a?.common_name?.trim() || ''))
    .filter((name) => name.length > 0)
    .join(', ');
};

export const toPlanViewModel = (plan: TravelPackage): PlanViewModel => {
  // Get class names from the classes array
  const classNames = Array.isArray(plan.classes) ? plan.classes.map((c) => c.name).join(', ') : '';
  const classLabel = classNames ? `${classNames} class` : '';

  const tripsPerYear =
    typeof plan.trip_count === 'number' ? `${plan.trip_count} ${plan.trip_count === 1 ? 'trip' : 'trips'}/year` : '';

  return {
    id: plan.id,
    title: plan.title,
    classLabel,
    tripsPerYear,
    routeLabel: undefined, // No route info in new API structure
    airlinesLabel: toAirlinesLabel(plan.airlines),
    price: plan.price,
    benefits: Array.isArray(plan.additional_benefits) ? plan.additional_benefits.filter(Boolean) : [],
    isPopularBadge: false,
    isActive: false,
  };
};
